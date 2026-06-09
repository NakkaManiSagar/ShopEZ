const express = require("express");
const router  = express.Router();
const Wishlist = require("../models/Wishlist");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// GET /api/wishlist — get user's wishlist
router.get("/", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate("products");
    res.json({ success: true, products: wishlist?.products || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/wishlist/:productId — toggle (add/remove)
router.post("/:productId", async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

    const idx = wishlist.products.indexOf(req.params.productId);
    let action;
    if (idx === -1) {
      wishlist.products.push(req.params.productId);
      action = "added";
    } else {
      wishlist.products.splice(idx, 1);
      action = "removed";
    }

    await wishlist.save();
    res.json({ success: true, action, count: wishlist.products.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/wishlist — clear wishlist
router.delete("/", async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.user._id }, { products: [] });
    res.json({ success: true, message: "Wishlist cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;