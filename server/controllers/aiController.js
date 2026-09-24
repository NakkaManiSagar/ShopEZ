const Product = require("../models/Product");
const User = require("../models/User");
const { cloudinary } = require("../config/cloudinary");
const {
  analyzeImageQuery,
  analyzePurchaseHistory,
  analyzeMood,
} = require("../services/aiService");

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSearchFilters = ({ keywords = [], categories = [], brands = [] }) => {
  const filters = [];

  keywords.forEach((keyword) => {
    const regex = new RegExp(escapeRegex(keyword), "i");
    filters.push({ name: regex }, { description: regex }, { aiTags: regex }, { category: regex }, { brand: regex });
  });

  categories.forEach((category) => {
    filters.push({ category: new RegExp(escapeRegex(category), "i") });
  });

  brands.forEach((brand) => {
    filters.push({ brand: new RegExp(escapeRegex(brand), "i") });
  });

  return filters;
};

const toDataUri = (file) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

const visualSearch = async (req, res) => {
  let tempUpload = null;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload an image" });
    }

    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      tempUpload = await cloudinary.uploader.upload(toDataUri(req.file), {
        folder: "shopez_ai_temp",
        resource_type: "image",
      });
    }

    const insights = await analyzeImageQuery({
      imageUrl: tempUpload?.secure_url,
      fileName: req.file.originalname,
    });

    const filters = buildSearchFilters(insights);
    const query = filters.length > 0 ? { isActive: true, $or: filters } : { isActive: true };

    const products = await Product.find(query).sort({ rating: -1, createdAt: -1 }).limit(5);

    res.json({
      success: true,
      query: insights.description,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (tempUpload?.public_id) {
      cloudinary.uploader.destroy(tempUpload.public_id).catch(() => null);
    }
  }
};

const recommendations = async (req, res) => {
  try {
    const limit = Math.min(Number(req.body?.limit) || 5, 10);

    const user = await User.findById(req.user._id).populate({
      path: "purchaseHistory",
      select: "name category brand aiTags",
    });

    const purchasedIds = user.purchaseHistory?.map((item) => item._id) || [];
    const summary = (user.purchaseHistory || [])
      .map((item) => `${item.name} (${item.category}) ${item.brand || ""} ${(item.aiTags || []).join(" ")}`)
      .join("; ");

    const insights = summary
      ? await analyzePurchaseHistory(summary)
      : { description: "New user recommendations", keywords: [], categories: [], brands: [] };

    const filters = buildSearchFilters(insights);

    let products;
    if (filters.length > 0) {
      products = await Product.find({
        isActive: true,
        _id: { $nin: purchasedIds },
        $or: filters,
      })
        .sort({ rating: -1, numReviews: -1, createdAt: -1 })
        .limit(limit);
    }

    if (!products || products.length === 0) {
      products = await Product.find({ isActive: true, _id: { $nin: purchasedIds } })
        .sort({ rating: -1, numReviews: -1, createdAt: -1 })
        .limit(limit);
    }

    res.json({
      success: true,
      query: insights.description,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const moodSearch = async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood || typeof mood !== "string") {
      return res.status(400).json({ success: false, message: "Mood text is required" });
    }

    const insights = await analyzeMood(mood);
    const filters = buildSearchFilters(insights);

    const products = await Product.find(filters.length > 0 ? { isActive: true, $or: filters } : { isActive: true })
      .sort({ rating: -1, createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      query: insights.description,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  visualSearch,
  recommendations,
  moodSearch,
};
