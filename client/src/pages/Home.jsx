import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../images/grinding-hero.jpg.jpg';
import './Home.css';

const Home = () => {
    const heroStyle = {
        background: `linear-gradient(rgba(41, 37, 36, 0.75), rgba(68, 64, 60, 0.85)), url(${heroImage}) center/cover no-repeat`,
        backgroundAttachment: 'fixed'
    };

    return (
        <div className="home">
            <section className="hero" style={heroStyle}>
                <div className="hero-content">
                    <h1 className="fade-in">Welcome to<br />Kulswamini Grinding Works</h1>
                    <p className="fade-in">Your trusted partner in premium cutting tools and tooling solutions since 2001</p>
                    <div className="hero-buttons">
                        <Link to="/shop" className="btn btn-primary">Explore Products</Link>
                        <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
                    </div>
                </div>
            </section>

            <section className="products-preview">
                <div className="container">
                    <h2 className="text-center">Our Product Categories</h2>
                    <div className="category-grid">
                        <div className="category-card">
                            <div className="category-icon">⚙️</div>
                            <h3>Carbide Tools</h3>
                            <p>Premium carbide cutting tools engineered for precision and durability in demanding manufacturing applications</p>
                            <Link to="/shop?category=carbide" className="btn btn-primary">View Carbide</Link>
                        </div>
                        <div className="category-card">
                            <div className="category-icon">🔧</div>
                            <h3>High-Speed Steel</h3>
                            <p>High-performance tools designed for exceptional cutting efficiency and extended tool life</p>
                            <Link to="/shop?category=highspeed" className="btn btn-primary">View Highspeed</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-preview">
                <div className="container">
                    <div className="about-content">
                        <h2>Established in 2001</h2>
                        <p>Kulswamini Grinding Works is a leading manufacturer of premium cutting tools with over two decades of excellence in the tooling industry.</p>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-number">20+</div>
                                <p>Years of Experience</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">500+</div>
                                <p>Satisfied Clients</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">100%</div>
                                <p>Quality Assurance</p>
                            </div>
                        </div>
                        <Link to="/about" className="btn btn-secondary">Learn More</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
