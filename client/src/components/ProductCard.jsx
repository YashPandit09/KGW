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
        <div className="product-card">
            <Link to={`/product/${product._id}`} className="product-link">
                <div className="product-image">
                    {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} />
                    ) : (
                        <div className="product-placeholder">
                            <span>{product.category}</span>
                        </div>
                    )}
                    {product.isFeatured && <span className="featured-badge">Featured</span>}
                </div>

                <div className="product-info">
                    <p className="product-sku">SKU: {product.sku}</p>
                    <p className="product-category">{product.category}</p>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-specs">
                        <span className="spec-badge">{product.specs.material}</span>
                        {product.specs.coating && product.specs.coating !== 'Uncoated' && (
                            <span className="spec-badge coating">{product.specs.coating}</span>
                        )}
                        <span className="spec-badge">Ø{product.specs.diameter}mm</span>
                        {product.specs.flutes > 0 && (
                            <span className="spec-badge">{product.specs.flutes}FL</span>
                        )}
                    </div>
                    <div className="product-footer">
                        <p className="product-price">₹{product.price.toLocaleString()}</p>
                        <button
                            onClick={handleAddToCart}
                            className="btn-add-cart"
                            disabled={product.stock === 0}
                        >
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
