const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// Advanced filtering API for B2B customers
// GET /api/products?category=Endmills&diameter=10&material=Carbide&coating=TiAlN
router.get('/', async (req, res) => {
    try {
        const {
            category,
            material,
            coating,
            diameter,
            diameterMin,
            diameterMax,
            flutes,
            search,
            featured,
            sortBy,
            limit,
            page
        } = req.query;

        // Build dynamic query object for MongoDB
        let query = {};

        // Category filter
        if (category) query.category = category;

        // Technical spec filters
        if (material) query['specs.material'] = material;
        if (coating) query['specs.coating'] = coating;

        // Diameter filtering (exact or range)
        if (diameter) {
            query['specs.diameter'] = Number(diameter);
        } else if (diameterMin || diameterMax) {
            query['specs.diameter'] = {};
            if (diameterMin) query['specs.diameter'].$gte = Number(diameterMin);
            if (diameterMax) query['specs.diameter'].$lte = Number(diameterMax);
        }

        // Flutes filter
        if (flutes) query['specs.flutes'] = Number(flutes);

        // Featured products
        if (featured === 'true') query.isFeatured = true;

        // Text search across name, SKU, and description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Sorting
        let sortOptions = {};
        switch (sortBy) {
            case 'price-asc':
                sortOptions.price = 1;
                break;
            case 'price-desc':
                sortOptions.price = -1;
                break;
            case 'name':
                sortOptions.name = 1;
                break;
            case 'newest':
                sortOptions.createdAt = -1;
                break;
            default:
                sortOptions.createdAt = -1; // Default: newest first
        }

        // Pagination
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 50; // Default 50 products per page
        const skip = (pageNum - 1) * limitNum;

        // Execute query with pagination
        const products = await Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        // Get total count for pagination
        const total = await Product.countDocuments(query);

        res.json({
            products,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum),
                limit: limitNum
            }
        });
    } catch (err) {
        console.error('Filter error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get unique filter values for dropdown population
router.get('/filters', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        const materials = await Product.distinct('specs.material');
        const coatings = await Product.distinct('specs.coating');
        const diameters = await Product.distinct('specs.diameter');
        const flutes = await Product.distinct('specs.flutes');

        res.json({
            categories: categories.sort(),
            materials: materials.sort(),
            coatings: coatings.filter(c => c && c !== 'Uncoated').sort(),
            diameters: diameters.filter(d => d > 0).sort((a, b) => a - b),
            flutes: flutes.filter(f => f > 0).sort((a, b) => a - b)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single product by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new product (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update product (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete product (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
