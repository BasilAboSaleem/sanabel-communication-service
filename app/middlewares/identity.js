// ===============================
// Identity Middleware for V1
// ===============================

const User = require("../models/User");

// Role mapping from HR System → Chat Role
const roleMap = {
  "hr.employee.manager": "CHAT_ADMIN",
  "hr.employee": "CHAT_USER",
  "hr.manager": "CHAT_ADMIN",
  "hr.deputy": "CHAT_ADMIN",
  "boss": "CHAT_SUPERVISOR",
  "visitor": "CHAT_USER",
};

// Permissions for each Chat Role
const permissionsMap = {
  CHAT_USER: ["chat.read", "chat.send"],
  CHAT_ADMIN: ["chat.read", "chat.send", "chat.delete_own", "chat.manage_group"],
  CHAT_SUPERVISOR: ["chat.read", "chat.send", "chat.delete_any", "chat.manage_group"],
};

// Middleware for REST
async function identityMiddleware(req, res, next) {
  try {
    // 1️⃣ Read token (example: JWT in Authorization header)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Decode token (replace with real JWT verification)
    // Here we simulate decoding for V1 (fake token)
    const decoded = fakeDecodeToken(token); // replace with real JWT verify in prod

    const hrRole = decoded.role;
    const chatRole = roleMap[hrRole] || "CHAT_USER";
    const permissions = permissionsMap[chatRole] || [];

    // 3️⃣ Upsert User Shadow in MongoDB
    let user = await User.findOne({ userId: decoded.userId });
    if (!user) {
      user = await User.create({
        userId: decoded.userId,
        name: decoded.name,
        role: hrRole,
        chatRole,
      });
    } else {
      user.chatRole = chatRole;
      user.role = hrRole;
      await user.save();
    }

    // 4️⃣ Attach to req.user
    req.user = {
      id: user.userId,
      name: user.name,
      role: hrRole,
      chatRole,
      permissions,
      companyId: decoded.companyId || null,
      department: decoded.department || null,
    };

    next();
  } catch (err) {
    console.error("Identity Middleware Error:", err);
    return res.status(401).json({ error: "Invalid token or user" });
  }
}

// Middleware for Socket.io
async function socketIdentity(socket, next) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("No token provided"));
    }

    const decoded = fakeDecodeToken(token); // replace with real JWT verification

    const hrRole = decoded.role;
    const chatRole = roleMap[hrRole] || "CHAT_USER";
    const permissions = permissionsMap[chatRole] || [];

    // Upsert User Shadow
    let user = await User.findOne({ userId: decoded.userId });
    if (!user) {
      user = await User.create({
        userId: decoded.userId,
        name: decoded.name,
        role: hrRole,
        chatRole,
      });
    } else {
      user.chatRole = chatRole;
      user.role = hrRole;
      await user.save();
    }

    socket.user = {
      id: user.userId,
      name: user.name,
      role: hrRole,
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

// ======= Fake JWT Decode for V1 (replace in production) =======
function fakeDecodeToken(token) {
  // Example: token = "userId:name:role:companyId"
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
