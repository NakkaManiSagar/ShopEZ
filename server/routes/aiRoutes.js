const express = require("express");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const { protect } = require("../middleware/authMiddleware");
const { visualSearch, recommendations, moodSearch } = require("../controllers/aiController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const visualSearchLimiter = rateLimit({ windowMs: 60 * 1000, limit: 15, standardHeaders: true, legacyHeaders: false });
const recommendationsLimiter = rateLimit({ windowMs: 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });
const moodSearchLimiter = rateLimit({ windowMs: 60 * 1000, limit: 25, standardHeaders: true, legacyHeaders: false });

router.post("/visual-search", visualSearchLimiter, upload.single("image"), visualSearch);
router.post("/recommendations", recommendationsLimiter, protect, recommendations);
router.post("/mood-search", moodSearchLimiter, moodSearch);

module.exports = router;
