
# ShopEZ 🛒

A full-stack e-commerce web application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://shop-ez-gamma.vercel.app)
---

## 🌐 Live Links

| Service | URL |
|---------|-----|
| Frontend | https://shop-ez-gamma.vercel.app |
| Backend API | https://shopez-backend-r7xc.onrender.com |
---

## 📌 Project Overview

ShopEZ is a production-grade e-commerce platform that replicates the core functionality of a modern online retail store. It enables customers to browse a categorized product catalog, manage a shopping cart and wishlist, complete secure online or cash-on-delivery checkouts, and track their order history — while giving administrators a dedicated dashboard to manage products, orders, and users.

---

## 🏗️ Tech Stack

### Frontend
- **React 18** (Vite)
- **React Router DOM v6**
- **Context API** (Auth, Cart, Wishlist)
- **Axios** with JWT interceptor
- **CSS Custom Properties** — dark luxury design system
- **Lucide React** icons
- **React Hot Toast**

### Backend
- **Node.js + Express.js 5**
- **Mongoose** ODM
- **JSON Web Tokens** (jsonwebtoken)
- **bcryptjs** password hashing
- **Multer + Cloudinary** image upload
- **Razorpay** payment gateway
- **Resend** transactional email

### Database
- **MongoDB Atlas** — 5 collections: Users, Products, Carts, Orders, Wishlists

### Deployment
- **Vercel** — frontend
- **Render** — backend
- **MongoDB Atlas** — database
- **Cloudinary** — image CDN

---

## ✨ Features

### Customer
- Register / Login / Forgot Password (OTP email)
- Browse 36 products across 8 categories
- Live search suggestions (debounced 300ms)
- Filter by category, sort by price / rating / newest
- Auto-sliding product image gallery
- Add to Cart / Wishlist
- Cart quantity management, free shipping above Rs.500
- Checkout with address form
- Razorpay online payment (UPI, Cards, NetBanking, Wallets)
- Cash on Delivery
- Order history with expandable details
- Product reviews and star ratings
- Profile editor (name, phone, address, password)

### Admin
- Dashboard with live stats (users, products, orders, revenue)
- Add / Edit / Delete products
- Multi-image upload via Cloudinary (file or URL)
- Manage all orders and update status
- View all users

### Email Notifications
- Welcome email on registration
- Order confirmation with itemized receipt
- OTP email for password reset (10-minute expiry)

---

## 🗄️ Database Collections

| Collection | Key Fields |
|-----------|------------|
| Users | name, email, password (hashed), role, address, resetPasswordOTP |
| Products | name, price, discountPrice, category, stock, images[], reviews[], isFeatured |
| Carts | user (unique), items[], totalPrice (auto-calculated) |
| Orders | user, items[] (price snapshot), shippingAddress, paymentMethod, paymentStatus, orderStatus |
| Wishlists | user (unique), products[] |

---

## 🔌 API Endpoints (30+)

### Auth — /api/auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /register | Public |
| POST | /login | Public |
| GET | /profile | Private |
| PUT | /profile | Private |
| POST | /forgot-password | Public |
| POST | /reset-password | Public |

### Products — /api/products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | / | Public |
| GET | /featured | Public |
| GET | /:id | Public |
| POST | /:id/review | Private |
| POST | / | Admin |
| PUT | /:id | Admin |
| DELETE | /:id | Admin |

### Cart — /api/cart
| Method | Endpoint |
|--------|----------|
| GET | / |
| POST | / |
| PUT | /:productId |
| DELETE | /:productId |
| DELETE | / |

### Orders — /api/orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | / | Private |
| GET | /my | Private |
| GET | /:id | Private |
| GET | / | Admin |
| PUT | /:id/status | Admin |

### Payment — /api/payment
| Method | Endpoint |
|--------|----------|
| POST | /create-order |
| POST | /verify |

### Wishlist — /api/wishlist
| Method | Endpoint |
|--------|----------|
| GET | / |
| POST | /:productId |
| DELETE | / |

### Admin — /api/admin
| Method | Endpoint |
|--------|----------|
| GET | /stats |
| GET | /users |
| DELETE | /users/:id |

---

## 🔐 Security

| Feature | Implementation |
|---------|---------------|
| Passwords | bcrypt (10-12 rounds) |
| Sessions | JWT (7-day expiry) |
| Route Protection | protect middleware |
| Admin Access | adminOnly middleware |
| Payment | HMAC-SHA256 signature verification |
| CORS | Explicit domain allow-list |
| Secrets | Environment variables only |
| Password Recovery | 6-digit OTP, 10-minute expiry |

---

## 🚀 Local Setup

```bash
# Clone
git clone https://github.com/NakkaManiSagar/ShopEZ.git
cd ShopEZ

# Backend
cd server
npm install

# Seed database
node seeder.js

# Start backend
npm run dev

# Frontend (new terminal)
cd ../client
npm install
npm run dev
```

---

## 🌱 Seeder Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopez.com | admin123 |
| User | mani@shopez.com | mani1234 |
| Guest | test@shopez.com | test1234 |

---

## 📁 Project Structure

```
ShopEZ/
├── client/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── pages/
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ManageOrders.jsx
│   │   │       └── ManageProducts.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vercel.json
│   └── package.json
│
└── server/
    ├── config/
    │   ├── cloudinary.js
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── cartController.js
    │   ├── orderController.js
    │   └── productController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── Cart.js
    │   ├── Order.js
    │   ├── Product.js
    │   ├── User.js
    │   └── Wishlist.js
    ├── routes/
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── cartRoutes.js
    │   ├── orderRoutes.js
    │   ├── paymentRoutes.js
    │   ├── productRoutes.js
    │   ├── uploadRoutes.js
    │   └── wishlistRoutes.js
    ├── utils/
    │   └── sendEmail.js
    ├── index.js
    ├── seeder.js
    └── package.json
```

---

## 🚢 Deployment

| Platform | Service | Config |
|----------|---------|--------|
| Vercel | Frontend | Root: client, Framework: Vite |
| Render | Backend | Root: server, Start: node index.js |
| MongoDB Atlas | Database | M0 Free, Network: 0.0.0.0/0 |
| Cloudinary | Images | Free tier |
| Resend | Email | Free tier, HTTP API |

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| API Endpoints | 30+ |
| Frontend Pages | 13 |
| Database Collections | 5 |
| Sample Products | 36 |
| Integrations | 5 |

---

## 👨‍💻 Developer

**Nakka Mani Sagar**
B.Tech CSE — KKR & KSR Institute of Technology & Sciences (JNTU Kakinada)

- LinkedIn: [linkedin.com/in/mani-sagar-nakka-704518279](https://linkedin.com/in/mani-sagar-nakka-704518279)
- GitHub: [github.com/NakkaManiSagar](https://github.com/NakkaManiSagar)

---

## 📄 License

MIT License — open source and free to use.
ENDOFFILE
echo "Done"
