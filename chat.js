class ChatInterface {
  constructor() {
    this.isOpen = false;
    this.isFullscreen = false;
    this.chatButton = null;
    this.chatContainer = null;
    this.initialize();
  }

  initialize() {
    // Create chat button
    this.chatButton = document.createElement('button');
    this.chatButton.className = 'chat-button';
    this.chatButton.innerHTML = '💬';
    this.chatButton.onclick = () => this.toggleChat();
    this.chatButton.style.display = 'none'; // Hide by default until we verify API key
    document.body.appendChild(this.chatButton);

    // Create chat container
    this.chatContainer = document.createElement('div');
    this.chatContainer.className = 'chat-container';
    this.chatContainer.innerHTML = `
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
    document.body.appendChild(this.chatContainer);

    // Add event listeners
    this.chatContainer.querySelector('.close-chat').onclick = () => this.toggleChat();
    this.chatContainer.querySelector('.fullscreen-toggle').onclick = () => this.toggleFullscreen();
    
    const input = this.chatContainer.querySelector('input');
    const sendButton = this.chatContainer.querySelector('.chat-input button');
    
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

    // Check initial API key status
    this.checkApiKey();

    // Listen for settings changes
    document.addEventListener('change', (e) => {
      if (e.target.matches('input[name="api-provider"]') || 
          e.target.matches('#anthropicKey, #openaiKey, #openrouterKey')) {
        // Wait for settings to be saved
        setTimeout(() => this.checkApiKey(), 0);
      }
    });
  }

  checkApiKey() {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    const provider = settings.apiProvider || 'anthropic';
    const key = settings[`${provider}Key`];
    
    // Show/hide chat button based on key validity
    this.chatButton.style.display = key ? 'flex' : 'none';
    
    // If chat is open but key becomes invalid, close it
    if (!key && this.isOpen) {
      this.toggleChat();
    }
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
