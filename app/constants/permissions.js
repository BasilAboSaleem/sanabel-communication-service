// ===========================
// Permissions لنظام التواصل
// ===========================

module.exports = {
  CREATE_CONVERSATION: "create_conversation",
  SEND_MESSAGE: "send_message",
  CREATE_GROUP: "create_group",
  CREATE_DEPARTMENT_GROUP: "create_department_group",
  CREATE_PROGRAM_GROUP: "create_program_group",
  CREATE_PROJECT_GROUP: "create_project_group",
  ADD_MEMBER: "add_member",
  REMOVE_MEMBER: "remove_member",
  VIEW_ALL_CONVERSATIONS: "view_all_conversations",     // فقط Global
  VIEW_DEPARTMENT_CONVERSATIONS: "view_department_conversations",
  VIEW_PROGRAM_CONVERSATIONS: "view_program_conversations",
  VIEW_PROJECT_CONVERSATIONS: "view_project_conversations",
  VIEW_AUDIT_LOGS: "view_audit_logs",                    // فقط Owner/Admin
  MANAGE_USERS: "manage_users",                         // Owner فقط
};