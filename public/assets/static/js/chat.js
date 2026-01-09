/**
 * Chat Socket.io Client
 * Handles real-time messaging functionality
 */

class ChatClient {
  constructor(userId, userName) {
    this.userId = userId;
    this.userName = userName;
    this.socket = null;
    this.currentConversationId = null;
    this.onMessageCallback = null;
    this.onTypingCallback = null;
  }

  connect(token) {
    this.socket = io({
      auth: {
        token: token
      }
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to chat server');
    });

    this.socket.on('welcome', (data) => {
      console.log('Welcome:', data);
    });

    this.socket.on('new_message', (data) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(data);
      }
    });

    this.socket.on('message_updated', (data) => {
      // Handle message update
      console.log('Message updated:', data);
    });

    this.socket.on('message_deleted', (data) => {
      // Handle message deletion
      console.log('Message deleted:', data);
    });

    this.socket.on('conversation_updated', (data) => {
      // Handle conversation update
      console.log('Conversation updated:', data);
    });

    this.socket.on('user_typing', (data) => {
      if (this.onTypingCallback) {
        this.onTypingCallback(data);
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('disconnect', () => {
      console.log('🔴 Disconnected from chat server');
    });
  }

  joinConversation(conversationId) {
    if (this.socket) {
      this.currentConversationId = conversationId;
      this.socket.emit('join_conversation', { conversationId });
    }
  }

  leaveConversation(conversationId) {
    if (this.socket) {
      this.socket.emit('leave_conversation', { conversationId });
      this.currentConversationId = null;
    }
  }

  sendMessage(conversationId, content) {
    if (this.socket && content.trim()) {
      this.socket.emit('send_message', {
        conversationId,
        content: content.trim()
      });
    }
  }

  updateMessage(messageId, conversationId, content) {
    if (this.socket) {
      this.socket.emit('update_message', {
        messageId,
        conversationId,
        content
      });
    }
  }

  deleteMessage(messageId, conversationId) {
    if (this.socket) {
      this.socket.emit('delete_message', {
        messageId,
        conversationId
      });
    }
  }

  sendTyping(conversationId, isTyping) {
    if (this.socket) {
      this.socket.emit('typing', {
        conversationId,
        isTyping
      });
    }
  }

  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  onTyping(callback) {
    this.onTypingCallback = callback;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChatClient;
}
