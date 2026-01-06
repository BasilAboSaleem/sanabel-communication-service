// ===============================
// Authorization Middleware
// ===============================

module.exports = function authorize(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthenticated" });
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        error: "Forbidden",
        missingPermission: permission,
      });
    }

    next();
  };
};
