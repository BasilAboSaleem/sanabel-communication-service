const SYSTEM = require("./systemRoles");
const CHAT = require("./chatRoles");

module.exports = {
  [SYSTEM.BOSS]: CHAT.OWNER,
  [SYSTEM.HR_MANAGER]: CHAT.ADMIN,
  [SYSTEM.HR_EMPLOYEE_MANAGER]: CHAT.SUPERVISOR,
  [SYSTEM.HR_EMPLOYEE]: CHAT.USER,
  [SYSTEM.VISITOR]: CHAT.VISITOR,
};
