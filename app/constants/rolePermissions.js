const P = require("./permissions");
const R = require("./chatRoles");

module.exports = {
  [R.OWNER]: Object.values(P),
  [R.ADMIN]: [
    P.CREATE_CONVERSATION,
    P.CREATE_GROUP,
    P.ADD_MEMBER,
    P.REMOVE_MEMBER,
    P.VIEW_ALL_CONVERSATIONS,
    P.SEND_MESSAGE,
  ],
  [R.SUPERVISOR]: [
    P.CREATE_CONVERSATION,
    P.SEND_MESSAGE,
  ],
  [R.USER]: [
    P.SEND_MESSAGE,
  ],
  [R.VISITOR]: [],
};
