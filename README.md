# 🚀 Kasmetics Backend API

Complete Node.js/Express backend for Kasmetics e-commerce platform.

## 📋 Quick Setup

### Local Development
```bash
cd backend
npm install
npm run dev
```

### Production (Render)
```bash
npm start
```

## 🌐 Environment Variables (Render)

Set these in Render dashboard:

```
PORT=10000
MONGODB_URI=mongodb+srv://exdb:exdb1@cluster0.matwsyf.mongodb.net/?appName=Cluster0
JWT_SECRET=kasmetics-secret-key-2024
NODE_ENV=production
```

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/admin-login` - Admin login

### Products
- `GET /products` - Get all products
- `GET /products?featured=true&limit=4` - Featured products
- `POST /products` - Create product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

### Admin
- `GET /admin/users` - Get all users
- `POST /admin/users` - Create user
- `DELETE /admin/users/:id` - Delete user
- `GET /admin/analytics` - Get analytics

### Contact
- `POST /contact` - Submit contact form

## 🔐 Default Admin
- **Email**: admin@kasmetics.com
- **Password**: admin123

## 🚀 Render Deployment

1. **Connect GitHub repo**
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Add Environment Variables**
5. **Deploy**

Your API will be live at: `https://your-app.onrender.com`