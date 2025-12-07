import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="page-hero">
                <h1>About Us</h1>
                <p>Premium Cutting Tools since 2001</p>
            </div>

            <div className="container">
                <section className="about-intro">
                    <h2>Kulswamini Grinding Works</h2>
                    <p className="lead-text">
                        Established in 2001, Kulswamini Grinding Works is a leading manufacturer of premium cutting tools with over two decades of excellence in the tooling industry. Our state-of-the-art facility produces high-quality carbide and high-speed steel tools to meet the demands of modern manufacturing.
                    </p>
                </section>

                <section className="stats-section">
                    <div className="stat-card-large">
                        <div className="stat-number">20+</div>
                        <p>Years of Experience</p>
                    </div>
                    <div className="stat-card-large">
                        <div className="stat-number">500+</div>
                        <p>Satisfied Clients</p>
                    </div>
                    <div className="stat-card-large">
                        <div className="stat-number">100%</div>
                        <p>Quality Assurance</p>
                    </div>
                </section>

                <section className="company-info">
                    <div className="info-grid">
                        <div className="info-card">
                            <div className="info-icon">🎯</div>
                            <h3>Our Mission</h3>
                            <p>
                                To provide our customers with the highest quality cutting tools that enhance productivity, reduce costs, and deliver exceptional performance in demanding manufacturing environments.
                            </p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">👁️</div>
                            <h3>Our Vision</h3>
                            <p>
                                To be recognized as India's most trusted and innovative manufacturer of precision cutting tools, setting industry standards for quality and customer service.
                            </p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">⚙️</div>
                            <h3>Our Expertise</h3>
                            <p>
                                Specializing in carbide and high-speed steel tooling with advanced grinding capabilities, we serve diverse industries including automotive, aerospace, and general manufacturing.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="why-choose">
                    <h2>Why Choose Us?</h2>
                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <span className="benefit-icon">✓</span>
                            <div>
                                <h4>Premium Quality</h4>
                                <p>Every tool is manufactured to the highest standards with rigorous quality control</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">✓</span>
                            <div>
                                <h4>Custom Solutions</h4>
                                <p>Tailored tooling solutions to meet specific customer requirements</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">✓</span>
                            <div>
                                <h4>Expert Support</h4>
                                <p>Technical guidance and support from experienced tooling professionals</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">✓</span>
                            <div>
                                <h4>Competitive Pricing</h4>
                                <p>Best value for premium quality cutting tools</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">✓</span>
                            <div>
                                <h4>On-Time Delivery</h4>
                                <p>Reliable delivery schedules to keep your production running smoothly</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">✓</span>
                            <div>
                                <h4>Wide Range</h4>
                                <p>Comprehensive selection of carbide and HSS tools for all applications</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="cta-section">
                    <h2>Ready to Experience the Difference?</h2>
                    <p>Discover our range of premium cutting tools and elevate your manufacturing capabilities</p>
                    <div className="cta-buttons">
                        <Link to="/shop" className="btn btn-primary">Browse Products</Link>
                        <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
