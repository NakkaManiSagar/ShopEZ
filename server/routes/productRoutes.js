const express = require("express");
const router = express.Router();
const {
  getProducts, getFeaturedProducts, getProductById,
  addReview, createProduct, updateProduct, deleteProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/",          getProducts);
router.get("/featured",  getFeaturedProducts);
router.get("/:id",       getProductById);
router.post("/:id/review", protect, addReview);

// Admin
router.post("/",         protect, adminOnly, createProduct);
router.put("/:id",       protect, adminOnly, updateProduct);
router.delete("/:id",    protect, adminOnly, deleteProduct);

module.exports = router;