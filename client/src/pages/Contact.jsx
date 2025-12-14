import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.post(`${API_BASE_URL}/api/contact`, formData);
            setStatus({
                type: 'success',
                message: 'Thank you! We\'ll get back to you soon.'
            });
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to send message. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">
            <div className="page-hero">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you</p>
            </div>

            <div className="container">
                <div className="contact-grid">
                    <div className="contact-form-section">
                        <h2>Send us a Message</h2>

                        {status.message && (
                            <div className={`message ${status.type === 'success' ? 'success-message' : 'error-message'}`}>
                                {status.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="Your name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    placeholder="+91 XXXXXXXXXX"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    rows="5"
                                    placeholder="Tell us about your requirements..."
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    <div className="contact-info-section">
                        <h2>Get in Touch</h2>

                        <div className="contact-info-card">
                            <div className="info-item">
                                <div className="info-icon">📍</div>
                                <div>
                                    <h4>Visit Us</h4>
                                    <p>
                                        Ground Floor Plot No.268<br />
                                        C/O Kulswamini Grinding Works<br />
                                        Near Thakur Engg Work<br />
                                        Pokhran Road No.01<br />
                                        Thane - 400606
                                    </p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">📞</div>
                                <div>
                                    <h4>Call Us</h4>
                                    <p>
                                        <a href="tel:+918104999122">+91 8104999122</a>
                                    </p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">✉️</div>
                                <div>
                                    <h4>Email Us</h4>
                                    <p>
                                        <a href="mailto:kulswaminigw@gmail.com">kulswaminigw@gmail.com</a>
                                    </p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">🕒</div>
                                <div>
                                    <h4>Business Hours</h4>
                                    <p>
                                        Monday - Saturday: 9:00 AM - 6:00 PM<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="social-connect">
                            <h3>Connect With Us</h3>
                            <div className="social-links">
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
