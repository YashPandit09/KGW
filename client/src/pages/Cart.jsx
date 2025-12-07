import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, total, clearCart } = useContext(CartContext);

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-state">
                        <h2>Your cart is empty</h2>
                        <p>Start shopping to add items to your cart</p>
                        <Link to="/shop" className="btn btn-primary">Browse Products</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="page-hero">
                <h1>Shopping Cart</h1>
                <p>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
            </div>

            <div className="container">
                <div className="cart-content">
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item._id} className="cart-item">
                                <div className="item-image">
                                    {item.images && item.images[0] ? (
                                        <img src={item.images[0]} alt={item.name} />
                                    ) : (
                                        <div className="image-placeholder">{item.category}</div>
                                    )}
                                </div>

                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p className="item-category">{item.category}</p>
                                    <p className="item-price">₹{item.price.toLocaleString()}</p>
                                </div>

                                <div className="item-quantity">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        className="quantity-btn"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="quantity-btn"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="item-total">
                                    <p>₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="remove-btn"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total:</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>
                        <button className="btn btn-primary checkout-btn">
                            Proceed to Checkout
                        </button>
                        <button onClick={clearCart} className="btn btn-secondary">
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
