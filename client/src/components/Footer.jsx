import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-about">
                    <h3>Kulswamini Grinding Works</h3>
                    <p>Premium Cutting Tools since 2001</p>
                    <p className="footer-address">
                        Ground Floor Plot No.268, Near Thakur Engg Work,<br />
                        Pokhran Road No.01, Thane - 400606
                    </p>
                </div>

                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <Link to="/">Home</Link>
                    <Link to="/shop">Shop</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                </div>

                <div className="footer-contact">
                    <h4>Contact Us</h4>
                    <p>📞 +91 8104999122</p>
                    <p>✉️ kulswaminigw@gmail.com</p>

                    <div className="footer-social">
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            LinkedIn
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            Instagram
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            Facebook
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} Kulswamini Grinding Works. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
