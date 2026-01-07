// يبقى كما هو، لأن sidebarLinks الجديد يدعم كل الـ chatRoles
const sidebarLinks = require("../constants/sidebarLinks");

module.exports = function sidebarMiddleware(req, res, next) {
  const role = req.user?.chatRole;
  const currentPath = req.path;

  const sections = sidebarLinks[role] || [];

  sections.forEach(section => {
    section.items.forEach(item => {
      item.active = item.path === currentPath || currentPath.startsWith(item.path);
    });
  });

  res.locals.sidebar = sections;
  next();
};