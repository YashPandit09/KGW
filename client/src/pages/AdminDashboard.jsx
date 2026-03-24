import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import BulkUpload from '../components/BulkUpload';
import { API_BASE_URL } from '../config';
import './AdminDashboard.css';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const MOOD_META = {
    neutral: { emoji: '😊', color: '#16a34a' },
    curious: { emoji: '🤔', color: '#2563eb' },
    frustrated: { emoji: '😤', color: '#dc2626' },
    urgent: { emoji: '🚨', color: '#dc2626' },
};

export default function AdminDashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // ── Standard dashboard state
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    // ── Phase 3: Live chat state
    const [pendingRequests, setPendingRequests] = useState([]); // incoming handoff requests
    const [activeSessions, setActiveSessions] = useState({}); // roomId → { messages, user info }
    const [activeLiveTab, setActiveLiveTab] = useState(null); // which room is open in UI
    const [liveInput, setLiveInput] = useState('');
    const socketRef = useRef(null);

    // ── Connect socket as admin
    useEffect(() => {
        const socket = io(SOCKET_URL);
        socketRef.current = socket;

        socket.emit('admin_join');

        socket.on('incoming_chat_request', (data) => {
            setPendingRequests(prev => {
                // avoid duplicates
                if (prev.find(r => r.userId === data.userId)) return prev;
                return [...prev, data];
            });
            // Switch to live-chat tab automatically
            setActiveTab('live-chat');
        });

        socket.on('chat_message', ({ sender, text, roomId }) => {
            if (sender === 'user') {
                setActiveSessions(prev => ({
                    ...prev,
                    [roomId]: {
                        ...prev[roomId],
                        messages: [...(prev[roomId]?.messages || []), { sender, text, ts: Date.now() }],
                    },
                }));
            }
        });

        socket.on('chat_ended', ({ roomId }) => {
            setActiveSessions(prev => {
                const next = { ...prev };
                if (next[roomId]) next[roomId].ended = true;
                return next;
            });
        });

        return () => socket.disconnect();
    }, []);

    // ── Accept incoming chat request
    function acceptRequest(req) {
        const socket = socketRef.current;
        socket.emit('admin_accept', { userId: req.userId });

        socket.once('chat_accepted', ({ roomId }) => {
            setActiveSessions(prev => ({
                ...prev,
                [roomId]: {
                    userId: req.userId,
                    name: req.name,
                    email: req.email,
                    mood: req.mood,
                    urgency: req.urgency,
                    summary: req.summary,
                    messages: [],
                    ended: false,
                },
            }));
            setPendingRequests(prev => prev.filter(r => r.userId !== req.userId));
            setActiveLiveTab(roomId);
        });
    }

    // ── Send live message as admin
    function sendAdminMessage() {
        if (!liveInput.trim() || !activeLiveTab) return;
        const text = liveInput.trim();
        setLiveInput('');
        socketRef.current.emit('chat_message', {
            roomId: activeLiveTab,
            sender: 'admin',
            text,
        });
        setActiveSessions(prev => ({
            ...prev,
            [activeLiveTab]: {
                ...prev[activeLiveTab],
                messages: [...(prev[activeLiveTab]?.messages || []), { sender: 'admin', text, ts: Date.now() }],
            },
        }));
    }

    function endSession(roomId) {
        socketRef.current.emit('chat_end', { roomId });
        setActiveSessions(prev => {
            const next = { ...prev };
            if (next[roomId]) next[roomId].ended = true;
            return next;
        });
        if (activeLiveTab === roomId) setActiveLiveTab(null);
    }

    // ── Product / Contact fetch
    useEffect(() => {
        if (activeTab === 'products') fetchProducts();
        else if (activeTab === 'contacts') fetchContacts();
    }, [activeTab]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/products`);
            setProducts(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/contact`);
            setContacts(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try { await axios.delete(`${API_BASE_URL}/api/products/${id}`); fetchProducts(); }
        catch { alert('Failed to delete product'); }
    };

    const handleContactStatusUpdate = async (id, newStatus) => {
        try { await axios.put(`${API_BASE_URL}/api/contact/${id}`, { status: newStatus }); fetchContacts(); }
        catch { alert('Failed to update status'); }
    };

    const activeSessKeys = Object.keys(activeSessions);
    const liveCount = pendingRequests.length + activeSessKeys.filter(k => !activeSessions[k].ended).length;

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div className="container">
                    <div className="header-content">
                        <div>
                            <h1>Admin Dashboard</h1>
                            <p>Welcome, {user?.name}</p>
                        </div>
                        <button onClick={logout} className="btn btn-secondary">Logout</button>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* ── Tabs ── */}
                <div className="dashboard-tabs">
                    <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                        Products ({products.length})
                    </button>
                    <button className={`tab-btn ${activeTab === 'bulk-upload' ? 'active' : ''}`} onClick={() => setActiveTab('bulk-upload')}>
                        📦 Bulk Upload
                    </button>
                    <button className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>
                        Contact Submissions ({contacts.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'live-chat' ? 'active' : ''}`}
                        onClick={() => setActiveTab('live-chat')}
                        style={{ position: 'relative' }}
                    >
                        🔴 Live Chat
                        {liveCount > 0 && (
                            <span className="live-badge">{liveCount}</span>
                        )}
                    </button>
                </div>

                {loading ? (
                    <div className="page-loading"><div className="loading" /></div>
                ) : (
                    <>
                        {/* ── Products ── */}
                        {activeTab === 'products' && (
                            <div className="products-section">
                                <div className="section-header">
                                    <h2>Product Management</h2>
                                    <button className="btn btn-primary" onClick={() => alert('Add Product feature coming soon!')}>+ Add Product</button>
                                </div>
                                {products.length > 0 ? (
                                    <div className="table-container">
                                        <table className="admin-table">
                                            <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead>
                                            <tbody>
                                                {products.map(p => (
                                                    <tr key={p._id}>
                                                        <td>{p.name}</td>
                                                        <td><span className="category-badge">{p.category}</span></td>
                                                        <td>₹{p.price.toLocaleString()}</td>
                                                        <td><span className={p.stock > 10 ? 'stock-good' : 'stock-low'}>{p.stock}</span></td>
                                                        <td>{p.featured ? '⭐' : '-'}</td>
                                                        <td>
                                                            <button className="action-btn edit-btn" onClick={() => navigate(`/product/${p._id}`)}>View</button>
                                                            <button className="action-btn delete-btn" onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="empty-state"><p>No products found.</p><code>cd server &amp;&amp; node seed.js</code></div>
                                )}
                            </div>
                        )}

                        {/* ── Bulk Upload ── */}
                        {activeTab === 'bulk-upload' && (
                            <div className="bulk-upload-section">
                                <BulkUpload onUploadComplete={fetchProducts} />
                            </div>
                        )}

                        {/* ── Contacts ── */}
                        {activeTab === 'contacts' && (
                            <div className="contacts-section">
                                <h2>Contact Submissions</h2>
                                {contacts.length > 0 ? (
                                    <div className="table-container">
                                        <table className="admin-table">
                                            <thead>
                                                <tr><th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Message/Summary</th><th>Mood</th><th>Urgency</th><th>Source</th><th>Status</th><th>Actions</th></tr>
                                            </thead>
                                            <tbody>
                                                {contacts.map(c => {
                                                    const m = MOOD_META[c.mood] || MOOD_META.neutral;
                                                    return (
                                                        <tr key={c._id}>
                                                            <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                                            <td>{c.name}</td>
                                                            <td><a href={`mailto:${c.email}`}>{c.email}</a></td>
                                                            <td><a href={`tel:${c.phone}`}>{c.phone}</a></td>
                                                            <td className="message-cell">{c.summary || c.message}</td>
                                                            <td>{m.emoji} {c.mood}</td>
                                                            <td>{c.urgency}/10</td>
                                                            <td><span className={`source-badge source-${c.source}`}>{c.source}</span></td>
                                                            <td><span className={`status-badge status-${c.status}`}>{c.status}</span></td>
                                                            <td>
                                                                {c.status === 'pending' && (
                                                                    <button className="action-btn respond-btn" onClick={() => handleContactStatusUpdate(c._id, 'responded')}>Mark Responded</button>
                                                                )}
                                                                {c.status === 'responded' && (
                                                                    <button className="action-btn close-btn" onClick={() => handleContactStatusUpdate(c._id, 'closed')}>Close</button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="empty-state"><p>No contact submissions yet</p></div>
                                )}
                            </div>
                        )}

                        {/* ── Live Chat (Phase 3) ── */}
                        {activeTab === 'live-chat' && (
                            <div className="live-chat-section">
                                <h2>Live Chat Console</h2>

                                {/* Pending requests */}
                                {pendingRequests.length > 0 && (
                                    <div className="pending-requests">
                                        <h3>⏳ Incoming Requests</h3>
                                        <div className="request-cards">
                                            {pendingRequests.map(req => {
                                                const m = MOOD_META[req.mood] || MOOD_META.neutral;
                                                const urgColor = req.urgency >= 8 ? '#dc2626' : req.urgency >= 5 ? '#f59e0b' : '#16a34a';
                                                return (
                                                    <div key={req.userId} className="request-card">
                                                        <div className="request-card__header">
                                                            <span className="request-card__name">👤 {req.name}</span>
                                                            <span className="request-card__urgency" style={{ color: urgColor }}>
                                                                🔴 {req.urgency}/10
                                                            </span>
                                                        </div>
                                                        <div className="request-card__meta">
                                                            <span>{m.emoji} Mood: <strong style={{ color: m.color }}>{req.mood}</strong></span>
                                                            {req.email && <span>📧 {req.email}</span>}
                                                        </div>
                                                        {req.summary && (
                                                            <div className="request-card__summary">
                                                                💬 {req.summary}
                                                            </div>
                                                        )}
                                                        <button className="accept-btn" onClick={() => acceptRequest(req)}>
                                                            ✅ Accept Chat
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Active sessions */}
                                {activeSessKeys.length > 0 && (
                                    <div className="active-sessions">
                                        <h3>💬 Active Sessions</h3>
                                        <div className="session-tabs">
                                            {activeSessKeys.map(rid => {
                                                const s = activeSessions[rid];
                                                return (
                                                    <button
                                                        key={rid}
                                                        className={`session-tab-btn ${activeLiveTab === rid ? 'active' : ''} ${s.ended ? 'ended' : ''}`}
                                                        onClick={() => setActiveLiveTab(rid)}
                                                    >
                                                        {s.ended ? '✓' : '🟢'} {s.name}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {activeLiveTab && activeSessions[activeLiveTab] && (() => {
                                            const sess = activeSessions[activeLiveTab];
                                            const m = MOOD_META[sess.mood] || MOOD_META.neutral;
                                            const messagesEndRef = React.createRef();
                                            return (
                                                <div className="live-chat-panel">
                                                    <div className="live-chat-panel__meta">
                                                        <span>👤 <strong>{sess.name}</strong></span>
                                                        <span>{m.emoji} {sess.mood}</span>
                                                        <span style={{ color: sess.urgency >= 8 ? '#dc2626' : '#f59e0b' }}>⚡ {sess.urgency}/10</span>
                                                        {sess.email && <span>📧 {sess.email}</span>}
                                                    </div>
                                                    {sess.summary && (
                                                        <div className="live-chat-panel__summary">💬 {sess.summary}</div>
                                                    )}
                                                    <div className="live-chat-messages">
                                                        {sess.messages.map((msg, i) => (
                                                            <div key={i} className={`admin-bubble admin-bubble--${msg.sender}`}>
                                                                <span className="admin-bubble__who">{msg.sender === 'admin' ? 'You' : sess.name}</span>
                                                                <p className="admin-bubble__text">{msg.text}</p>
                                                            </div>
                                                        ))}
                                                        <div ref={messagesEndRef} />
                                                    </div>
                                                    {!sess.ended ? (
                                                        <>
                                                            <div className="live-chat-input-row">
                                                                <input
                                                                    className="live-input"
                                                                    value={liveInput}
                                                                    onChange={e => setLiveInput(e.target.value)}
                                                                    onKeyDown={e => e.key === 'Enter' && sendAdminMessage()}
                                                                    placeholder={`Reply to ${sess.name}…`}
                                                                    id="admin-live-input"
                                                                />
                                                                <button className="btn btn-primary" onClick={sendAdminMessage}>Send</button>
                                                            </div>
                                                            <button className="end-session-btn" onClick={() => endSession(activeLiveTab)}>
                                                                End Session
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="session-ended-msg">Session ended</div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {pendingRequests.length === 0 && activeSessKeys.length === 0 && (
                                    <div className="empty-state">
                                        <p>No active live chat sessions. Incoming requests will appear here automatically.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
