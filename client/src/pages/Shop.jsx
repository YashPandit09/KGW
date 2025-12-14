import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { API_BASE_URL } from '../config';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        category: '',
        material: '',
        coating: '',
        diameter: '',
        flutes: '',
        search: '',
        sortBy: 'newest'
    });

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            // Add all active filters to params
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const { data } = await axios.get(`${API_BASE_URL}/api/products?${params.toString()}`);

            // Handle both old and new API response formats
            if (data.products) {
                // New format with pagination
                setProducts(data.products);
                setPagination(data.pagination);
            } else if (Array.isArray(data)) {
                // Old format - direct array
                setProducts(data);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            category: '',
            material: '',
            coating: '',
            diameter: '',
            flutes: '',
            search: '',
            sortBy: 'newest'
        });
    };

    return (
        <div className="shop-page">
            <div className="page-hero">
                <h1>Shop Our Products</h1>
                <p>Professional cutting tools with technical specifications</p>
            </div>

            <div className="container">
                <div className="shop-layout">
                    <aside className="shop-sidebar">
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={handleClearFilters}
                        />
                    </aside>

                    <div className="shop-content">
                        <div className="shop-header">
                            <input
                                type="text"
                                placeholder="Search by name, SKU, or description..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="search-input"
                            />

                            {pagination.total > 0 && (
                                <p className="results-count">
                                    Showing {products.length} of {pagination.total} products
                                </p>
                            )}
                        </div>

                        {loading ? (
                            <div className="page-loading">
                                <div className="loading"></div>
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="products-grid">
                                    {products.map(product => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {pagination.pages > 1 && (
                                    <div className="pagination">
                                        <p>Page {pagination.page} of {pagination.pages}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="empty-state">
                                <h3>No products found</h3>
                                <p>Try adjusting your filters or search query</p>
                                <button onClick={handleClearFilters} className="btn btn-primary">
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
