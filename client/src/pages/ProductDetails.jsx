import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { API_BASE_URL } from '../config';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const fetchProduct = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/products/${id}`);
            setProduct(data);
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`Added ${quantity} ${product.name} to cart!`);
    };

    if (loading) {
        return (
            <div className="page-loading">
                <div className="loading"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container">
                <div className="empty-state">
                    <h2>Product not found</h2>
                    <button onClick={() => navigate('/shop')} className="btn btn-primary">
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-details-page">
            <div className="container">
                <button onClick={() => navigate('/shop')} className="back-btn">
                    ← Back to Shop
                </button>

                <div className="product-details-grid">
                    <div className="product-image-section">
                        {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="product-main-image" />
                        ) : (
                            <div className="product-placeholder-large">
                                <span>{product.category}</span>
                            </div>
                        )}
                    </div>

                    <div className="product-info-section">
                        <p className="product-category-badge">{product.category}</p>
                        <p className="product-sku-large">SKU: {product.sku}</p>
                        <h1>{product.name}</h1>
                        <p className="product-price-large">₹{product.price.toLocaleString()}</p>

                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        {product.specs && (
                            <div className="product-specifications">
                                <h3>Technical Specifications</h3>
                                <div className="specs-grid">
                                    {product.specs.material && (
                                        <div className="spec-item">
                                            <span className="spec-label">Material:</span>
                                            <span className="spec-value">{product.specs.material}</span>
                                        </div>
                                    )}
                                    {product.specs.coating && (
                                        <div className="spec-item">
                                            <span className="spec-label">Coating:</span>
                                            <span className="spec-value">{product.specs.coating}</span>
                                        </div>
                                    )}
                                    {product.specs.diameter && (
                                        <div className="spec-item">
                                            <span className="spec-label">Diameter:</span>
                                            <span className="spec-value">{product.specs.diameter} mm</span>
                                        </div>
                                    )}
                                    {product.specs.flutes > 0 && (
                                        <div className="spec-item">
                                            <span className="spec-label">Flutes:</span>
                                            <span className="spec-value">{product.specs.flutes}</span>
                                        </div>
                                    )}
                                    {product.specs.shankDiameter > 0 && (
                                        <div className="spec-item">
                                            <span className="spec-label">Shank Diameter:</span>
                                            <span className="spec-value">{product.specs.shankDiameter} mm</span>
                                        </div>
                                    )}
                                    {product.specs.overallLength > 0 && (
                                        <div className="spec-item">
                                            <span className="spec-label">Overall Length:</span>
                                            <span className="spec-value">{product.specs.overallLength} mm</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="product-stock">
                            <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                            </span>
                        </div>

                        <div className="product-actions">
                            <div className="quantity-selector">
                                <label>Quantity:</label>
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="quantity-btn"
                                    >
                                        -
                                    </button>
                                    <span className="quantity-display">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="quantity-btn"
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="btn btn-primary add-to-cart-btn"
                                disabled={product.stock === 0}
                            >
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
