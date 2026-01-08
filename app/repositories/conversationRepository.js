const Conversation = require('../models/Conversation');

class ConversationRepository {
  async getAllConversations() {
    return Conversation.find()
      .sort({ updatedAt: -1 })
      .select('_id type title scope participants updatedAt'); // فقط metadata
  }
}

module.exports = new ConversationRepository();
