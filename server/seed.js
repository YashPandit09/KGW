require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Comprehensive professional industrial tool products with proper specifications
const sampleProducts = [
    // ========== CARBIDE ENDMILLS ==========
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
        images: ['/images/Carbide Endmill.jpg'],
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
        images: ['/images/Carbide Endmill.jpg'],
        description: 'Aggressive cutting carbide roughing end mill designed for high material removal rates. Serrated cutting edges for efficient chip evacuation.',
        isFeatured: true
    },
    {
        name: 'Micro Carbide End Mill - 2 Flute',
        sku: 'KGW-EM-204',
        category: 'Endmills',
        price: 890,
        stock: 30,
        specs: {
            material: 'Carbide',
            coating: 'TiAlN',
            diameter: 3,
            flutes: 2,
            shankDiameter: 3,
            overallLength: 50
        },
        images: ['/images/Carbide Endmill.jpg'],
        description: 'Ultra-precision micro end mill for fine detail work and small feature machining. Ideal for electronics and medical device manufacturing.',
        isFeatured: false
    },
    {
        name: 'Carbide Corner Radius End Mill - 4 Flute',
        sku: 'KGW-EM-405',
        category: 'Endmills',
        price: 1580,
        stock: 22,
        specs: {
            material: 'Carbide',
            coating: 'TiAlN',
            diameter: 12,
            flutes: 4,
            shankDiameter: 12,
            overallLength: 83
        },
        images: ['/images/Carbide Endmill.jpg'],
        description: 'Corner radius end mill with R1.0 radius for stronger cutting edge and improved surface finish. Reduces chipping and extends tool life.',
        isFeatured: false
    },
    {
        name: 'Long Reach Carbide End Mill - 4 Flute',
        sku: 'KGW-EM-406',
        category: 'Endmills',
        price: 2450,
        stock: 12,
        specs: {
            material: 'Carbide',
            coating: 'AlTiN',
            diameter: 10,
            flutes: 4,
            shankDiameter: 10,
            overallLength: 150
        },
        images: ['/images/Carbide Endmill.jpg'],
        description: 'Extended length carbide end mill for deep pocket machining and hard-to-reach areas. Extra-rigid design minimizes deflection.',
        isFeatured: false
    },
    {
        name: 'Carbide Tapered Ball Nose - 2 Flute',
        sku: 'KGW-EM-207',
        category: 'Endmills',
        price: 3200,
        stock: 8,
        specs: {
            material: 'Carbide',
            coating: 'AlTiN',
            diameter: 6,
            flutes: 2,
            shankDiameter: 6,
            overallLength: 75
        },
        images: ['/images/Carbide Endmill.jpg'],
        description: 'Tapered ball nose end mill for 3D profiling and finishing operations. Excellent for mold and die work with complex geometries.',
        isFeatured: false
    },
    {
        name: 'High Feed Carbide End Mill - 3 Flute',
        sku: 'KGW-EM-308',
        category: 'Endmills',
        price: 1980,
        stock: 16,
        specs: {
            material: 'Carbide',
            coating: 'TiAlN',
            diameter: 14,
            flutes: 3,
            shankDiameter: 14,
            overallLength: 90
        },
        images: ['/images/Carbide Endmill.jpg'],
        description: 'High-feed design for aggressive roughing at increased feed rates. Optimized chip evacuation and reduced cutting forces.',
        isFeatured: true
    },

    // ========== HSS & COBALT DRILLS ==========
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
        images: ['/images/HIghspeed.png'],
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
            diameter: 30,
            flutes: 2,
            shankDiameter: 10,
            overallLength: 95
        },
        images: ['/images/HIghspeed.png'],
        description: 'Multi-step drill for sheet metal and thin materials. Creates multiple hole sizes with a single tool. Steps from 6mm to 30mm.',
        isFeatured: false
    },
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
        images: ['/images/HIghspeed.png'],
        description: '5% cobalt HSS drill for hard materials including stainless steel and heat-treated alloys. Superior heat resistance and wear properties.',
        isFeatured: false
    },
    {
        name: 'HSS Center Drill - 60°',
        sku: 'KGW-DR-104',
        category: 'Drills',
        price: 320,
        stock: 50,
        specs: {
            material: 'High-Speed Steel',
            coating: 'Uncoated',
            diameter: 3.15,
            flutes: 2,
            shankDiameter: 6,
            overallLength: 60
        },
        images: ['/images/HIghspeed.png'],
        description: 'Precision center drill for accurate hole starting and countersinking. 60° included angle, ideal for lathe work.',
        isFeatured: false
    },
    {
        name: 'Cobalt Drill Set - 1-13mm (25pc)',
        sku: 'KGW-DR-CO-105',
        category: 'Drills',
        price: 8500,
        stock: 6,
        specs: {
            material: 'Cobalt',
            coating: 'TiN',
            diameter: 13,
            flutes: 2,
            shankDiameter: 13,
            overallLength: 151
        },
        images: ['/images/HIghspeed.png'],
        description: 'Complete 25-piece cobalt drill set from 1.0mm to 13.0mm in 0.5mm increments. Professional grade with storage case.',
        isFeatured: true
    },
    {
        name: 'HSS Spot Drill - 90°',
        sku: 'KGW-DR-106',
        category: 'Drills',
        price: 580,
        stock: 24,
        specs: {
            material: 'High-Speed Steel',
            coating: 'TiN',
            diameter: 12,
            flutes: 2,
            shankDiameter: 10,
            overallLength: 70
        },
        images: ['/images/HIghspeed.png'],
        description: '90° spot drill for accurate hole positioning and preventing drill walk. Creates precise chamfers before drilling.',
        isFeatured: false
    },
    {
        name: 'Cobalt Taper Shank Drill',
        sku: 'KGW-DR-CO-107',
        category: 'Drills',
        price: 2100,
        stock: 10,
        specs: {
            material: 'Cobalt',
            coating: 'Steam Treated',
            diameter: 25,
            flutes: 2,
            shankDiameter: 25,
            overallLength: 290
        },
        images: ['/images/HIghspeed.png'],
        description: 'Heavy-duty cobalt drill with Morse taper shank for large diameter drilling in difficult materials. MT3 taper.',
        isFeatured: false
    },
    {
        name: 'HSS Parabolic Drill - Long Series',
        sku: 'KGW-DR-108',
        category: 'Drills',
        price: 950,
        stock: 18,
        specs: {
            material: 'High-Speed Steel',
            coating: 'TiAlN',
            diameter: 8,
            flutes: 2,
            shankDiameter: 8,
            overallLength: 165
        },
        images: ['/images/HIghspeed.png'],
        description: 'Extra-long parabolic flute drill for deep hole drilling with excellent chip evacuation. Ideal for automotive applications.',
        isFeatured: false
    },

    // ========== REAMERS ==========
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
        images: ['/images/HIghspeed.png'],
        description: 'Precision ground HSS reamer for achieving H7 tolerance and excellent surface finish. Straight flute design for through holes.',
        isFeatured: false
    },
    {
        name: 'Chucking Reamer - HSS',
        sku: 'KGW-RE-202',
        category: 'Reamers',
        price: 680,
        stock: 25,
        specs: {
            material: 'High-Speed Steel',
            coating: 'TiN',
            diameter: 10,
            flutes: 6,
            shankDiameter: 10,
            overallLength: 95
        },
        images: ['/images/HIghspeed.png'],
        description: 'Machine chucking reamer with right-hand cut and right-hand spiral. Produces H7 tolerance holes with superior finish.',
        isFeatured: false
    },
    {
        name: 'Carbide Reamer - Straight Flute',
        sku: 'KGW-RE-203',
        category: 'Reamers',
        price: 1850,
        stock: 12,
        specs: {
            material: 'Carbide',
            coating: 'TiAlN',
            diameter: 8,
            flutes: 6,
            shankDiameter: 8,
            overallLength: 80
        },
        images: ['/images/Carbide Endmill.jpg'],
        description: 'Solid carbide straight flute reamer for precision sizing and finishing. Maintains tight tolerances in abrasive materials.',
        isFeatured: false
    },
    {
        name: 'Adjustable Hand Reamer',
        sku: 'KGW-RE-204',
        category: 'Reamers',
        price: 1250,
        stock: 8,
        specs: {
            material: 'High-Speed Steel',
            coating: 'Uncoated',
            diameter: 15,
            flutes: 6,
            shankDiameter: 12,
            overallLength: 180
        },
        images: ['/images/HIghspeed.png'],
        description: 'Adjustable expansion hand reamer for manual operations. Range: 13.5mm to 15.5mm with fine adjustment capability.',
        isFeatured: false
    },
    {
        name: 'Bridge Reamer - HSS',
        sku: 'KGW-RE-205',
        category: 'Reamers',
        price: 890,
        stock: 15,
        specs: {
            material: 'High-Speed Steel',
            coating: 'Uncoated',
            diameter: 16,
            flutes: 8,
            shankDiameter: 16,
            overallLength: 145
        },
        images: ['/images/HIghspeed.png'],
        description: 'Heavy-duty bridge reamer with interrupted cutting edges. Ideal for reaming castings and rough holes.',
        isFeatured: false
    },

    // ========== TAPS ==========
    {
        name: 'HSS Machine Tap Set - M6-M12',
        sku: 'KGW-TP-301',
        category: 'Taps',
        price: 950,
        stock: 15,
        specs: {
            material: 'High-Speed Steel',
            coating: 'TiN',
            diameter: 12,
            flutes: 4,
            shankDiameter: 9.5,
            overallLength: 85
        },
        images: ['/images/HIghspeed.png'],
        description: 'Complete metric tap set with TiN coating. Includes taper, plug, and bottoming taps for M6, M8, M10, and M12 threads.',
        isFeatured: false
    },
    {
        name: 'Spiral Point Tap - M8',
        sku: 'KGW-TP-302',
        category: 'Taps',
        price: 420,
        stock: 32,
        specs: {
            material: 'High-Speed Steel',
            coating: 'TiN',
            diameter: 8,
            flutes: 3,
            shankDiameter: 6.3,
            overallLength: 75
        },
        images: ['/images/HIghspeed.png'],
        description: 'Spiral point (gun) tap for through-hole threading. Pushes chips forward, ideal for CNC operations in steel and alloys.',
        isFeatured: false
    },
    {
        name: 'Spiral Flute Tap - M10',
        sku: 'KGW-TP-303',
        category: 'Taps',
        price: 680,
        stock: 20,
        specs: {
            material: 'High-Speed Steel',
            coating: 'TiCN',
            diameter: 10,
            flutes: 3,
            shankDiameter: 8,
            overallLength: 85
        },
        images: ['/images/HIghspeed.png'],
        description: 'Spiral flute tap for blind holes. Excellent chip evacuation pulling chips up and out. Perfect for ductile materials.',
        isFeatured: false
    },
    {
        name: 'Hand Tap Set - UNC 1/4" to 1/2"',
        sku: 'KGW-TP-304',
        category: 'Taps',
        price: 1100,
        stock: 12,
        specs: {
            material: 'High-Speed Steel',
            coating: 'Black Oxide',
            diameter: 12.7,
            flutes: 4,
            shankDiameter: 9.5,
            overallLength: 90
        },
        images: ['/images/HIghspeed.png'],
        description: 'Imperial UNC hand tap set. Includes taper, plug, and bottom taps for 1/4", 5/16", 3/8", 7/16", and 1/2" threads.',
        isFeatured: false
    },
    {
        name: 'Roll Form Tap - M6',
        sku: 'KGW-TP-305',
        category: 'Taps',
        price: 850,
        stock: 18,
        specs: {
            material: 'High-Speed Steel',
            coating: 'TiCN',
            diameter: 6,
            flutes: 0,
            shankDiameter: 5,
            overallLength: 65
        },
        images: ['/images/HIghspeed.png'],
        description: 'Chipless roll form tap that cold-forms threads without cutting. Produces stronger threads with superior finish.',
        isFeatured: false
    },

    // ========== INSERTS ==========
    {
        name: 'Carbide Turning Insert - CNMG 120408',
        sku: 'KGW-IN-401',
        category: 'Inserts',
        price: 380,
        stock: 100,
        specs: {
            material: 'Carbide',
            coating: 'TiCN',
            diameter: 12.7,
            flutes: 0,
            shankDiameter: 0,
            overallLength: 12.7
        },
        images: ['/images/Carbide Endmill.jpg'],
        description: 'Unground carbide turning insert with TiCN coating. Negative rake angle for general turning operations on steel and cast iron.',
        isFeatured: false
    },
    {
        name: 'Carbide Insert - WNMG 080408',
        sku: 'KGW-IN-402',
        category: 'Inserts',
        price: 420,
        stock: 85,
        specs: {
            material: 'Carbide',
            coating: 'AlTiN',
            diameter: 9.525,
            flutes: 0,
            shankDiameter: 0,
            overallLength: 9.525
        },
        images: ['/images/Carbide Endmill.jpg'],
        description: 'Hexagonal carbide insert with AlTiN coating. Versatile insert for turning, facing, and chamfering operations.',
        isFeatured: false
    },
    {
        name: 'Carbide Grooving Insert - MGMN 300',
        sku: 'KGW-IN-403',
        category: 'Inserts',
        price: 280,
        stock: 120,
        specs: {
            material: 'Carbide',
            coating: 'TiN',
            diameter: 3,
            flutes: 0,
            shankDiameter: 0,
            overallLength: 3
        },
        images: ['/images/Carbide Endmill.jpg'],
        description: 'Precision grooving insert for narrow cuts and parting operations. Sharp cutting edge for clean grooves.',
        isFeatured: false
    },
    {
        name: 'Carbide Threading Insert - 16ER AG60',
        sku: 'KGW-IN-404',
        category: 'Inserts',
        price: 340,
        stock: 75,
        specs: {
            material: 'Carbide',
            coating: 'Uncoated',
            diameter: 9.525,
            flutes: 0,
            shankDiameter: 0,
            overallLength: 9.525
        },
        images: ['/images/Carbide Endmill.jpg'],
        description: 'External threading insert for 60° metric threads. Precision ground profile for accurate thread cutting.',
        isFeatured: false
    },
    {
        name: 'Carbide Milling Insert - APMT 1604',
        sku: 'KGW-IN-405',
        category: 'Inserts',
        price: 450,
        stock: 90,
        specs: {
            material: 'Carbide',
            coating: 'TiAlN',
            diameter: 16,
            flutes: 0,
            shankDiameter: 0,
            overallLength: 16
        },
        images: ['/images/Carbide Endmill.jpg'],
        description: 'Double-sided milling insert for face milling and slotting. High positive rake for smooth cutting action.',
        isFeatured: false
    },
    {
        name: 'Carbide Insert - DCMT 11T308',
        sku: 'KGW-IN-406',
        category: 'Inserts',
        price: 360,
        stock: 95,
        specs: {
            material: 'Carbide',
            coating: 'CVD Diamond',
            diameter: 11,
            flutes: 0,
            shankDiameter: 0,
            overallLength: 11
        },
        images: ['/images/Carbide Endmill.jpg'],
        description: 'Diamond-coated carbide insert for non-ferrous materials. Extremely long tool life in aluminum and composites.',
        isFeatured: true
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
