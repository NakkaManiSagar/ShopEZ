const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.CLIENT_URL || "https://shopez.vercel.app",
    /\.vercel\.app$/,
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (we'll add these step by step)
app.use("/api/auth",      require("./routes/authRoutes"));
app.use("/api/products",  require("./routes/productRoutes"));
app.use("/api/cart",      require("./routes/cartRoutes"));
app.use("/api/orders",    require("./routes/orderRoutes"));
app.use("/api/admin",     require("./routes/adminRoutes"));
app.use("/api/upload",    require("./routes/uploadRoutes"));
app.use("/api/payment",   require("./routes/paymentRoutes"));
app.use("/api/wishlist",  require("./routes/wishlistRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🛒 ShopEZ API is running..." });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});