import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { logout, isAuthenticated, isAdmin } = useContext(AuthContext);
    const { count } = useContext(CartContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo">
                    <img src="/images/K.png" alt="KGW Logo" className="logo-image" />
                    <span className="logo-text">KGW</span>
                </Link>

                <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
                    <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
                    <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

                    {isAuthenticated && isAdmin && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
                    )}
                </div>

                <div className="nav-actions">
                    {/* Cart */}
                    <Link to="/cart" className="cart-link">
                        <span className="cart-icon">🛒</span>
                        {count > 0 && <span className="cart-count">{count}</span>}
                    </Link>

                    {/* Auth */}
                    {isAuthenticated ? (
                        <button onClick={handleLogout} className="btn-nav">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="btn-nav">
                            Login
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="menu-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
