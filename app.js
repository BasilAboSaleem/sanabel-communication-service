
// ===========================
// Sanabel Communication Service - app.js
// ===========================

// ---------- Imports ----------
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const CHAT_ROLES = require("./app/constants/chatRoles");

// ---------- Config / DB ----------
const connectDB = require("./config/db");     // MongoDB
const redis = require("./config/redis");      // Redis
 
// ---------- Middlewares ----------
const { identityMiddleware } = require("./app/middlewares/identity");

// ---------- App Initialization ----------
const app = express();

// ---------- View Engine Setup ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------- Database Connections ----------
connectDB();

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

// ---------- Global Middlewares ----------

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Static files
app.use(express.static(path.join(__dirname, "public")));

// CORS
app.use(cors({
  origin: process.env.BASE_URL || "*",
  credentials: true,
}));

// Logger (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate Limiter (basic protection)
app.use(rateLimit({
  windowMs: 1000,
  max: 100,
  message: "Too many requests, please slow down.",
}));

// ---------- Identity Middleware (NO AUTH) ----------
// Attaches req.user based on trusted token / headers
app.use(identityMiddleware);

// ---------- Global View Locals ----------

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.CHAT_ROLES = CHAT_ROLES;
  next();
});

const sidebarLinks = require("./app/constants/sidebarLinks");

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.CHAT_ROLES = require("./app/constants/chatRoles");
  res.locals.sidebarLinks = req.user ? sidebarLinks[req.user.chatRole] || [] : [];
  next();
});

const sidebarMiddleware = require("./app/middlewares/sidebar");

app.use(sidebarMiddleware);

// ---------- Routes ----------
const indexRoutes = require("./app/routes/index");
const ownerRoutes = require("./app/routes/owner");

// UI routes
//app.use("/", dashboardRoutes);
app.use('/', indexRoutes);
app.use('/owner', ownerRoutes);

// API routes (REST – secondary)
//app.use("/api/chat", chatRoutes);

// ---------- Health Check ----------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    service: "sanabel-communication-service",
    status: "ok",
    timestamp: new Date(),
  });
});

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ error: message });
});

// ---------- Export App ----------
module.exports = app;
