const User = require("../models/User");
const roleMapping = require("../constants/roleMapping");
const rolePermissions = require("../constants/rolePermissions");
const CHAT_ROLES = require("../constants/chatRoles");

// ===============================
// REST Identity Middleware
// ===============================
async function identityMiddleware(req, res, next) {
  try {
    let decoded;
    const authHeader = req.headers.authorization;

    // ===============================
    // TEMP MODE (No Token)
    // ===============================
    if (!authHeader) {
      decoded = {
        userId: "u123",
        name: "John Doe",
        role: "hr.employee",
        scope: "Personal",
        companyId: "company1",
        department: "HR",
      };
    } else {
      const token = authHeader.split(" ")[1];
      decoded = fakeDecodeToken(token);
    }

    // ===============================
    // Role Mapping (System Role → Chat Role)
    // ===============================
    const roleConfig = roleMapping[decoded.role];
    const chatRole = roleConfig?.chatRole || CHAT_ROLES.VISITOR;

    // ===============================
    // Scope comes ONLY from token
    // ===============================
    const scope = decoded.scope || "Personal";

    // ===============================
    // Permissions
    // ===============================
    let permissions = rolePermissions[chatRole] || [];
    permissions = filterPermissionsByScope(permissions, scope);

    // ===============================
    // Shadow User (Mongo)
    // ===============================
    let user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      user = await User.create({
        userId: decoded.userId,
        name: decoded.name,
        systemRole: decoded.role,
        chatRole,
        scope,
      });
    } else {
      user.systemRole = decoded.role;
      user.chatRole = chatRole;
      user.scope = scope;
      await user.save();
    }

    // ===============================
    // Attach to request
    // ===============================
    req.user = {
      id: user.userId,
      name: user.name,
      systemRole: decoded.role,
      chatRole,
      permissions,
      scope,
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
    let decoded;
    const token = socket.handshake.auth?.token;

    // ===============================
    // TEMP MODE (No Token)
    // ===============================
    if (!token) {
      decoded = {
        userId: "u123",
        name: "John Doe",
        role: "hr.employee",
        scope: "Personal",
        companyId: "company1",
        department: "HR",
      };
    } else {
      decoded = fakeDecodeToken(token);
    }

    const roleConfig = roleMapping[decoded.role];
    const chatRole = roleConfig?.chatRole || CHAT_ROLES.VISITOR;
    const scope = decoded.scope || "Personal";

    let permissions = rolePermissions[chatRole] || [];
    permissions = filterPermissionsByScope(permissions, scope);

    let user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      user = await User.create({
        userId: decoded.userId,
        name: decoded.name,
        systemRole: decoded.role,
        chatRole,
        scope,
      });
    } else {
      user.systemRole = decoded.role;
      user.chatRole = chatRole;
      user.scope = scope;
      await user.save();
    }

    socket.user = {
      id: user.userId,
      name: user.name,
      systemRole: decoded.role,
      chatRole,
      permissions,
      scope,
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
// Filter Permissions by Scope
// ===============================
function filterPermissionsByScope(permissions, scope) {
  if (scope === "Global") return permissions;

  const restricted = ["VIEW_ALL_CONVERSATIONS"];
  return permissions.filter(p => !restricted.includes(p));
}

// ===============================
// Fake Decode Token (TEMP ONLY)
// token format:
// userId:name:role:scope:companyId:department
// ===============================
function fakeDecodeToken(token) {
  const parts = token.split(":");
  return {
    userId: parts[0] || "u123",
    name: parts[1] || "John Doe",
    role: parts[2] || "hr.employee",
    scope: parts[3] || "Personal",
    companyId: parts[4] || "company1",
    department: parts[5] || "HR",
  };
}

module.exports = {
  identityMiddleware,
  socketIdentity,
};
