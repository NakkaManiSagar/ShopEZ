const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// @route  POST /api/upload
// @access Admin only
router.post("/", protect, adminOnly, upload.single("image"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    res.json({
      success: true,
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;