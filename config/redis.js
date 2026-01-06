// ===========================
// config/redis.js
// ===========================
const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

// Optional: Connect immediately (for testing)
client.connect().catch(err => console.error("Redis connection error:", err));

module.exports = client;
