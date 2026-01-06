// ===============================
// Identity Middleware for V1
// ===============================

const User = require("../models/User");
const roleMapping = require("../constants/roleMapping");
const rolePermissions = require("../constants/rolePermissions");

// ===============================
// REST Identity Middleware
// ===============================
async function identityMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Fake decode (V1)
    const decoded = fakeDecodeToken(token);

    const systemRole = decoded.role;

    // 🔑 map system role → chat role
    const chatRole = roleMapping[systemRole] || "chat.visitor";

    // 🔐 load permissions by chat role
    const permissions = rolePermissions[chatRole] || [];

    // Shadow user
    let user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      user = await User.create({
        userId: decoded.userId,
        name: decoded.name,
        systemRole,
        chatRole,
      });
    } else {
      user.systemRole = systemRole;
      user.chatRole = chatRole;
      await user.save();
    }

    req.user = {
      id: user.userId,
      name: user.name,
      systemRole,
      chatRole,
      permissions,
      companyId: decoded.companyId || null,
      department: decoded.department || null,
    };

    next();
  } catch (err) {
    console.error("Identity Middleware Error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ===============================
// Socket.io Identity Middleware
// ===============================
async function socketIdentity(socket, next) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("No token provided"));
    }

    const decoded = fakeDecodeToken(token);

    const systemRole = decoded.role;
    const chatRole = roleMapping[systemRole] || "chat.visitor";
    const permissions = rolePermissions[chatRole] || [];

    let user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      user = await User.create({
        userId: decoded.userId,
        name: decoded.name,
        systemRole,
        chatRole,
      });
    } else {
      user.systemRole = systemRole;
      user.chatRole = chatRole;
      await user.save();
    }

    socket.user = {
      id: user.userId,
      name: user.name,
      systemRole,
      chatRole,
      permissions,
      companyId: decoded.companyId || null,
      department: decoded.department || null,
    };

    next();
  } catch (err) {
    console.error("Socket Identity Error:", err);
    next(new Error("Authentication error"));
  }
}

// ===============================
// Fake Decode (V1 only)
// ===============================
function fakeDecodeToken(token) {
  // userId:name:role:companyId:department
  const parts = token.split(":");

  return {
    userId: parts[0] || "u123",
    name: parts[1] || "John Doe",
    role: parts[2] || "hr.employee",
    companyId: parts[3] || "company1",
    department: parts[4] || "HR",
  };
}

module.exports = {
  identityMiddleware,
  socketIdentity,
};
