const Message = require('../models/Message');

class MessageRepository {
  async create(data) {
    return Message.create(data);
  }

  async findById(id) {
    return Message.findById(id);
  }

  // الحصول على رسائل محادثة
  async findByConversation(conversationId, { limit = 50, before } = {}) {
    const query = { conversationId, deletedAt: null };
    
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    return Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  // حذف ناعم
  async softDelete(id) {
    return Message.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );
  }

  // تحديث رسالة
  async update(id, data) {
    return Message.findByIdAndUpdate(
      id,
      { ...data, editedAt: new Date() },
      { new: true }
    );
  }

  // الحصول على آخر رسالة في محادثة
  async getLastMessage(conversationId) {
    return Message.findOne({
      conversationId,
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .lean();
  }
}

module.exports = new MessageRepository();
