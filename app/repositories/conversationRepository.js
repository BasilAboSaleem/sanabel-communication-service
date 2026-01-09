const Conversation = require('../models/Conversation');

class ConversationRepository {
  async create(data) {
    return Conversation.create(data);
  }

  async findById(id) {
    return Conversation.findById(id);
  }

  // البحث عن محادثة مباشرة بين مستخدمين
  async findDirectConversation(userId1, userId2) {
    return Conversation.findOne({
      type: 'direct',
      participants: {
        $all: [
          { userId: userId1 },
          { userId: userId2 }
        ]
      },
      isArchived: false,
    });
  }

  // الحصول على محادثات المستخدم
  async findByUser(userId) {
    return Conversation.find({
      'participants.userId': userId,
      isArchived: false,
    })
      .sort({ updatedAt: -1 })
      .populate('createdBy', 'name userId')
      .lean();
  }

  // الحصول على جميع المحادثات (للمالك)
  async getAllConversations() {
    return Conversation.find({ isArchived: false })
      .sort({ updatedAt: -1 })
      .populate('createdBy', 'name userId')
      .lean();
  }

  // أرشفة محادثة
  async archive(id) {
    return Conversation.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true }
    );
  }

  // إضافة مشارك
  async addParticipant(conversationId, participant) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $addToSet: { participants: participant } },
      { new: true }
    );
  }

  // إزالة مشارك
  async removeParticipant(conversationId, userId) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $pull: { participants: { userId } } },
      { new: true }
    );
  }

  // تحديث آخر نشاط
  async updateLastActivity(conversationId) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      { updatedAt: new Date() },
      { new: true }
    );
  }
}

module.exports = new ConversationRepository();
