const conversationRepo = require('../repositories/conversationRepository');

class ConversationService {
  async listConversationsForOwner(user) {
    if (user.chatRole === 'OWNER') {
      return await conversationRepo.getAllConversations();
    }
    return [];
  }
}

module.exports = new ConversationService();
