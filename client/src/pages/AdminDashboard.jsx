import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import BulkUpload from '../components/BulkUpload';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'products') {
            fetchProducts();
        } else if (activeTab === 'contacts') {
            fetchContacts();
        }
    }, [activeTab]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/products');
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/contact');
            setContacts(data);
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await axios.delete(`/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    const handleContactStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`/api/contact/${id}`, { status: newStatus });
            fetchContacts();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div className="container">
                    <div className="header-content">
                        <div>
                            <h1>Admin Dashboard</h1>
                            <p>Welcome, {user?.name}</p>
                        </div>
                        <button onClick={logout} className="btn btn-secondary">Logout</button>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        Products ({products.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'bulk-upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bulk-upload')}
                    >
                        📦 Bulk Upload
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('contacts')}
                    >
                        Contact Submissions ({contacts.length})
                    </button>
                </div>

                {loading ? (
                    <div className="page-loading">
                        <div className="loading"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'products' && (
                            <div className="products-section">
                                <div className="section-header">
                                    <h2>Product Management</h2>
                                    <button className="btn btn-primary" onClick={() => alert('Add Product feature coming soon!')}>
                                        + Add Product
                                    </button>
                                </div>

                                {products.length > 0 ? (
                                    <div className="table-container">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Category</th>
                                                    <th>Price</th>
                                                    <th>Stock</th>
                                                    <th>Featured</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map(product => (
                                                    <tr key={product._id}>
                                                        <td>{product.name}</td>
                                                        <td>
                                                            <span className="category-badge">{product.category}</span>
                                                        </td>
                                                        <td>₹{product.price.toLocaleString()}</td>
                                                        <td>
                                                            <span className={product.stock > 10 ? 'stock-good' : 'stock-low'}>
                                                                {product.stock}
                                                            </span>
                                                        </td>
                                                        <td>{product.featured ? '⭐' : '-'}</td>
                                                        <td>
                                                            <button
                                                                className="action-btn edit-btn"
                                                                onClick={() => navigate(`/product/${product._id}`)}
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                className="action-btn delete-btn"
                                                                onClick={() => handleDeleteProduct(product._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <p>No products found. Run the seed script to add sample products.</p>
                                        <code>cd server && node seed.js</code>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'bulk-upload' && (
                            <div className="bulk-upload-section">
                                <BulkUpload onUploadComplete={fetchProducts} />
                            </div>
                        )}

                        {activeTab === 'contacts' && (
                            <div className="contacts-section">
                                <h2>Contact Submissions</h2>

                                {contacts.length > 0 ? (
                                    <div className="table-container">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Message</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {contacts.map(contact => (
                                                    <tr key={contact._id}>
                                                        <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                                                        <td>{contact.name}</td>
                                                        <td><a href={`mailto:${contact.email}`}>{contact.email}</a></td>
                                                        <td><a href={`tel:${contact.phone}`}>{contact.phone}</a></td>
                                                        <td className="message-cell">{contact.message}</td>
                                                        <td>
                                                            <span className={`status-badge status-${contact.status}`}>
                                                                {contact.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {contact.status === 'pending' && (
                                                                <button
                                                                    className="action-btn respond-btn"
                                                                    onClick={() => handleContactStatusUpdate(contact._id, 'responded')}
                                                                >
                                                                    Mark Responded
                                                                </button>
                                                            )}
                                                            {contact.status === 'responded' && (
                                                                <button
                                                                    className="action-btn close-btn"
                                                                    onClick={() => handleContactStatusUpdate(contact._id, 'closed')}
                                                                >
                                                                    Close
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <p>No contact submissions yet</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
