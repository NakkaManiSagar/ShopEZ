const express = require("express");
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const rateLimit = require("../middleware/rateLimit");
const { visualSearch, recommendations, moodSearch } = require("../controllers/aiController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/visual-search", rateLimit({ windowMs: 60 * 1000, max: 15 }), upload.single("image"), visualSearch);
router.post("/recommendations", rateLimit({ windowMs: 60 * 1000, max: 20 }), protect, recommendations);
router.post("/mood-search", rateLimit({ windowMs: 60 * 1000, max: 25 }), moodSearch);

module.exports = router;
