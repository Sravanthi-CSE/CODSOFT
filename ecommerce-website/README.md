# 🛍️ ShopHub - Full-Stack E-Commerce Platform

A modern, fully functional e-commerce platform built with **React.js**, **Node.js/Express**, and **MongoDB**. Features include product browsing, shopping cart, wishlist, secure Razorpay payment integration, and a powerful admin dashboard.

## ✨ Features

### 👥 **User Features**
- ✅ User Authentication (Signup/Login with JWT)
- ✅ Browse Products by Category (Electronics, Fashion, Home, Sports, Books, Toys & Games)
- ✅ Search and Filter Products
- ✅ Product Details Page
- ✅ Shopping Cart Management
- ✅ Wishlist Management
- ✅ Secure Razorpay Payment Integration
- ✅ Order History
- ✅ Responsive Design (Mobile, Tablet, Desktop)

### 👨‍💼 **Admin Features**
- ✅ Admin Login (Separate Admin Authentication)
- ✅ Admin Dashboard
- ✅ Product Management (Create, Read, Update, Delete)
- ✅ Inventory Management
- ✅ View All Orders
- ✅ Order Status Tracking

### 🎨 **Design & UX**
- ✅ Professional Tailwind CSS Styling
- ✅ Beautiful Gradients and Modern Colors
- ✅ Smooth Animations
- ✅ Toast Notifications
- ✅ Loading States
- ✅ Error Handling

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - UI Library with Hooks
- **React Router v7** - Client-side Routing
- **Tailwind CSS** - Utility-first CSS Framework
- **Axios** - HTTP Client
- **React Icons** - Icon Library
- **React Toastify** - Toast Notifications
- **Vite** - Build Tool

### Backend
- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **MongoDB** - NoSQL Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **BCryptJS** - Password Hashing
- **Razorpay** - Payment Gateway
- **CORS** - Cross-Origin Resource Sharing

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (Local or MongoDB Atlas)
- **Razorpay Account** (For Payment Integration)

## 🚀 Installation & Setup

### 1️⃣ Backend Setup

#### Clone/Navigate to Backend Directory
```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Create `.env` File
```bash
cp .env.example .env
```

#### Configure `.env` File
Edit `backend/.env` and add:
```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_12345
ADMIN_EMAIL=admin@shophub.com
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
PORT=5000
```

#### Start MongoDB (if using local)
```bash
# macOS/Linux
mongod

# Windows
mongod --dbpath "C:\path\to\mongodb\data"
```

#### Start Backend Server
```bash
npm run dev
```

The backend will run at `http://localhost:5000`

---

### 2️⃣ Frontend Setup

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Create `.env.local` File
```bash
cp .env.example .env.local
```

#### Configure `.env.local` File
Edit `frontend/.env.local` and add:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will run at `http://localhost:5173`

---

## 🔑 Getting Razorpay Keys

1. **Create Account**: Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. **Navigate to Settings**: Go to Settings → API Keys
3. **Copy Keys**: Copy your **Key ID** and **Key Secret**
4. **Add to `.env`**: Paste them in backend `.env` and frontend `.env.local`

---

## 📱 Running Both Servers Simultaneously

### Option 1: Using Two Terminal Windows

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Using Concurrently (from root directory)

```bash
npm install -g concurrently
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

---

## 👤 Demo Credentials

### User Account
- **Email**: user@demo.com
- **Password**: demo123

### Admin Account
- **Email**: admin@shophub.com
- **Password**: admin123

---

## 📂 Project Structure

```
E-commerce/
├── backend/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Product.js         # Product schema
│   │   ├── Cart.js            # Cart schema
│   │   └── Order.js           # Order schema
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── wishlistController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── adminMiddleware.js # Admin check
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── payments.js        # Razorpay integration
│   │   ├── wishlist.js
│   │   └── admin.js
│   └── seed/
│       └── products.js        # Sample data
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx           # React entry point
│   │   ├── App.jsx            # Main component & routing
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx # Razorpay integration
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Auth state management
│   │   │   └── CartContext.jsx # Cart state management
│   │   ├── services/
│   │   │   └── api.js         # API calls with Axios
│   │   └── styles/
│   │       └── globals.css    # Tailwind styles
│   ├── index.html
│   ├── package.json
│   ├── .env.example
│   └── vite.config.js
│
└── README.md
```

---

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User signup
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart/:productId` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Payments
- `POST /api/payments/razorpay/create-order` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify payment

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/:productId` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

---

## 🧪 Testing the Application

1. **Visit Homepage**: Navigate to `http://localhost:5173`
2. **Browse Products**: Check out products by category
3. **User Signup**: Create a new account
4. **Add to Cart**: Add products to shopping cart
5. **Checkout**: Go to cart and proceed to checkout
6. **Payment**: Complete payment with Razorpay (Test Mode)
7. **Admin Access**: Login with admin credentials to manage products

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running or update `MONGO_URI` to use MongoDB Atlas.

### Razorpay Payment Not Working
```
Error: Razorpay not configured
```
**Solution**: Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to backend `.env`

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Ensure backend `app.js` has `cors()` enabled and frontend `VITE_API_URL` is correct.

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change PORT in backend `.env` or kill process on port 5000.

---

## 🚀 Production Deployment

### Backend (Render/Heroku)
```bash
# Update .env with production values
# Deploy to hosting platform
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist folder
```

---

## 📝 API Testing with Sample Commands

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test123"}'

# Get Products
curl http://localhost:5000/api/products?category=Electronics
```

---

## 📄 Future Enhancements

- [ ] Email notifications
- [ ] Product reviews & ratings
- [ ] Advanced analytics
- [ ] Inventory tracking
- [ ] Multiple payment methods
- [ ] Social login
- [ ] Mobile app
- [ ] GraphQL API
- [ ] Redis caching
- [ ] Automated testing

---

## 📞 Support & Contribution

Found a bug? Have suggestions? Feel free to open an issue or submit a pull request!

---

## 📜 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **Razorpay** for payment infrastructure
- **MongoDB** for database
- **React** community for amazing tools
- **Tailwind CSS** for beautiful styling

---

## 🎉 Enjoy Shopping with ShopHub!

Built with ❤️ for a better e-commerce experience.
