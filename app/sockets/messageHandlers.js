const conversationService = require('../services/conversationService');
const conversationRepository = require('../repositories/conversationRepository');

// معالج إرسال الرسائل عبر Socket.io
async function handleSendMessage(socket, io, data) {
  try {
    const { conversationId, content } = data;
    const senderId = socket.user.id;

    if (!content || !content.trim()) {
      return socket.emit('error', { message: 'Message content is required' });
    }

    // إرسال الرسالة
    const message = await conversationService.sendMessage(
      conversationId,
      senderId,
      content.trim()
    );

    // تحديث آخر نشاط للمحادثة
    await conversationRepository.updateLastActivity(conversationId);

    // الحصول على معلومات المحادثة
    const conversation = await conversationService.getConversationById(
      conversationId,
      senderId
    );

    // إرسال الرسالة لجميع المشاركين في المحادثة
    conversation.participants.forEach((participant) => {
      io.to(participant.userId).emit('new_message', {
        conversationId,
        message: {
          _id: message._id,
          senderId: message.senderId,
          senderName: socket.user.name,
          content: message.content,
          createdAt: message.createdAt,
        },
      });
    });

    // إشعار المستخدمين بأن المحادثة محدثة
    conversation.participants.forEach((participant) => {
      if (participant.userId !== senderId) {
        io.to(participant.userId).emit('conversation_updated', {
          conversationId,
          lastMessage: content,
          lastMessageTime: new Date(),
        });
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    socket.emit('error', { message: error.message });
  }
}

// معالج تحديث الرسالة
async function handleUpdateMessage(socket, io, data) {
  try {
    const { messageId, conversationId, content } = data;
    const userId = socket.user.id;

    const message = await conversationService.updateMessage(
      messageId,
      userId,
      content
    );

    // الحصول على معلومات المحادثة
    const conversation = await conversationService.getConversationById(
      conversationId,
      userId
    );

    // إرسال التحديث لجميع المشاركين
    conversation.participants.forEach((participant) => {
      io.to(participant.userId).emit('message_updated', {
        conversationId,
        messageId,
        content: message.content,
        editedAt: message.editedAt,
      });
    });
  } catch (error) {
    console.error('Error updating message:', error);
    socket.emit('error', { message: error.message });
  }
}

// معالج حذف الرسالة
async function handleDeleteMessage(socket, io, data) {
  try {
    const { messageId, conversationId } = data;
    const userId = socket.user.id;

    await conversationService.deleteMessage(messageId, userId);

    // الحصول على معلومات المحادثة
    const conversation = await conversationService.getConversationById(
      conversationId,
      userId
    );

    // إرسال إشعار الحذف لجميع المشاركين
    conversation.participants.forEach((participant) => {
      io.to(participant.userId).emit('message_deleted', {
        conversationId,
        messageId,
      });
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    socket.emit('error', { message: error.message });
  }
}

// معالج الانضمام لمحادثة
async function handleJoinConversation(socket, conversationId) {
  try {
    const userId = socket.user.id;
    
    // التحقق من أن المستخدم مشارك في المحادثة
    const conversation = await conversationService.getConversationById(
      conversationId,
      userId
    );

    // الانضمام لغرفة المحادثة
    socket.join(`conversation:${conversationId}`);
    
    socket.emit('joined_conversation', { conversationId });
  } catch (error) {
    console.error('Error joining conversation:', error);
    socket.emit('error', { message: error.message });
  }
}

// معالج مغادرة محادثة
function handleLeaveConversation(socket, conversationId) {
  socket.leave(`conversation:${conversationId}`);
  socket.emit('left_conversation', { conversationId });
}

// معالج كتابة (typing indicator)
function handleTyping(socket, io, data) {
  const { conversationId, isTyping } = data;
  const userId = socket.user.id;

  // إرسال إشعار الكتابة لجميع المشاركين عدا المرسل
  socket.to(`conversation:${conversationId}`).emit('user_typing', {
    conversationId,
    userId,
    userName: socket.user.name,
    isTyping,
  });
}

module.exports = {
  handleSendMessage,
  handleUpdateMessage,
  handleDeleteMessage,
  handleJoinConversation,
  handleLeaveConversation,
  handleTyping,
};
