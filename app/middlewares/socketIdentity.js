// ===========================
// Socket Identity Middleware (TEMP)
// ===========================

module.exports = (socket, next) => {
  /**
   * TEMPORARY IMPLEMENTATION
   * Later this will:
   * - Validate token from socket.handshake.auth
   * - Or headers injected by gateway
   */

  const fakeUser = {
    id: "user-123",
    name: "Test User",
    role: "CHAT_USER",
    permissions: [
      "chat.read",
      "chat.send",
    ],
  };

  socket.user = fakeUser;
  next();
};
