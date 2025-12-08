import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
        alert(`${product.name} added to cart!`);
    };

    return (
        <Link to={`/product/${product._id}`} className="product-card-link">
            <div className="product-card">
                {/* Image Section */}
                <div className="product-image-compact">
                    {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} />
                    ) : (
                        <div className="product-placeholder-compact">
                            <span>{product.category}</span>
                        </div>
                    )}
                    {product.isFeatured && <span className="featured-badge-compact">★</span>}
                </div>

                {/* Info Section */}
                <div className="product-info-compact">
                    <div className="product-header-compact">
                        <span className="product-sku-compact">{product.sku}</span>
                        <span className="product-category-compact">{product.category}</span>
                    </div>

                    <h3 className="product-name-compact">{product.name}</h3>

                    {/* Critical Specs - Displayed Prominently */}
                    <div className="specs-compact">
                        <div className="spec-item-compact">
                            <span className="spec-icon">⌀</span>
                            <span>{product.specs.diameter}mm</span>
                        </div>
                        <div className="spec-item-compact">
                            <span className="spec-icon">⚙</span>
                            <span>{product.specs.material}</span>
                        </div>
                        {product.specs.coating && product.specs.coating !== 'Uncoated' && (
                            <div className="spec-item-compact coating">
                                <span className="spec-icon">✦</span>
                                <span>{product.specs.coating}</span>
                            </div>
                        )}
                        {product.specs.flutes > 0 && (
                            <div className="spec-item-compact">
                                <span className="spec-icon">↗</span>
                                <span>{product.specs.flutes}FL</span>
                            </div>
                        )}
                    </div>

                    {/* Footer: Price + Action */}
                    <div className="product-footer-compact">
                        <span className="product-price-compact">₹{product.price.toLocaleString()}</span>
                        <button
                            onClick={handleAddToCart}
                            className="btn-compact"
                            disabled={product.stock === 0}
                        >
                            {product.stock === 0 ? 'Out of Stock' : '+ Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
