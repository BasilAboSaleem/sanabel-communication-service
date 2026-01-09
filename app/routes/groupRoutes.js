const router = require('express').Router();
const controller = require('../controllers/groupController');
const authorize = require('../middlewares/authorize');
const P = require('../constants/permissions');

router.post(
  '/',
  authorize(P.GROUP_CREATE),
  controller.createGroup
);

router.get(
  '/mine',
  authorize(P.GROUP_VIEW),
  controller.myGroups
);

router.post(
  '/add-member',
  authorize(P.GROUP_ADD_MEMBER),
  controller.addMember
);

module.exports = router;
