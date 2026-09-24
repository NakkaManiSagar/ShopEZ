const express = require("express");
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const rateLimit = require("../middleware/rateLimit");

router.use(protect);

router.post("/",       rateLimit({ windowMs: 60 * 1000, max: 20 }), placeOrder);
router.get("/my",      getMyOrders);
router.get("/:id",     getOrderById);

// Admin
router.get("/",                        adminOnly, getAllOrders);
router.put("/:id/status",              adminOnly, updateOrderStatus);

module.exports = router;