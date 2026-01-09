const conversationService = require('../../services/conversationService');

class ConversationsController {
  // render inbox page
  async renderConversationsPage(req, res, next) {
    try {
      const user = req.user; // مفترض middleware auth يضيف req.user
      //const conversations = await conversationService.listConversationsForOwner(user);
       const conversations = [
        { title: "أحمد علي", type: "direct", lastUpdated: "اليوم 10:30" },
        { title: "مجموعة الدعم", type: "group", lastUpdated: "أمس 14:20" },
        { title: "سارة حسين", type: "direct", lastUpdated: "أمس 09:15" },
        { title: "قسم التطوير", type: "group", lastUpdated: "قبل 3 أيام" },
        
    
      
    
    ];
 
      res.render('owner/conversations', { 
        conversations, // تمرير للـ EJS
        user
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ConversationsController();
