# Kulswamini Grinding Works - React + Node.js Monorepo

**Version 2.0** - Modern full-stack e-commerce application

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ installed
- MongoDB Atlas account
- npm or yarn

### Installation

```bash
# Install all dependencies for root, server, and client
npm run install:all

# Or install manually:
npm install                    # Root dependencies
cd server && npm install       # Server dependencies
cd ../client && npm install    # Client dependencies
```

### Environment Setup

Create a `.env` file in the `/server` directory:

```.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kulswamini?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
PORT=5000
```

### Running the Application

```bash
# Development mode (runs both client and server concurrently)
npm run dev

# Or run separately:
npm run server    # Backend on http://localhost:5000
npm run client    # Frontend on http://localhost:3000
```

Visit `http://localhost:3000` in your browser!

---

## 📁 Project Structure

```
/kulswamini-grinding-works
├── /client                  # React Frontend
│   ├── /public
│   │   └── /images         # Product images
│   ├── /src
│   │   ├── /components     # Reusable components
│   │   ├── /pages          # Page components
│   │   ├── /context        # React Context (Auth, Cart)
│   │   ├── /styles         # CSS files
│   │   └── App.js
│   └── package.json
│
├── /server                 # Node.js Backend
│   ├── /models             # MongoDB models
│   ├── /routes             # API routes
│   ├── /middleware         # Auth middleware
│   ├── server.js
│   └── package.json
│
├── /legacy                 # Old HTML files (backup)
└── package.json            # Root monorepo config
```

---

## 🎨 Design System

### Color Palette (Nature-Inspired)
- **Primary:** Warm amber/copper tones (#f59e0b, #d97706)
- **Accents:** Sunset orange (#fb923c), steel gray (#71717a)
- **NO blues or indigos** (following constraint-based design)

### Border Radius (Unconventional)
- Small: `5px` (not 8px)
- Medium: `14px` (not 12px)
- Large: `22px` (not 16px or 24px)
- Extra Large: `38px` (not 32px or 40px)

### Gradients
- Sunrise-inspired: Orange → Amber → Yellow
- Metallic: Copper → Amber
- Steel: Light gray → Dark gray

---

## 🛠️ Features

### Frontend (React)
- ✅ Responsive navigation with mobile menu
- ✅ Product browsing with category filtering
- ✅ Shopping cart management
- ✅ User authentication (login/signup)
- ✅ Protected routes
- ✅ Context API for state management

### Backend (Node.js/Express)
- ✅ RESTful API
- ✅ JWT authentication
- ✅ MongoDB integration
- ✅ Product CRUD operations
- ✅ Contact form management
- ✅ Role-based access control (Admin/User)

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all submissions (admin only)
- `PUT /api/contact/:id` - Update submission status (admin only)

---

## 🔐 Default Admin Account

Email: `admin@example.com`  
Password: `admin123`

> ⚠️ **Change this in production!**

---

## 🧪 Development

### Server Only
```bash
cd server
npm run dev    # Uses nodemon for auto-restart
```

### Client Only
```bash
cd client
npm start      # React dev server with hot reload
```

### Build for Production
```bash
npm run build  # Creates optimized production build in client/build
```

---

## 🚢 Deployment

### Backend
- Deploy `/server` to Heroku, Railway, or Render
- Set environment variables
- Ensure MongoDB Atlas IP whitelist includes deployment server

### Frontend
- Deploy `/client/build` to Netlify, Vercel, or similar
- Update API base URL if not using proxy

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both client and server concurrently |
| `npm run server` | Run backend server only |
| `npm run client` | Run frontend client only |
| `npm run install:all` | Install dependencies for all packages |
| `npm run build` | Build React app for production |

---

## 🎯 Tech Stack

### Frontend
- React 19.2
- React Router DOM 7
- Axios
- Context API
- CSS3 (Custom design system)

### Backend
- Node.js
- Express.js 4.21
- MongoDB + Mongoose 8.13
- JWT Authentication
- bcryptjs

---

## 🔄 Migration from v1.0

Old HTML files are preserved in `/legacy` folder. The new React architecture provides:
- Better state management
- Improved performance
- Modern development experience
- E-commerce capabilities
- Scalable component architecture

---

## 📞 Contact

**Kulswamini Grinding Works**  
Ground Floor Plot No.268, Near Thakur Engg Work  
Pokhran Road No.01, Thane - 400606  

📞 +91 8104999122  
✉️ kulswaminigw@gmail.com

---

## 📄 License

Copyright © 2025 Kulswamini Grinding Works. All rights reserved.

---

Built with ❤️ using React + Node.js