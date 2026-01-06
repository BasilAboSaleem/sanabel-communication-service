
// ===========================
// Sanabel Communication Service - server.js
// ===========================

const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = require("./app");

// ---------- Create HTTP Server ----------
const server = http.createServer(app);

// ---------- Initialize Socket.io ----------
const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL || "*",
    credentials: true,
  },
});

// ---------- Socket Identity Middleware ----------
const socketIdentityMiddleware = require("./app/middlewares/socketIdentity");

io.use(socketIdentityMiddleware);

// ---------- Socket Connection ----------
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.user?.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.user?.id);
  });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ---------- Export io (for later use) ----------
module.exports = { io };
