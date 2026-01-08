// ===========================
// Role Mapping: System Role → Chat Role
// Source of truth: token.role + token.scope
// ===========================

const CHAT = require("./chatRoles");

module.exports = {
  // ===========================
  // Company Level
  // ===========================
  "company.owner": {
    chatRole: CHAT.OWNER,
  },

  // ===========================
  // Program Level
  // ===========================
  "program.manager": {
    chatRole: CHAT.SUPERVISOR,
  },

  // ===========================
  // Department Level
  // ===========================
  "hr.manager": {
    chatRole: CHAT.ADMIN,
  },

  // ===========================
  // Project Level
  // ===========================
  "project.manager": {
    chatRole: CHAT.SUPERVISOR,
  },

  // ===========================
  // Employees
  // ===========================
  "hr.employee": {
    chatRole: CHAT.USER,
  },

  // ===========================
  // Visitors / External
  // ===========================
  "visitor": {
    chatRole: CHAT.VISITOR,
  },
};
