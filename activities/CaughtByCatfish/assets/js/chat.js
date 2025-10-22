// chat.js
// Handles user input, message rendering, and communication with ChatManager

//import ChatManager from './ChatManager.js';

const chatLog = document.getElementById("chatMessages") //('chat-log');
const chatInput = document.getElementById("chatInput"); //('chat-input');
const sendButton = document.getElementById("chatSend"); //('send-button');

// Instantiate the ChatManager (core conversation logic)
const chatManager = new ChatManager();

/* ===============================
   Message Rendering
================================ */
function addMessage(text, sender = 'user') {
  const msgContainer = document.createElement('div');
  msgContainer.classList.add('message', sender);

  const msgBubble = document.createElement('div');
  msgBubble.classList.add('bubble');
  msgBubble.textContent = text;

  msgContainer.appendChild(msgBubble);
  chatLog.appendChild(msgContainer);

  // Auto-scroll to bottom
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Expose for feed.js compatibility
window.appendCatfisherMessage = function(text) {
  addMessage(text, 'bot');
};

window.appendUserMessage = function(text) {
  addMessage(text, 'user');
};

window.sendMessageToCatfisher = async function(userText, callback) {
  const reply = await chatManager.processInput(userText);
  callback(reply);
};

/* ===============================
   Input Handling
================================ */
async function handleSend() {
  const text = chatInput.value.trim();
  if (!text) return;

  // Display user message
  addMessage(text, 'user');
  chatInput.value = '';
  chatInput.focus();

  // Get AI/Simulated Response
  addTypingIndicator();
  try {
    const reply = await chatManager.processInput(text);
    removeTypingIndicator();
    addMessage(reply, 'bot');
  } catch (err) {
    removeTypingIndicator();
    console.error('Chat processing error:', err);
    addMessage('Something went wrong — please try again.', 'bot');
  }
}

/* ===============================
   Typing Indicator (Optional)
================================ */
function addTypingIndicator() {
  const typing = document.createElement('div');
  typing.id = 'typing-indicator';
  typing.classList.add('message', 'bot');

  const bubble = document.createElement('div');
  bubble.classList.add('bubble', 'typing');
  bubble.innerHTML = '<span></span><span></span><span></span>';

  typing.appendChild(bubble);
  chatLog.appendChild(typing);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

/* ===============================
   Event Listeners
================================ */
sendButton.addEventListener('click', handleSend);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

/* ===============================
   Optional Phase Display
================================ */
chatManager.onPhaseChange = (newPhase) => {
  console.log(`🎯 Conversation phase changed → ${newPhase}`);
  // You could update a phase indicator in the UI here
};

// Initial greeting (optional)
window.addEventListener('DOMContentLoaded', async () => {
  const greeting = await chatManager.getInitialMessage();
  if (greeting) addMessage(greeting, 'bot');
});

