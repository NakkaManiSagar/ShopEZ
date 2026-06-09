const express = require("express");
const router  = express.Router();
const Razorpay = require("razorpay");
const crypto   = require("crypto");
const Order    = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route  POST /api/payment/create-order
// @desc   Create a Razorpay order
// @access Private
router.post("/create-order", protect, async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees

    const options = {
      amount:   Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt:  `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success:  true,
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  POST /api/payment/verify
// @desc   Verify Razorpay payment signature
// @access Private
router.post("/verify", protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shopOrderId } = req.body;

    // Verify signature
    const body      = razorpay_order_id + "|" + razorpay_payment_id;
    const expected  = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Update order payment status
    await Order.findByIdAndUpdate(shopOrderId, {
      paymentStatus:    "Paid",
      paidAt:           Date.now(),
      razorpayOrderId:  razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;