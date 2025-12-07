const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Solid Carbide Endmill"
    sku: { type: String, unique: true, required: true }, // e.g., "KGW-EM-401"
    category: {
        type: String,
        required: true,
        enum: ['Endmills', 'Drills', 'Reamers', 'Inserts', 'Taps']
    },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },

    // Technical Specs for Filtering
    specs: {
        material: {
            type: String,
            required: true,
            enum: ['Carbide', 'HSS', 'Cobalt', 'High-Speed Steel']
        },
        coating: { type: String, default: 'Uncoated' }, // e.g., "TiAlN", "TiN", "AlTiN"
        diameter: { type: Number, required: true }, // in mm
        flutes: { type: Number }, // Number of cutting edges
        shankDiameter: { type: Number }, // Shank diameter in mm
        overallLength: { type: Number } // Total length in mm
    },

    images: [String], // Array of image URLs
    description: { type: String },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

// Index for better query performance
ProductSchema.index({ category: 1, 'specs.material': 1, 'specs.diameter': 1 });
ProductSchema.index({ sku: 1 });

module.exports = mongoose.model('Product', ProductSchema);
