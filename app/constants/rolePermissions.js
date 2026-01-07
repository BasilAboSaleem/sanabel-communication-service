// ===========================
// Permissions حسب Chat Role (قبل تصفية الـ Scope)
// ===========================

const P = require("./permissions");
const CHAT = require("./chatRoles");

module.exports = {
  [CHAT.OWNER]: Object.values(P), // كل الصلاحيات

  [CHAT.ADMIN]: [
    P.CREATE_CONVERSATION,
    P.CREATE_GROUP,
    P.CREATE_DEPARTMENT_GROUP,
    P.ADD_MEMBER,
    P.REMOVE_MEMBER,
    P.VIEW_ALL_CONVERSATIONS,
    P.VIEW_DEPARTMENT_CONVERSATIONS,
    P.VIEW_AUDIT_LOGS,
    P.SEND_MESSAGE,
  ],

  [CHAT.SUPERVISOR]: [
    P.CREATE_CONVERSATION,
    P.CREATE_GROUP,
    P.CREATE_PROGRAM_GROUP,
    P.CREATE_PROJECT_GROUP,
    P.ADD_MEMBER,
    P.REMOVE_MEMBER,
    P.VIEW_PROGRAM_CONVERSATIONS,
    P.VIEW_PROJECT_CONVERSATIONS,
    P.SEND_MESSAGE,
  ],

  [CHAT.USER]: [
    P.CREATE_CONVERSATION,
    P.SEND_MESSAGE,
  ],

  [CHAT.VISITOR]: [
    P.SEND_MESSAGE, // محدود جداً (فقط مع supervisor)
  ],
};