const express = require("express");
const router = express.Router();
const conversationService = require("../services/conversationService");
const groupService = require("../services/groupService");

// Dashboard الرئيسي
router.get("/", async (req, res) => {
  try {
    const user = req.user;
    
    // الحصول على إحصائيات
    const conversations = await conversationService.getUserConversations(user.id);
    const groups = await groupService.getMyGroups(user.id);
    
    res.render("dashboard", {
      user,
      stats: {
        conversationsCount: conversations.length,
        groupsCount: groups.length,
        unreadMessages: 0, // TODO: إضافة حساب الرسائل غير المقروءة
      },
      recentConversations: conversations.slice(0, 5),
      recentGroups: groups.slice(0, 5),
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).render("error", { error: error.message });
  }
});

module.exports = router;
