const Order = require("../models/Order");
const Cart  = require("../models/Cart");
const Product = require("../models/Product");
const User  = require("../models/User");
const { sendOrderConfirmation } = require("../utils/sendEmail");

// @route POST /api/orders — place order
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty" });

    const orderItems = cart.items.map((item) => ({
      product:   item.product._id,
      name:      item.product.name,
      thumbnail: item.product.thumbnail,
      quantity:  item.quantity,
      price:     item.price,
    }));

    const itemsPrice    = cart.totalPrice;
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const totalPrice    = itemsPrice + shippingPrice;

    // Reduce stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // Send order confirmation email (non-blocking)
    const user = await User.findById(req.user._id);
    sendOrderConfirmation(order, user).catch(err =>
      console.error("Order email failed:", err.message)
    );

    res.status(201).json({ success: true, message: "Order placed!", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/orders/my — user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Only owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized" });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.orderStatus = req.body.orderStatus || order.orderStatus;
    if (req.body.orderStatus === "Delivered") order.deliveredAt = Date.now();

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };