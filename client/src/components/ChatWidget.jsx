import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import './ChatWidget.css';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const MOOD_META = {
    neutral: { emoji: '😊', label: 'Neutral', color: '#16a34a' },
    curious: { emoji: '🤔', label: 'Curious', color: '#2563eb' },
    frustrated: { emoji: '😤', label: 'Frustrated', color: '#dc2626' },
    urgent: { emoji: '🚨', label: 'Urgent', color: '#dc2626' },
};

let socketInstance = null;
function getSocket() {
    if (!socketInstance) {
        socketInstance = io(SOCKET_URL, { autoConnect: false });
    }
    return socketInstance;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ChatWidget() {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState('info'); // 'info' | 'chat' | 'waiting' | 'live'
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [mood, setMood] = useState('neutral');
    const [urgency, setUrgency] = useState(1);
    const [roomId, setRoomId] = useState(null);
    const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
    const [infoErrors, setInfoErrors] = useState({});
    const [hasUnread, setHasUnread] = useState(false);
    const [chatSummary, setChatSummary] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const socket = getSocket();

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && step === 'chat') inputRef.current?.focus();
    }, [isOpen, step]);

    // Pre-fill info from logged-in user
    useEffect(() => {
        if (user) {
            setUserInfo(prev => ({
                name: prev.name || user.name || '',
                email: prev.email || user.email || '',
                phone: prev.phone || '',
            }));
        }
    }, [user]);

    // Socket setup
    useEffect(() => {
        socket.connect();

        socket.on('chat_accepted', ({ roomId: rid }) => {
            setRoomId(rid);
            socket.emit('join_room', { roomId: rid });
            setStep('live');
            addMessage('system', '✅ You are now connected with a KGW team member.');
        });

        socket.on('chat_message', ({ sender, text }) => {
            if (sender === 'admin') {
                addMessage('bot', text);
                if (!isOpen) setHasUnread(true);
            }
        });

        socket.on('chat_ended', () => {
            addMessage('system', '👋 The chat session has ended. We hope we helped!');
            setStep('chat');
            setRoomId(null);
        });

        return () => {
            socket.off('chat_accepted');
            socket.off('chat_message');
            socket.off('chat_ended');
        };
        // eslint-disable-next-line
    }, []);

    function addMessage(role, text) {
        setMessages(prev => [...prev, { role, text, ts: Date.now() }]);
    }

    // ── Info form validation ────────────────────────────────────────────────
    function validateInfo() {
        const errs = {};
        if (!userInfo.name.trim()) errs.name = 'Required';
        if (!userInfo.email.trim() || !/\S+@\S+\.\S+/.test(userInfo.email)) errs.email = 'Valid email required';
        if (!userInfo.phone.trim()) errs.phone = 'Required';
        setInfoErrors(errs);
        return Object.keys(errs).length === 0;
    }

    function startChat() {
        if (!validateInfo()) return;
        addMessage('bot', `Hi ${userInfo.name.split(' ')[0]}! 👋 I'm the KGW virtual assistant. How can I help you today? You can ask about products, pricing, availability, or anything else.`);
        setStep('chat');
    }

    // ── Send message to Gemini ──────────────────────────────────────────────
    async function sendMessage(text = input.trim()) {
        if (!text || loading) return;
        setInput('');
        addMessage('user', text);
        setLoading(true);

        const updatedMessages = [...messages, { role: 'user', text }];

        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/chat`, {
                messages: updatedMessages,
                name: userInfo.name,
                email: userInfo.email,
                phone: userInfo.phone,
            });

            addMessage('bot', data.reply);
            setMood(data.mood);
            setUrgency(data.urgency);
            setChatSummary(data.summary);

            // Auto-suggest human handoff on high urgency
            if (data.urgency >= 8 && step === 'chat') {
                setTimeout(() => {
                    addMessage('system', '⚡ It sounds like this is urgent. Would you like to speak directly with a team member?');
                }, 600);
            }

            // Auto-fire pipeline if resolved
            if (data.resolved) {
                fireContactPipeline(data.summary);
            }
        } catch (err) {
            addMessage('system', "\u26A0\uFE0F Sorry, I'm having trouble right now. Please try again or call us at +91 8104999122.");
        } finally {
            setLoading(false);
        }
    }

    // ── Live typing → socket ────────────────────────────────────────────────
    function sendLiveMessage(text = input.trim()) {
        if (!text || !roomId) return;
        setInput('');
        addMessage('user', text);
        socket.emit('chat_message', { roomId, sender: 'user', text });
    }

    // ── Request human handoff ───────────────────────────────────────────────
    function requestHuman() {
        setStep('waiting');
        addMessage('system', '⏳ Connecting you to a KGW team member… please hold on.');
        socket.emit('live_chat_request', {
            name: userInfo.name,
            email: userInfo.email,
            mood,
            urgency,
            summary: chatSummary || 'Customer requested human support.',
        });
    }

    // ── Fire Phase-1 pipeline (Sheets + Email) ───────────────────────────────
    async function fireContactPipeline(summary) {
        const fullText = messages
            .filter(m => m.role === 'user')
            .map(m => m.text)
            .join(' | ');
        try {
            await axios.post(`${API_BASE_URL}/api/contact`, {
                name: userInfo.name,
                email: userInfo.email,
                phone: userInfo.phone,
                message: fullText || 'AI chat session',
                mood, urgency, summary,
                source: 'chat',
            });
        } catch (e) { /* non-fatal */ }
    }

    function handleOpen() {
        setIsOpen(true);
        setHasUnread(false);
    }

    const moodData = MOOD_META[mood] || MOOD_META.neutral;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="chat-widget-wrapper">
            {/* Floating toggle button */}
            <button
                className={`chat-fab ${isOpen ? 'chat-fab--open' : ''}`}
                onClick={() => isOpen ? setIsOpen(false) : handleOpen()}
                aria-label="Chat with KGW"
                id="chat-widget-fab"
            >
                {isOpen ? '✕' : '💬'}
                {hasUnread && <span className="chat-fab__badge" />}
            </button>

            {/* Chat panel */}
            {isOpen && (
                <div className="chat-panel" role="dialog" aria-label="KGW Chat">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="chat-header__info">
                            <div className="chat-header__avatar">KGW</div>
                            <div>
                                <div className="chat-header__name">KGW Assistant</div>
                                <div className="chat-header__status">
                                    {step === 'live' ? '🟢 Live with agent' : '🤖 AI Support'}
                                </div>
                            </div>
                        </div>
                        {step === 'chat' && (
                            <div className="chat-mood-pill" style={{ '--mood-color': moodData.color }}>
                                {moodData.emoji} {moodData.label}
                                {urgency >= 5 && <span className="chat-urgency">{urgency}/10</span>}
                            </div>
                        )}
                    </div>

                    {/* ── Info collection step ─── */}
                    {step === 'info' && (
                        <div className="chat-body chat-body--form">
                            <p className="chat-intro">Hi there! Before we chat, tell us a bit about yourself.</p>
                            {['name', 'email', 'phone'].map(field => (
                                <div className="chat-field" key={field}>
                                    <label htmlFor={`cw-${field}`}>
                                        {field === 'name' ? 'Full Name' : field === 'email' ? 'Email Address' : 'Phone Number'}
                                        {' *'}
                                    </label>
                                    <input
                                        id={`cw-${field}`}
                                        type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                                        value={userInfo[field]}
                                        onChange={e => setUserInfo(prev => ({ ...prev, [field]: e.target.value }))}
                                        placeholder={field === 'name' ? 'John Doe' : field === 'email' ? 'john@example.com' : '+91 XXXXXXXXXX'}
                                        onKeyDown={e => e.key === 'Enter' && startChat()}
                                        className={infoErrors[field] ? 'error' : ''}
                                    />
                                    {infoErrors[field] && <span className="field-error">{infoErrors[field]}</span>}
                                </div>
                            ))}
                            <button className="chat-start-btn" onClick={startChat}>
                                Start Chat →
                            </button>
                        </div>
                    )}

                    {/* ── Chat messages ─── */}
                    {(step === 'chat' || step === 'waiting' || step === 'live') && (
                        <>
                            <div className="chat-body chat-messages">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`chat-bubble chat-bubble--${msg.role}`}>
                                        {msg.role === 'bot' && (
                                            <div className="chat-bubble__avatar">🤖</div>
                                        )}
                                        {msg.role === 'live-admin' && (
                                            <div className="chat-bubble__avatar">👤</div>
                                        )}
                                        <div className="chat-bubble__text">{msg.text}</div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="chat-bubble chat-bubble--bot">
                                        <div className="chat-bubble__avatar">🤖</div>
                                        <div className="chat-bubble__text chat-typing">
                                            <span /><span /><span />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input area */}
                            <div className="chat-footer">
                                {step === 'chat' && (
                                    <button
                                        className="chat-human-btn"
                                        onClick={requestHuman}
                                        title="Talk to a team member"
                                    >
                                        👤 Human
                                    </button>
                                )}
                                <input
                                    ref={inputRef}
                                    className="chat-input"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            step === 'live' ? sendLiveMessage() : sendMessage();
                                        }
                                    }}
                                    placeholder={
                                        step === 'waiting' ? 'Connecting…' :
                                            step === 'live' ? 'Message our team…' :
                                                'Type your message…'
                                    }
                                    disabled={loading || step === 'waiting'}
                                    id="chat-input-field"
                                />
                                <button
                                    className="chat-send-btn"
                                    onClick={() => step === 'live' ? sendLiveMessage() : sendMessage()}
                                    disabled={loading || !input.trim() || step === 'waiting'}
                                    aria-label="Send"
                                >
                                    ➤
                                </button>
                            </div>

                            {/* End chat link */}
                            {(step === 'chat' || step === 'live') && (
                                <div className="chat-end-row">
                                    <button
                                        className="chat-end-btn"
                                        onClick={() => {
                                            if (step === 'live' && roomId) {
                                                socket.emit('chat_end', { roomId });
                                            } else {
                                                fireContactPipeline(chatSummary);
                                            }
                                            addMessage('system', '✅ Chat ended. Have a great day!');
                                            setStep('info');
                                            setMessages([]);
                                            setMood('neutral');
                                            setUrgency(1);
                                        }}
                                    >
                                        End chat
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
