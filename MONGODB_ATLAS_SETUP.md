# 🍃 MongoDB Atlas Setup Guide

## Step-by-Step Setup

### 1️⃣ Create MongoDB Atlas Account

1. Go to **https://www.mongodb.com/cloud/atlas**
2. Click **"Try Free"** or **"Sign Up"**
3. Sign up with email or Google account
4. Complete registration

### 2️⃣ Create a Cluster (Database)

1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier (512MB storage - perfect for development)
3. **Cloud Provider:** Choose AWS, Google Cloud, or Azure
4. **Region:** Select closest to you (e.g., Mumbai for India)
5. **Cluster Name:** Keep default or name it `KulswaminiCluster`
6. Click **"Create"**

⏱️ *Cluster creation takes 3-5 minutes*

### 3️⃣ Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. **Authentication Method:** Password
4. **Username:** `kulswamini_admin` (or your choice)
5. **Password:** Click **"Autogenerate Secure Password"** → Copy it!
6. **Database User Privileges:** Select **"Read and write to any database"**
7. Click **"Add User"**

⚠️ **SAVE YOUR PASSWORD!** You'll need it for the connection string.

### 4️⃣ Configure Network Access

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Choose one:
   - **For Development:** Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - **For Production:** Add your specific IP address
4. Click **"Confirm"**

### 5️⃣ Get Connection String

1. Go back to **"Database"** tab
2. Click **"Connect"** button on your cluster
3. Select **"Drivers"**
4. Choose **"Node.js"** and version **"4.1 or later"**
5. Copy the connection string:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6️⃣ Update Your Project

**Edit `server/.env` file:**

```env
MONGODB_URI=mongodb+srv://kulswamini_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kulswamini?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
PORT=4000
ADMIN_EMAIL=admin@kulswamini.com
ADMIN_PASSWORD=admin123
```

**Replace:**
- `kulswamini_admin` → your username
- `YOUR_PASSWORD` → your password (from Step 3)
- `cluster0.xxxxx` → your actual cluster address
- Add `/kulswamini` before the `?` to specify database name

### 7️⃣ Seed the Database

```bash
cd server
node seed.js
```

**Expected Output:**
```
✅ Connected to MongoDB
🗑️  Cleared existing products
✅ Successfully seeded 9 products!

📊 Products by category:
   - Endmills: 3
   - Drills: 3
   ...
```

### 8️⃣ Verify in Atlas

1. Go to **"Database"** → **"Browse Collections"**
2. You should see:
   - Database: `kulswamini`
   - Collections: `products`, `users`, `contacts`

---

## 🎯 Your Final Connection String Should Look Like:

```env
MONGODB_URI=mongodb+srv://kulswamini_admin:MySecurePass123@cluster0.ab1cd.mongodb.net/kulswamini?retryWrites=true&w=majority
```

## ✅ Test Connection

```bash
cd server
npm run dev
```

**Look for:**
```
Server running on port 4000
Connected to MongoDB ← This confirms successful connection!
```

---

## 🆘 Common Issues

**❌ "MongoNetworkError"**
- Check: Network Access allows your IP
- Check: Username/password are correct
- Check: No typos in connection string

**❌ "Authentication failed"**
- Verify username/password in Database Access
- Password might have special characters - URL encode them
- Example: `@` becomes `%40`, `#` becomes `%23`

**❌ "Connection timeout"**
- Network Access: Add your IP or use 0.0.0.0/0
- Firewall blocking MongoDB port 27017

---

## 🚀 You're Ready!

Your MongoDB Atlas database is now connected to your project. Start the app:

```bash
npm run dev
```

Visit `http://localhost:3000` and start selling industrial tools! 🏭⚙️
