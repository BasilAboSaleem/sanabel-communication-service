/**
 * Permissions List
 * -----------------
 * All permissions used across the system
 * Naming Convention:
 *   DOMAIN_ACTION
 *   مثال: GROUP_CREATE
 */

module.exports = {
  // =========================
  // Groups (Programs / Departments / Custom)
  // =========================
  GROUP_CREATE: 'GROUP_CREATE',
  GROUP_VIEW: 'GROUP_VIEW',
  GROUP_UPDATE: 'GROUP_UPDATE',
  GROUP_DELETE: 'GROUP_DELETE',
  GROUP_ARCHIVE: 'GROUP_ARCHIVE',

  GROUP_ADD_MEMBER: 'GROUP_ADD_MEMBER',
  GROUP_REMOVE_MEMBER: 'GROUP_REMOVE_MEMBER',
  GROUP_VIEW_MEMBERS: 'GROUP_VIEW_MEMBERS',

  // =========================
  // Messages
  // =========================
  MESSAGE_SEND: 'MESSAGE_SEND',
  MESSAGE_VIEW: 'MESSAGE_VIEW',
  MESSAGE_UPDATE: 'MESSAGE_UPDATE',
  MESSAGE_DELETE: 'MESSAGE_DELETE',

  // =========================
  // Conversations
  // =========================
  CONVERSATION_CREATE: 'CONVERSATION_CREATE',
  CONVERSATION_VIEW: 'CONVERSATION_VIEW',
  CONVERSATION_ARCHIVE: 'CONVERSATION_ARCHIVE',
  CONVERSATION_MANAGE_PARTICIPANTS: 'CONVERSATION_MANAGE_PARTICIPANTS',

  // =========================
  // System / Admin
  // =========================
  SYSTEM_VIEW_AUDIT_LOGS: 'SYSTEM_VIEW_AUDIT_LOGS',
  SYSTEM_MANAGE_SETTINGS: 'SYSTEM_MANAGE_SETTINGS',
};
