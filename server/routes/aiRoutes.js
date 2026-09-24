const express = require("express");
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const { visualSearch, recommendations, moodSearch } = require("../controllers/aiController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/visual-search", upload.single("image"), visualSearch);
router.post("/recommendations", protect, recommendations);
router.post("/mood-search", moodSearch);

module.exports = router;
