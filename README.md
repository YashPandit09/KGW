# Kulswamini Grinding Works Website

This project includes a fully functional website for Kulswamini Grinding Works with user authentication, contact form submissions, and an admin panel.

## Features

- Home page with company information
- Products page displaying company offerings
- About page with company history
- Contact page with form submissions
- User authentication (signup and login)
- Admin panel for managing contact form submissions
- Responsive design for all screen sizes

## Setup Instructions

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- MongoDB Atlas account (required for database storage)

### Installation

1. Clone the repository
2. Install the dependencies:
   ```
   npm install
   ```

### MongoDB Atlas Setup

For data storage, this application uses MongoDB Atlas.

1. Sign up for a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas/register
2. Create a new cluster (the free tier is sufficient)
3. Once your cluster is created, click on "Connect"
4. Choose "Connect your application"
5. Copy the connection string that looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database-name>?retryWrites=true&w=majority
   ```
6. Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database-name>?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key
   ```
7. Replace `<username>`, `<password>`, and `<database-name>` with your MongoDB Atlas username, password, and desired database name.

### Running the Application

1. Start the backend server:
   ```
   node server.js
   ```
   
2. The server will be available at http://localhost:3000
3. Open the HTML files directly in your browser to view the frontend

### Default Admin User

A default admin user is automatically created:
- Email: admin@example.com
- Password: admin123

## File Structure

- `FrontPage.html` - Main landing page
- `products.html` - Products showcase
- `about.html` - About the company
- `contact.html` - Contact form
- `login.html` - User login
- `signup.html` - User registration
- `admin.html` - Admin panel (protected)
- `server.js` - Backend API server
- `models/` - MongoDB models
  - `User.js` - User model
  - `Contact.js` - Contact form submission model
- `styles.css` - Main stylesheet

## API Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/contact` - Submit a contact form
- `GET /api/contact` - Get all contact submissions (admin only)
- `PUT /api/contact/:id` - Update contact status (admin only)

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Authentication: JWT
