import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './FilterSidebar.css';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
    const [availableFilters, setAvailableFilters] = useState({
        categories: [],
        materials: [],
        coatings: [],
        diameters: [],
        flutes: []
    });

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    const fetchFilterOptions = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/products/filters`);
            setAvailableFilters(data);
        } catch (error) {
            console.error('Failed to fetch filter options:', error);
        }
    };

    const handleFilterChange = (filterName, value) => {
        onFilterChange({ ...filters, [filterName]: value });
    };

    const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length;

    return (
        <div className="filter-sidebar">
            <div className="filter-header">
                <h3>Filters</h3>
                {activeFilterCount > 0 && (
                    <button onClick={onClearFilters} className="clear-filters-btn">
                        Clear ({activeFilterCount})
                    </button>
                )}
            </div>

            <div className="filter-section">
                <label className="filter-label">Category</label>
                <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Categories</option>
                    {availableFilters.categories?.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="filter-section">
                <label className="filter-label">Material</label>
                <select
                    value={filters.material || ''}
                    onChange={(e) => handleFilterChange('material', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Materials</option>
                    {availableFilters.materials?.map(mat => (
                        <option key={mat} value={mat}>{mat}</option>
                    ))}
                </select>
            </div>

            <div className="filter-section">
                <label className="filter-label">Coating</label>
                <select
                    value={filters.coating || ''}
                    onChange={(e) => handleFilterChange('coating', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Coatings</option>
                    {availableFilters.coatings?.map(coat => (
                        <option key={coat} value={coat}>{coat}</option>
                    ))}
                </select>
            </div>

            <div className="filter-section">
                <label className="filter-label">Diameter (mm)</label>
                <select
                    value={filters.diameter || ''}
                    onChange={(e) => handleFilterChange('diameter', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Diameters</option>
                    {availableFilters.diameters?.map(dia => (
                        <option key={dia} value={dia}>Ø{dia} mm</option>
                    ))}
                </select>
            </div>

            <div className="filter-section">
                <label className="filter-label">Flutes</label>
                <select
                    value={filters.flutes || ''}
                    onChange={(e) => handleFilterChange('flutes', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All</option>
                    {availableFilters.flutes?.map(fl => (
                        <option key={fl} value={fl}>{fl} Flute{fl > 1 ? 's' : ''}</option>
                    ))}
                </select>
            </div>

            <div className="filter-section">
                <label className="filter-label">Sort By</label>
                <select
                    value={filters.sortBy || 'newest'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="filter-select"
                >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name (A-Z)</option>
                </select>
            </div>
        </div>
    );
};

export default FilterSidebar;
