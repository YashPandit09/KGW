const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// Configure multer for CSV file upload
const upload = multer({ dest: 'uploads/' });

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

// CSV Bulk Upload (Admin only)
router.post('/bulk-upload', protect, authorize('admin'), upload.single('csvFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const products = [];
        const errors = [];
        let lineNumber = 0;

        // Read and parse CSV file
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (row) => {
                lineNumber++;
                try {
                    // Validate required fields
                    if (!row.name || !row.sku || !row.category || !row.price) {
                        errors.push({
                            line: lineNumber,
                            message: 'Missing required fields (name, sku, category, price)',
                            data: row
                        });
                        return;
                    }

                    // Parse product data
                    const product = {
                        name: row.name.trim(),
                        sku: row.sku.trim(),
                        category: row.category.trim(),
                        price: parseFloat(row.price),
                        stock: parseInt(row.stock) || 0,
                        specs: {
                            material: row.material || '',
                            coating: row.coating || 'Uncoated',
                            diameter: parseFloat(row.diameter) || 0,
                            flutes: parseInt(row.flutes) || 0,
                            shankDiameter: parseFloat(row.shankDiameter) || 0,
                            overallLength: parseFloat(row.overallLength) || 0
                        },
                        description: row.description || '',
                        images: row.images ? row.images.split('|').map(img => img.trim()) : [],
                        isFeatured: row.isFeatured === 'true' || row.isFeatured === '1'
                    };

                    products.push(product);
                } catch (err) {
                    errors.push({
                        line: lineNumber,
                        message: err.message,
                        data: row
                    });
                }
            })
            .on('end', async () => {
                // Delete uploaded file
                fs.unlinkSync(req.file.path);

                if (products.length === 0) {
                    return res.status(400).json({
                        message: 'No valid products found in CSV',
                        errors
                    });
                }

                try {
                    // Insert products in bulk
                    const result = await Product.insertMany(products, { ordered: false });

                    res.json({
                        message: `Successfully uploaded ${result.length} products`,
                        uploaded: result.length,
                        errors: errors.length > 0 ? errors : undefined,
                        failed: errors.length
                    });
                } catch (err) {
                    // Handle duplicate SKU errors
                    const duplicates = err.writeErrors?.map(e => ({
                        sku: products[e.index]?.sku,
                        message: 'Duplicate SKU'
                    })) || [];

                    res.json({
                        message: `Uploaded ${products.length - duplicates.length} products`,
                        uploaded: products.length - duplicates.length,
                        errors: [...errors, ...duplicates],
                        failed: errors.length + duplicates.length
                    });
                }
            })
            .on('error', (err) => {
                fs.unlinkSync(req.file.path);
                res.status(500).json({ message: 'Error parsing CSV: ' + err.message });
            });
    } catch (error) {
        console.error('Bulk upload error:', error);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

// Download CSV template
router.get('/csv-template', protect, authorize('admin'), (req, res) => {
    const template = `name,sku,category,material,coating,diameter,flutes,shankDiameter,overallLength,price,stock,description,images,isFeatured
Solid Carbide End Mill,KGW-EM-001,Endmills,Carbide,TiAlN,10,4,10,75,1250,25,High-performance solid carbide end mill,/images/endmill.jpg,true
HSS Twist Drill,KGW-DR-001,Drills,High-Speed Steel,TiN,8,2,8,100,450,50,Professional quality HSS drill,,false`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=product-template.csv');
    res.send(template);
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
