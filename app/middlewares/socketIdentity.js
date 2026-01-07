const CHAT_ROLES = require("../constants/chatRoles");
const rolePermissions = require("../constants/rolePermissions");

const fakeUser = {
  id: "user-123",
  name: "Test User",
  chatRole: CHAT_ROLES.USER,   // <-- بدل CHAT_USER
  permissions: rolePermissions[CHAT_ROLES.USER], // <-- خليها من الملف الرسمي
};
