const conversationService = require('../services/conversationService');
const messageRepository = require('../repositories/messageRepository');

// إنشاء محادثة مباشرة
exports.createDirectConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const conversation = await conversationService.createDirectConversation(
      req.user.id,
      userId
    );
    res.status(201).json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// إنشاء محادثة جماعية
exports.createGroupConversation = async (req, res) => {
  try {
    const { title, participants, scope } = req.body;
    const conversation = await conversationService.createGroupConversation({
      title,
      participants,
      scope,
      createdBy: req.user.id,
    });
    res.status(201).json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// الحصول على محادثات المستخدم
exports.getMyConversations = async (req, res) => {
  try {
    const conversations = await conversationService.getUserConversations(req.user.id);
    
    // إضافة آخر رسالة لكل محادثة
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await messageRepository.getLastMessage(conv._id);
        return {
          ...conv,
          lastMessage: lastMessage?.content || null,
          lastMessageTime: lastMessage?.createdAt || conv.updatedAt,
        };
      })
    );

    res.json(conversationsWithLastMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// الحصول على محادثة واحدة
exports.getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await conversationService.getConversationById(id, req.user.id);
    res.json(conversation);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// الحصول على رسائل محادثة
exports.getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit, before } = req.query;
    
    const messages = await conversationService.getMessages(id, req.user.id, {
      limit: parseInt(limit) || 50,
      before,
    });

    // ترتيب الرسائل من الأقدم للأحدث
    messages.reverse();

    res.json({ messages });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// إرسال رسالة
exports.sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const message = await conversationService.sendMessage(
      id,
      req.user.id,
      content.trim()
    );

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// تحديث رسالة
exports.updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    
    const message = await conversationService.updateMessage(
      messageId,
      req.user.id,
      content
    );

    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// حذف رسالة
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    await conversationService.deleteMessage(messageId, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// أرشفة محادثة
exports.archiveConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await conversationService.archiveConversation(id, req.user.id);
    res.json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// إضافة عضو لمحادثة
exports.addParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const conversation = await conversationService.addParticipant(
      id,
      userId,
      req.user.id
    );
    res.json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// إزالة عضو من محادثة
exports.removeParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const conversation = await conversationService.removeParticipant(
      id,
      userId,
      req.user.id
    );
    res.json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
