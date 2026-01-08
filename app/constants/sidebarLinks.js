// ===========================
// Sidebar Links حسب Chat Role
// ===========================

const CHAT = require("./chatRoles");

module.exports = {
  [CHAT.OWNER]: [
    { section: "Main", items: [{ id: "dashboard", label: "لوحة التحكم", icon: "bi bi-grid-fill", path: "/dashboard" },
   { id: "inbox", label: "المحادثات", icon: "bi bi-chat-dots-fill", path: "/owner/conversations" }] },
    { section: "Management", items: [
      { id: "users", label: "إدارة المستخدمين", icon: "bi bi-people-fill", path: "/users" },
      { id: "groups", label: "إدارة المجموعات", icon: "bi bi-collection-fill", path: "/groups" },
      { id: "audit", label: "سجل التدقيق", icon: "bi bi-journal-text", path: "/audit" },
      { id: "settings", label: "الإعدادات", icon: "bi bi-gear-fill", path: "/settings" },
    ]},
  ],

  [CHAT.ADMIN]: [
    { section: "Main", items: [{ id: "dashboard", label: "لوحة التحكم", icon: "bi bi-grid-fill", path: "/dashboard" }] },
    { section: "Department", items: [
      { id: "dept-chat", label: "تواصل القسم", icon: "bi bi-chat-dots-fill", path: "/chat/department" },
      { id: "reports", label: "تقارير", icon: "bi bi-file-earmark-text-fill", path: "/reports" },
    ]},
  ],

  [CHAT.SUPERVISOR]: [
    { section: "Main", items: [{ id: "dashboard", label: "لوحة التحكم", icon: "bi bi-grid-fill", path: "/dashboard" }] },
    { section: "Work", items: [
      { id: "program-chat", label: "تواصل البرنامج/المشروع", icon: "bi bi-chat-dots-fill", path: "/chat/program" },
      { id: "tasks", label: "المهام", icon: "bi bi-check2-square", path: "/tasks" },
    ]},
  ],

  [CHAT.USER]: [
    { section: "My Area", items: [
      { id: "dashboard", label: "لوحة التحكم", icon: "bi bi-grid-fill", path: "/dashboard" },
      { id: "my-chat", label: "محادثاتي", icon: "bi bi-chat-dots-fill", path: "/chat" },
      { id: "tasks", label: "مهامي", icon: "bi bi-check2-square", path: "/tasks" },
    ]},
  ],

  [CHAT.VISITOR]: [
    { section: "Limited Access", items: [
      { id: "home", label: "الرئيسية", icon: "bi bi-house-fill", path: "/" },
      { id: "contact-supervisor", label: "تواصل مع المشرف", icon: "bi bi-envelope-fill", path: "/chat/supervisor" },
    ]},
  ],
};