import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
    const { count } = useContext(CartContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
    };

    return (
        <header className="navbar">
            <div className="nav-container">
                <div className="logo-container">
                    <img src="/images/K.png" alt="Kulswamini Logo" className="logo-img" />
                    <Link to="/" className="logo">Kulswamini Grinding Works</Link>
                </div>

                <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
                    <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
                    <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

                    <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
                        <span className="cart-icon">🛒</span>
                        Cart ({count})
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
                            <button onClick={handleLogout} className="btn-logout">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>Login</Link>
                    )}
                </nav>

                <button
                    className={`mobile-menu-btn ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
