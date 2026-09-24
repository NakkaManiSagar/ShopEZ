const buckets = new Map();

const rateLimit = ({ windowMs = 60 * 1000, max = 30 } = {}) => (req, res, next) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const key = `${ip}:${req.baseUrl}${req.path}`;
  const now = Date.now();

  const record = buckets.get(key) || { count: 0, resetAt: now + windowMs };

  if (record.resetAt <= now) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  record.count += 1;
  buckets.set(key, record);

  if (record.count > max) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again shortly.",
    });
  }

  if (buckets.size > 2000) {
    for (const [bucketKey, bucket] of buckets.entries()) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  return next();
};

module.exports = rateLimit;
