require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Professional industrial tool products with proper specifications
const sampleProducts = [
    // Carbide Endmills
    {
        name: 'Solid Carbide End Mill - 4 Flute',
        sku: 'KGW-EM-401',
        category: 'Endmills',
        price: 1250,
        stock: 25,
        specs: {
            material: 'Carbide',
            coating: 'TiAlN',
            diameter: 10,
            flutes: 4,
            shankDiameter: 10,
            overallLength: 75
        },
        images: ['/images/Carbide Endmill.jpg'],
        description: 'High-performance solid carbide end mill with TiAlN coating. Ideal for general machining of steels and alloys. Provides excellent surface finish and extended tool life.',
        isFeatured: true
    },
    {
        name: 'Carbide Ball Nose End Mill - 2 Flute',
        sku: 'KGW-EM-202',
        category: 'Endmills',
        price: 1450,
        stock: 18,
        specs: {
            material: 'Carbide',
            coating: 'AlTiN',
            diameter: 8,
            flutes: 2,
            shankDiameter: 8,
            overallLength: 60
        },
        description: 'Precision carbide ball nose end mill with AlTiN coating for 3D contouring and complex surface machining. Perfect for mold and die applications.',
        isFeatured: false
    },
    {
        name: 'Carbide Roughing End Mill - 4 Flute',
        sku: 'KGW-EM-403',
        category: 'Endmills',
        price: 2100,
        stock: 15,
        specs: {
            material: 'Carbide',
            coating: 'Uncoated',
            diameter: 16,
            flutes: 4,
            shankDiameter: 16,
            overallLength: 80
        },
        description: 'Aggressive cutting carbide roughing end mill designed for high material removal rates. Serrated cutting edges for efficient chip evacuation.',
        isFeatured: true
    },

    // HSS Drills
    {
        name: 'HSS Twist Drill - Jobber Length',
        sku: 'KGW-DR-101',
        category: 'Drills',
        price: 450,
        stock: 42,
        specs: {
            material: 'High-Speed Steel',
            coating: 'TiN',
            diameter: 10,
            flutes: 2,
            shankDiameter: 10,
            overallLength: 133
        },
        images: ['/images/Highspeed.png'],
        description: 'Professional quality HSS twist drill with TiN coating. 118° point angle for general purpose drilling in various materials.',
        isFeatured: true
    },
    {
        name: 'HSS Step Drill - Multi-Diameter',
        sku: 'KGW-DR-102',
        category: 'Drills',
        price: 850,
        stock: 28,
        specs: {
            material: 'HSS',
            coating: 'Black Oxide',
            diameter: 30, // max diameter
            flutes: 2,
            shankDiameter: 10,
            overallLength: 95
        },
        description: 'Multi-step drill for sheet metal and thin materials. Creates multiple hole sizes with a single tool. Steps from 6mm to 30mm.',
        isFeatured: false
    },

    // Cobalt Drills
    {
        name: 'Cobalt Drill - Heavy Duty',
        sku: 'KGW-DR-CO-103',
        category: 'Drills',
        price: 680,
        stock: 35,
        specs: {
            material: 'Cobalt',
            coating: 'Steam Treated',
            diameter: 12,
            flutes: 2,
            shankDiameter: 12,
            overallLength: 151
        },
        description: '5% cobalt HSS drill for hard materials including stainless steel and heat-treated alloys. Superior heat resistance and wear properties.',
        isFeatured: false
    },

    // Reamers
    {
        name: 'HSS Straight Flute Reamer',
        sku: 'KGW-RE-201',
        category: 'Reamers',
        price: 720,
        stock: 20,
        specs: {
            material: 'High-Speed Steel',
            coating: 'Uncoated',
            diameter: 12,
            flutes: 6,
            shankDiameter: 11.5,
            overallLength: 100
        },
        description: 'Precision ground HSS reamer for achieving H7 tolerance and excellent surface finish. Straight flute design for through holes.',
        isFeatured: false
    },

    // Taps
    {
        name: 'HSS Machine Tap Set - M6-M12',
        sku: 'KGW-TP-301',
        category: 'Taps',
        price: 950,
        stock: 15,
        specs: {
            material: 'High-Speed Steel',
            coating: 'TiN',
            diameter: 12, // max tap size
            flutes: 4,
            shankDiameter: 9.5,
            overallLength: 85
        },
        description: 'Complete metric tap set with TiN coating. Includes taper, plug, and bottoming taps for M6, M8, M10, and M12 threads.',
        isFeatured: false
    },

    // Inserts
    {
        name: 'Carbide Turning Insert - CNMG 120408',
        sku: 'KGW-IN-401',
        category: 'Inserts',
        price: 380,
        stock: 100,
        specs: {
            material: 'Carbide',
            coating: 'TiCN',
            diameter: 12.7, // inscribed circle
            flutes: 0, // not applicable
            shankDiameter: 0,
            overallLength: 12.7
        },
        description: 'Unground carbide turning insert with TiCN coating. Negative rake angle for general turning operations on steel and cast iron.',
        isFeatured: false
    }
];

async function seedProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        // Insert sample products
        const products = await Product.insertMany(sampleProducts);
        console.log(`\n✅ Successfully seeded ${products.length} products!`);

        // Display summary by category
        console.log('\n📊 Products by category:');
        const categories = {};
        products.forEach(p => {
            categories[p.category] = (categories[p.category] || 0) + 1;
        });
        Object.entries(categories).forEach(([cat, count]) => {
            console.log(`   - ${cat}: ${count}`);
        });

        // Display summary by material
        console.log('\n🔧 Products by material:');
        const materials = {};
        products.forEach(p => {
            materials[p.specs.material] = (materials[p.specs.material] || 0) + 1;
        });
        Object.entries(materials).forEach(([mat, count]) => {
            console.log(`   - ${mat}: ${count}`);
        });

        // Featured products
        console.log('\n⭐ Featured products:');
        products.filter(p => p.isFeatured).forEach(p => {
            console.log(`   - [${p.sku}] ${p.name} (₹${p.price})`);
        });

        console.log('\n✨ Seeding complete!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
}

// Run the seed function
seedProducts();
