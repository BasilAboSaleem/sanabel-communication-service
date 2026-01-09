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
const messageHandlers = require("./app/sockets/messageHandlers");

io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.user.name} (${socket.user.chatRole})`);

  // Join personal room
  socket.join(socket.user.id);

  // Welcome message
  socket.emit("welcome", {
    message: `مرحباً ${socket.user.name}، أهلاً بك في نظام التواصل`,
    user: {
      id: socket.user.id,
      name: socket.user.name,
      chatRole: socket.user.chatRole,
    },
  });

  // ===========================
  // Conversation Events
  // ===========================
  
  // Join conversation room
  socket.on("join_conversation", async (data) => {
    await messageHandlers.handleJoinConversation(socket, data.conversationId);
  });

  // Leave conversation room
  socket.on("leave_conversation", (data) => {
    messageHandlers.handleLeaveConversation(socket, data.conversationId);
  });

  // ===========================
  // Message Events
  // ===========================

  // Send message
  socket.on("send_message", async (data) => {
    await messageHandlers.handleSendMessage(socket, io, data);
  });

  // Update message
  socket.on("update_message", async (data) => {
    await messageHandlers.handleUpdateMessage(socket, io, data);
  });

  // Delete message
  socket.on("delete_message", async (data) => {
    await messageHandlers.handleDeleteMessage(socket, io, data);
  });

  // Typing indicator
  socket.on("typing", (data) => {
    messageHandlers.handleTyping(socket, io, data);
  });

  // ===========================
  // Disconnect
  // ===========================
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
