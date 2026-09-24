const express = require("express");
const router = express.Router();
const {
  getProducts, getFeaturedProducts, getProductById,
  addReview, createProduct, updateProduct, deleteProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const rateLimit = require("../middleware/rateLimit");

router.get("/",          getProducts);
router.get("/featured",  getFeaturedProducts);
router.get("/:id",       getProductById);
router.post("/:id/review", protect, addReview);

// Admin
router.post("/",         rateLimit({ windowMs: 60 * 1000, max: 20 }), protect, adminOnly, createProduct);
router.put("/:id",       rateLimit({ windowMs: 60 * 1000, max: 30 }), protect, adminOnly, updateProduct);
router.delete("/:id",    rateLimit({ windowMs: 60 * 1000, max: 20 }), protect, adminOnly, deleteProduct);

module.exports = router;