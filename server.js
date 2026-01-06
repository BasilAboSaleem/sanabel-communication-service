// ===========================
// Sanabel Communication Service - server.js
// ===========================

const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const path = require("path");
const dotenv = require("dotenv");

// Load env
dotenv.config();

// ---------- App ----------
const app = require("./app"); // app.js already has middlewares, routes, views, etc.

// ---------- DB / Redis ----------
const connectDB = require("./config/db");
const redis = require("./config/redis");

connectDB();
redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

// ---------- HTTP Server ----------
const server = http.createServer(app);

// ---------- Socket.io ----------
const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Identity Middleware
const { socketIdentity } = require("./app/middlewares/identity");

// Apply socket middleware
io.use(socketIdentity);

// Socket Event Handlers
io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.user.name} (${socket.user.chatRole})`);

  // Join personal room
  socket.join(socket.user.id);

  // Example: send welcome
  socket.emit("welcome", `Hello ${socket.user.name}, welcome to Sanabel Chat`);

  // Handle direct message
  socket.on("direct_message", async (data) => {
    try {
      // TODO: Implement permission check + service call
      console.log(`Message from ${socket.user.name} to ${data.to}: ${data.message}`);
      // Emit to recipient room
      io.to(data.to).emit("direct_message", {
        from: socket.user.id,
        message: data.message,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error(err);
      socket.emit("error", "Failed to send message");
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.user.name}`);
  });
});

// ---------- Workers Placeholder ----------
const startWorkers = () => {
  console.log("🚀 Workers started (placeholder)");
  // TODO: Add BullMQ / Redis workers for Audit / Background jobs
};
startWorkers();

// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
