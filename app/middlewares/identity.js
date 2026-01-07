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

    if (!authHeader) {
      // TEMP: Fake User for testing
      decoded = {
        userId: "u123",
        name: "John Doe",
        role: "boss",           // System Role
        jobTitle: "مدير المؤسسة", // Job Title
        scope: "Global",        // Global / Department / Program / Project / Personal
        companyId: "company1",
        department: "HR",
      };
    } else {
      const token = authHeader.split(" ")[1];
      decoded = fakeDecodeToken(token);
    }

    // === Determine chatRole and scope using jobTitle first, then systemRole ===
    const mapping =
      (decoded.jobTitle && roleMapping[decoded.jobTitle]) ||
      roleMapping[decoded.role] ||
      { chatRole: CHAT_ROLES.VISITOR, scope: "Limited" };

    const systemRole = decoded.role;
    const chatRole = mapping.chatRole;
    const scope = mapping.scope;

    // Load permissions for the chatRole
    let permissions = rolePermissions[chatRole] || [];
    permissions = filterPermissionsByScope(permissions, scope);

    // Shadow user in MongoDB
    let user = await User.findOne({ userId: decoded.userId });
    if (!user) {
      user = await User.create({
        userId: decoded.userId,
        name: decoded.name,
        systemRole,
        chatRole,
        scope,
      });
    } else {
      user.systemRole = systemRole;
      user.chatRole = chatRole;
      user.scope = scope;
      await user.save();
    }

    req.user = {
      id: user.userId,
      name: user.name,
      systemRole,
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

    if (!token) {
      // TEMP: Fake User for testing
      decoded = {
        userId: "u123",
        name: "John Doe",
        role: "hr.employee",
        jobTitle: "موظف",
        scope: "Personal",
        companyId: "company1",
        department: "HR",
      };
    } else {
      decoded = fakeDecodeToken(token);
    }

    const mapping =
      (decoded.jobTitle && roleMapping[decoded.jobTitle]) ||
      roleMapping[decoded.role] ||
      { chatRole: CHAT_ROLES.VISITOR, scope: "Limited" };

    const systemRole = decoded.role;
    const chatRole = mapping.chatRole;
    const scope = mapping.scope;

    let permissions = rolePermissions[chatRole] || [];
    permissions = filterPermissionsByScope(permissions, scope);

    let user = await User.findOne({ userId: decoded.userId });
    if (!user) {
      user = await User.create({
        userId: decoded.userId,
        name: decoded.name,
        systemRole,
        chatRole,
        scope,
      });
    } else {
      user.systemRole = systemRole;
      user.chatRole = chatRole;
      user.scope = scope;
      await user.save();
    }

    socket.user = {
      id: user.userId,
      name: user.name,
      systemRole,
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

  const restricted = ["VIEW_ALL_CONVERSATIONS"]; // مثال: ممنوع على غير Global
  return permissions.filter(p => !restricted.includes(p));
}

// ===============================
// Fake Decode Token (TEMP)
// ===============================
function fakeDecodeToken(token) {
  const parts = token.split(":");
  return {
    userId: parts[0] || "u123",
    name: parts[1] || "John Doe",
    role: parts[2] || "hr.employee",
    jobTitle: parts[3] || undefined,
    scope: parts[4] || "Personal",
    companyId: parts[5] || "company1",
    department: parts[6] || "HR",
  };
}

module.exports = {
  identityMiddleware,
  socketIdentity,
};
