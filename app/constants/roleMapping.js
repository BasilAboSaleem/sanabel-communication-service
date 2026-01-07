// ===========================
// Role Mapping: Job Title → System Role → Chat Role + Scope
// ===========================

const SYSTEM = require("./systemRoles");
const CHAT = require("./chatRoles");

module.exports = {
  // Job Title (يجب أن يطابق بالضبط ما يرسله النظام الأساسي)
  "مدير المؤسسة": { systemRole: SYSTEM.BOSS, chatRole: CHAT.OWNER, scope: "Global" },
  "نائب المدير": { systemRole: SYSTEM.HR_MANAGER, chatRole: CHAT.ADMIN, scope: "Global" },
  "مدير البرامج": { systemRole: SYSTEM.HR_DEPUTY, chatRole: CHAT.SUPERVISOR, scope: "Program" },
  "مدير برنامج": { systemRole: SYSTEM.HR_DEPUTY, chatRole: CHAT.SUPERVISOR, scope: "Program" },
  "رئيس قسم": { systemRole: SYSTEM.HR_MANAGER, chatRole: CHAT.ADMIN, scope: "Department" },
  "مدير مشروع": { systemRole: SYSTEM.HR_EMPLOYEE_MANAGER, chatRole: CHAT.SUPERVISOR, scope: "Project" },
  "سكرتير": { systemRole: SYSTEM.HR_EMPLOYEE, chatRole: CHAT.USER, scope: "Department" },
  "موظف": { systemRole: SYSTEM.HR_EMPLOYEE, chatRole: CHAT.USER, scope: "Personal" },
  "متطوع": { systemRole: SYSTEM.VISITOR, chatRole: CHAT.VISITOR, scope: "Limited" },

  // Fallback للـ system roles القديمة (إذا ما كان في jobTitle)
  [SYSTEM.BOSS]: { chatRole: CHAT.OWNER, scope: "Global" },
  [SYSTEM.HR_MANAGER]: { chatRole: CHAT.ADMIN, scope: "Global" },
  [SYSTEM.HR_DEPUTY]: { chatRole: CHAT.SUPERVISOR, scope: "Program" },
  [SYSTEM.HR_EMPLOYEE_MANAGER]: { chatRole: CHAT.SUPERVISOR, scope: "Project" },
  [SYSTEM.HR_EMPLOYEE]: { chatRole: CHAT.USER, scope: "Personal" },
  [SYSTEM.VISITOR]: { chatRole: CHAT.VISITOR, scope: "Limited" },
};