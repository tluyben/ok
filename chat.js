class ChatInterface {
  constructor() {
    this.isOpen = false;
    this.isFullscreen = false;
    this.initialize();
  }

  initialize() {
    // Create chat button
    const chatButton = document.createElement('button');
    chatButton.className = 'chat-button';
    chatButton.innerHTML = '💬';
    chatButton.onclick = () => this.toggleChat();
    document.body.appendChild(chatButton);

    // Create chat container
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    chatContainer.innerHTML = `
      <div class="chat-header">
        <h3 class="chat-title">Chat Assistant</h3>
        <div class="chat-controls">
          <button class="control-button fullscreen-toggle">⛶</button>
          <button class="control-button close-chat">×</button>
        </div>
      </div>
      <div class="chat-messages">
        <div class="message bot">
          <div class="message-avatar">🤖</div>
          <div class="message-content">Hello! How can I help you today?</div>
        </div>
        <div class="message user">
          <div class="message-avatar">👤</div>
          <div class="message-content">Hi! I have a question about programming.</div>
        </div>
        <div class="message bot">
          <div class="message-avatar">🤖</div>
          <div class="message-content">Of course! I'd be happy to help. What would you like to know?</div>
        </div>
      </div>
      <div class="chat-input">
        <input type="text" placeholder="Type your message...">
        <button>Send</button>
      </div>
    `;
    document.body.appendChild(chatContainer);

    // Add event listeners
    chatContainer.querySelector('.close-chat').onclick = () => this.toggleChat();
    chatContainer.querySelector('.fullscreen-toggle').onclick = () => this.toggleFullscreen();
    
    const input = chatContainer.querySelector('input');
    const sendButton = chatContainer.querySelector('.chat-input button');
    
    const sendMessage = () => {
      const message = input.value.trim();
      if (message) {
        this.addMessage(message, true);
        input.value = '';
      }
    };

    sendButton.onclick = sendMessage;
    input.onkeypress = (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    };

    this.chatContainer = chatContainer;
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.chatContainer.classList.toggle('active', this.isOpen);
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    this.chatContainer.classList.toggle('fullscreen', this.isFullscreen);
    const fullscreenButton = this.chatContainer.querySelector('.fullscreen-toggle');
    fullscreenButton.innerHTML = this.isFullscreen ? '⛶' : '⛶';
  }

  addMessage(content, isUser = false) {
    const messagesContainer = this.chatContainer.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = `
      <div class="message-avatar">${isUser ? '👤' : '🤖'}</div>
      <div class="message-content">${content}</div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (isUser) {
      // Simulate bot response
      setTimeout(() => {
        this.addMessage('I understand your message. How else can I assist you?', false);
      }, 1000);
    }
  }
}

// Initialize chat interface when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new ChatInterface();
});
