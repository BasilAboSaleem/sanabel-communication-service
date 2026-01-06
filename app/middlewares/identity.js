// ===========================
// HTTP Identity Middleware (TEMP)
// ===========================

module.exports = (req, res, next) => {
  /**
   * TEMPORARY IMPLEMENTATION
   * Later this will:
   * - Verify JWT or headers from core system
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

  req.user = fakeUser;
  next();
};
