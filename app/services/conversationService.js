const conversationRepository = require('../repositories/conversationRepository');
const messageRepository = require('../repositories/messageRepository');
const User = require('../models/User');

class ConversationService {
  // إنشاء محادثة مباشرة
  async createDirectConversation(userId1, userId2) {
    // التحقق من وجود محادثة سابقة
    const existing = await conversationRepository.findDirectConversation(userId1, userId2);
    if (existing) return existing;

    const user1 = await User.findOne({ userId: userId1 });
    const user2 = await User.findOne({ userId: userId2 });

    if (!user1 || !user2) {
      throw new Error('User not found');
    }

    return await conversationRepository.create({
      type: 'direct',
      participants: [
        { userId: userId1, chatRole: user1.chatRole },
        { userId: userId2, chatRole: user2.chatRole },
      ],
      scope: 'Personal',
      createdBy: user1._id,
    });
  }

  // إنشاء محادثة جماعية
  async createGroupConversation({ title, participants, scope, createdBy }) {
    const creator = await User.findOne({ userId: createdBy });
    if (!creator) throw new Error('Creator not found');

    const participantsData = await Promise.all(
      participants.map(async (userId) => {
        const user = await User.findOne({ userId });
        return { userId, chatRole: user?.chatRole || 'MEMBER' };
      })
    );

    return await conversationRepository.create({
      type: 'group',
      title,
      participants: participantsData,
      scope: scope || 'Department',
      createdBy: creator._id,
    });
  }

  // الحصول على محادثات المستخدم
  async getUserConversations(userId) {
    return await conversationRepository.findByUser(userId);
  }

  // الحصول على محادثة واحدة
  async getConversationById(conversationId, userId) {
    const conversation = await conversationRepository.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    // التحقق من أن المستخدم مشارك في المحادثة
    const isParticipant = conversation.participants.some(p => p.userId === userId);
    if (!isParticipant) {
      throw new Error('Access denied');
    }

    return conversation;
  }

  // أرشفة محادثة
  async archiveConversation(conversationId, userId) {
    const conversation = await this.getConversationById(conversationId, userId);
    return await conversationRepository.archive(conversationId);
  }

  // إضافة عضو لمحادثة جماعية
  async addParticipant(conversationId, newUserId, addedBy) {
    const conversation = await this.getConversationById(conversationId, addedBy);
    
    if (conversation.type !== 'group') {
      throw new Error('Can only add participants to group conversations');
    }

    const user = await User.findOne({ userId: newUserId });
    if (!user) throw new Error('User not found');

    return await conversationRepository.addParticipant(conversationId, {
      userId: newUserId,
      chatRole: user.chatRole,
    });
  }

  // إزالة عضو من محادثة
  async removeParticipant(conversationId, userIdToRemove, removedBy) {
    const conversation = await this.getConversationById(conversationId, removedBy);
    
    if (conversation.type !== 'group') {
      throw new Error('Can only remove participants from group conversations');
    }

    return await conversationRepository.removeParticipant(conversationId, userIdToRemove);
  }

  // الحصول على الرسائل
  async getMessages(conversationId, userId, { limit = 50, before } = {}) {
    await this.getConversationById(conversationId, userId); // التحقق من الصلاحية
    return await messageRepository.findByConversation(conversationId, { limit, before });
  }

  // إرسال رسالة
  async sendMessage(conversationId, senderId, content) {
    const conversation = await this.getConversationById(conversationId, senderId);
    
    const message = await messageRepository.create({
      conversationId: conversation._id,
      senderId,
      content,
    });

    return message;
  }

  // حذف رسالة
  async deleteMessage(messageId, userId) {
    const message = await messageRepository.findById(messageId);
    if (!message) throw new Error('Message not found');

    if (message.senderId !== userId) {
      throw new Error('Can only delete your own messages');
    }

    return await messageRepository.softDelete(messageId);
  }

  // تحديث رسالة
  async updateMessage(messageId, userId, content) {
    const message = await messageRepository.findById(messageId);
    if (!message) throw new Error('Message not found');

    if (message.senderId !== userId) {
      throw new Error('Can only edit your own messages');
    }

    return await messageRepository.update(messageId, { content });
  }

  // قائمة المحادثات للمالك (Owner)
  async listConversationsForOwner(user) {
    if (user.chatRole === 'OWNER') {
      return await conversationRepository.getAllConversations();
    }
    return await this.getUserConversations(user.id);
  }
}

module.exports = new ConversationService();
