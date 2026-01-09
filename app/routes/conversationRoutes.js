const router = require('express').Router();
const controller = require('../controllers/conversationController');
const authorize = require('../middlewares/authorize');
const P = require('../constants/permissions');

// إنشاء محادثة مباشرة
router.post(
  '/direct',
  authorize(P.CONVERSATION_CREATE),
  controller.createDirectConversation
);

// إنشاء محادثة جماعية
router.post(
  '/group',
  authorize(P.CONVERSATION_CREATE),
  controller.createGroupConversation
);

// الحصول على محادثاتي
router.get(
  '/',
  authorize(P.CONVERSATION_VIEW),
  controller.getMyConversations
);

// الحصول على محادثة واحدة
router.get(
  '/:id',
  authorize(P.CONVERSATION_VIEW),
  controller.getConversation
);

// الحصول على رسائل محادثة
router.get(
  '/:id/messages',
  authorize(P.MESSAGE_VIEW),
  controller.getMessages
);

// إرسال رسالة
router.post(
  '/:id/messages',
  authorize(P.MESSAGE_SEND),
  controller.sendMessage
);

// تحديث رسالة
router.put(
  '/messages/:messageId',
  authorize(P.MESSAGE_UPDATE),
  controller.updateMessage
);

// حذف رسالة
router.delete(
  '/messages/:messageId',
  authorize(P.MESSAGE_DELETE),
  controller.deleteMessage
);

// أرشفة محادثة
router.post(
  '/:id/archive',
  authorize(P.CONVERSATION_ARCHIVE),
  controller.archiveConversation
);

// إضافة عضو
router.post(
  '/:id/participants',
  authorize(P.CONVERSATION_MANAGE_PARTICIPANTS),
  controller.addParticipant
);

// إزالة عضو
router.delete(
  '/:id/participants',
  authorize(P.CONVERSATION_MANAGE_PARTICIPANTS),
  controller.removeParticipant
);

module.exports = router;
