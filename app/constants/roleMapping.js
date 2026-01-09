// ===========================
// Role Mapping
// System Role (from token) → Chat Role (internal)
// ===========================

const CHAT_ROLES = require('./chatRoles');

module.exports = {
  // ===========================
  // Top Management
  // ===========================
  boss: {
    chatRole: CHAT_ROLES.OWNER,
  },

  // ===========================
  // HR Management
  // ===========================
  'hr.manager': {
    chatRole: CHAT_ROLES.ADMIN,
  },

  'hr.employee.manager': {
    chatRole: CHAT_ROLES.MODERATOR,
  },

  'hr.deputy': {
    chatRole: CHAT_ROLES.MODERATOR,
  },

  // ===========================
  // Employees
  // ===========================
  'hr.employee': {
    chatRole: CHAT_ROLES.MEMBER,
  },

  // ===========================
  // External / Visitor
  // ===========================
  visitor: {
    chatRole: CHAT_ROLES.VISITOR,
  },
};
