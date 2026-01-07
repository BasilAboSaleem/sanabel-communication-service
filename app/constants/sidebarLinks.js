// app/constants/sidebarLinks.js
module.exports = {
  [require("./chatRoles").OWNER]: [
    { name: "Dashboard", icon: "bi bi-grid-fill", link: "/dashboard" },
    { name: "User Management", icon: "bi bi-people-fill", link: "/users" },
    { name: "Settings", icon: "bi bi-gear-fill", link: "/settings" },
  ],
  [require("./chatRoles").ADMIN]: [
    { name: "Dashboard", icon: "bi bi-grid-fill", link: "/dashboard" },
    { name: "Reports", icon: "bi bi-file-earmark-text-fill", link: "/reports" },
  ],
  [require("./chatRoles").SUPERVISOR]: [
    { name: "Dashboard", icon: "bi bi-grid-fill", link: "/dashboard" },
    { name: "Team Chat", icon: "bi bi-chat-dots-fill", link: "/chat" },
  ],
  [require("./chatRoles").USER]: [
    { name: "Dashboard", icon: "bi bi-grid-fill", link: "/dashboard" },
    { name: "My Tasks", icon: "bi bi-check2-square", link: "/tasks" },
  ],
  [require("./chatRoles").VISITOR]: [
    { name: "Home", icon: "bi bi-house-fill", link: "/" },
    { name: "Contact", icon: "bi bi-envelope-fill", link: "/contact" },
  ],
};
