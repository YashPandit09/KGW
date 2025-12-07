# 🚀 Quick Start Guide - Kulswamini Grinding Works

## Step 1: Install Dependencies

```bash
# From the root directory
npm run install:all
```

This will install dependencies for root, server, and client.

---

## Step 2: Set Up Environment Variables

Create a `.env` file in the `/server` directory:

```env
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key-minimum-32-characters
PORT=4000
ADMIN_EMAIL=admin@example.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

> **Note:** Replace the values with your actual MongoDB connection string and credentials.

---

## Step 3: Seed Sample Products

```bash
cd server
node seed.js
cd ..
```

This creates 9 sample products:
- 4 Carbide products
- 5 High-Speed Steel products

---

## Step 4: Start the Application

```bash
# From root directory
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

---

## Step 5: Test the Application

### ✅ Browse Products
1. Visit http://localhost:3000
2. Click "Explore Products" or navigate to `/shop`
3. Filter by category (All, Carbide, Highspeed)
4. Search for products

### ✅ View Product Details
1. Click on any product card
2. View specifications
3. Adjust quantity
4. Add to cart

### ✅ Test Authentication
1. Click "Login" in navbar
2. Click "Sign up here" to create account
3. Fill in name, email, password
4. After signup, you'll be logged in

### ✅ Test Shopping Cart
1. Add products to cart
2. Click "Cart" in navbar
3. Update quantities with +/- buttons
4. Remove items
5. View order summary

### ✅ Test Admin Access

**Method 1: Update User Role in MongoDB**
1. Sign up with an account
2. In MongoDB Atlas/Compass, find your user in the `users` collection
3. Change `role` from `"user"` to `"admin"`
4. Log out and log back in
5. You'll see "Admin" link in navbar

**Method 2: Use Backend to Create Admin**
Update `/server/server.js` to create default admin (already configured):
```javascript
// Add after MongoDB connection
const User = require('./models/User');
User.findOne({ email: process.env.ADMIN_EMAIL }).then(async (user) => {
  if (!user) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });
    console.log('✅ Admin user created');
  }
});
```

Then login with:
- Email: `admin@example.com` (or your ADMIN_EMAIL)
- Password: `admin123`

### ✅ Test Admin Dashboard
1. Login as admin
2. Click "Admin" in navbar
3. **Products Tab:**
   - View all products
   - Delete products
   - See stock levels
4. **Contact Submissions Tab:**
   - View all contact form submissions
   - Mark as "Responded"
   - Mark as "Closed"

### ✅ Test Contact Form
1. Navigate to `/contact`
2. Fill in the form
3. Submit
4. Check admin dashboard for submission

---

## 🎨 Design Verification Checklist

✅ **Nature-Inspired Colors:**
- Warm amber/copper gradients everywhere
- NO blue colors anywhere

✅ **Unconventional Border Radius:**
- 5px (small)
- 14px (medium)
- 22px (large)
- 38px (extra large)

✅ **Filled UI Elements:**
- Solid buttons (not outlines)
- Gradient backgrounds
- Bold visual elements

✅ **Micro-Animations:**
- Hover effects on cards
- Smooth transitions
- Fade-in animations

---

## 📱 Testing Checklist

### Frontend
- [ ] Home page loads correctly
- [ ] Shop page displays products
- [ ] Product filtering works
- [ ] Product search works
- [ ] Product details page shows specs
- [ ] Add to cart functionality
- [ ] Cart updates quantities
- [ ] Cart removal works
- [ ] About page displays
- [ ] Contact form submission
- [ ] Login/Signup flow
- [ ] Admin dashboard (products tab)
- [ ] Admin dashboard (contacts tab)
- [ ] Mobile responsive design

### Backend
- [ ] Server starts on port 4000
- [ ] MongoDB connection established
- [ ] Product API endpoints work
- [ ] Auth endpoints work
- [ ] Contact endpoints work
- [ ] JWT authentication
- [ ] Admin authorization

---

## 🐛 Troubleshooting

### Port 4000 Already in Use
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Or change port in server/.env
PORT=4001
```

### MongoDB Connection Error
- Check your MONGODB_URI in `.env`
- Verify IP whitelist in MongoDB Atlas
- Test connection string

### React App Won't Start
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

### Products Not Showing
```bash
# Re-run seed script
cd server
node seed.js
```

---

## 🎯 Next Development Steps

### Immediate Improvements
1. **Toast Notifications**
   - Install `react-toastify`
   - Use for cart actions and form submissions

2. **Loading States**
   - Add skeleton loaders
   - Better loading indicators

3. **Form Validation**
   - Client-side validation messages
   - Better error handling

### Feature Additions
1. **Order System**
   - Create Order model
   - Checkout flow
   - Order history

2. **Product Images**
   - Image upload functionality
   - Multiple image support
   - Image optimization

3. **Search Enhancement**
   - Debounced search
   - Search suggestions
   - Advanced filters

4. **Admin Features**
   - Add/Edit product forms
   - Bulk operations
   - Analytics dashboard

---

## 📂 Project Structure Reference

```
/kulswamini-grinding-works
├── /client (React - Port 3000)
│   ├── /public/images
│   ├── /src
│   │   ├── /components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── /pages
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── /context
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   └── /styles
│   │       └── theme.css
│   └── package.json
│
├── /server (Node.js - Port 4000)
│   ├── /models
│   │   ├── User.js
│   │   ├── Contact.js
│   │   └── Product.js
│   ├── /routes
│   │   ├── auth.js
│   │   ├── contact.js
│   │   └── products.js
│   ├── /middleware
│   │   └── auth.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
└── package.json (Root - Concurrent execution)
```

---

## 🔗 Available Routes

### Frontend Routes
- `/` - Home page
- `/shop` - Product catalog
- `/product/:id` - Product details
- `/about` - About company
- `/contact` - Contact form
- `/cart` - Shopping cart (protected)
- `/login` - User login
- `/signup` - User registration
- `/admin` - Admin dashboard (admin only)

### API Endpoints
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (admin)
- `PUT /api/contact/:id` - Update contact status (admin)

---

## ✅ Ready to Go!

Your application is now fully set up and ready for development and testing. Start the servers with `npm run dev` and visit http://localhost:3000 to see it in action!

**Happy Coding! 🎉**
