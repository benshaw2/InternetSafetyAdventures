// chat.js
// Handles user input, message rendering, and communication with ChatManager

//import ChatManager from './ChatManager.js';

const chatLog = document.getElementById("chatMessages") //('chat-log');
const chatInput = document.getElementById("chatInput"); //('chat-input');
const sendButton = document.getElementById("chatSend"); //('send-button');

// Instantiate the ChatManager (core conversation logic)
const chatManager = new ChatManager();
//await chatManager.init();

/* ===============================
   Message Rendering
================================ */
function addMessage(text, sender = 'user') {
  const msgContainer = document.createElement('div');
  msgContainer.classList.add('message', sender);
  
  if (sender === 'user') msgContainer.classList.add('user-message');
  else if (sender === 'bot') msgContainer.classList.add('catfisher-message');

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

//window.sendMessageToCatfisher = async function(userText, callback) {
//  const reply = await chatManager.processInput(userText);
//  callback(reply);
//};

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

  const currentChatUser = document.getElementById("chatUsername")?.textContent?.trim() || "";
  //console.log(currentChatUser);
  //console.log(catfisherName);

  if (currentChatUser === catfisherName) {
    // Only catfisher responds
    addTypingIndicator();
    try {
      const reply = await chatManager.processInput(text);
      //removeTypingIndicator();
      //addMessage(reply, 'bot');
      setTimeout(() => {
        removeTypingIndicator();
        addMessage(reply, 'bot');
      }, 3000);
    } catch (err) {
      removeTypingIndicator();
      console.error('Chat processing error:', err);
      addMessage('Something went wrong — please try again.', 'bot');
    }
  } else {
    // No typing indicator, no bot response
    //console.log(`No response: ${currentChatUser} is not the catfisher.`);
  }

  
  /*// Get AI/Simulated Response
  addTypingIndicator();
  try {
    const reply = await chatManager.processInput(text);
    removeTypingIndicator();
    addMessage(reply, 'bot');
  } catch (err) {
    removeTypingIndicator();
    console.error('Chat processing error:', err);
    addMessage('Something went wrong — please try again.', 'bot');
  }*/
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
//chatManager.onPhaseChange = (newPhase) => {
//  console.log(`🎯 Conversation phase changed → ${newPhase}`);
  // You could update a phase indicator in the UI here
//};

// Initial greeting (optional)
window.addEventListener('DOMContentLoaded', async () => {
  const greeting = await chatManager.getInitialMessage();
  if (greeting) addMessage(greeting, 'bot');
});


/**
 * Ending screens
 */
function showGoodJob() {
  chatContainer.classList.add("hidden");
  endingOverlay.classList.remove("hidden");
  //endingOverlay.classList.add("visible");
  requestAnimationFrame(() => endingOverlay.classList.add("visible"));
  
  endingOverlay.innerHTML = `
    <div class="ending-card goodjob">
      <h2>👏 Good Job!</h2>
      <p>You noticed something didn’t feel right and left before sharing too much. That’s exactly what you should do online.</p>
      <button onclick="restartChat()">Try Again</button>
    </div>
  `;
  
  // Auto-hide after 10 seconds (optional)
  //setTimeout(() => {
  //  endingOverlay.classList.remove("visible");
  //  setTimeout(() => endingOverlay.classList.add("hidden"), 500);
  //}, 10000);
  setTimeout(() => {
    window.location.href = "takeaway.html";
  }, 8000);
}

function showGotcha(reason) {
  chatContainer.classList.add("hidden");
  endingOverlay.classList.remove("hidden");
  requestAnimationFrame(() => endingOverlay.classList.add("visible"));

  let message = "";
  switch (reason) {
    case "info":
      message = "Oops — you shared some personal details with someone you don’t really know. That’s how strangers can build trust online.";
      break;
    case "meeting":
      message = "Yikes — you agreed to meet up with someone from the internet. That can be dangerous in real life. Always tell an adult first.";
      break;
    case "exit":
      message = "You left the chat, but not before sharing some risky info. Think about what you’d do differently next time.";
      break;
    case "timeout":
    default:
      message = "The chat went on for a while. Even friendly-seeming strangers can have bad intentions — stay cautious.";
  }

  endingOverlay.innerHTML = `
    <div class="ending-card gotcha">
      <h2>⚠️ Gotcha!</h2>
      <p>${message}</p>
    </div>
  `;

  // Save session data for takeaway screen
  localStorage.setItem("trustLevel", chatManager.trustLevel.toString());
  localStorage.setItem("infoShared", chatManager.infoShared.size.toString());
  localStorage.setItem("turnCount", chatManager.turnCount.toString());

  const takeawayMessage = chatManager.phase === "Risk Escalation"
    ? "This chat escalated quickly. Be cautious when someone online tries to isolate you or push boundaries."
    : "Remember: online conversations can build false trust quickly. Always think twice before sharing anything personal.";

  localStorage.setItem("takeawayMessage", takeawayMessage);
  localStorage.setItem("chatHistory", JSON.stringify(chatManager.getHistory()));
  localStorage.setItem("chatGoals", JSON.stringify(chatManager.getConversationGoals()));

  // Redirect to summary page after short delay
  setTimeout(() => {
    window.location.href = "takeaway.html";
  }, 8000);
}

function restartChat() {
  location.reload();
}

/**
 * Exit chat button logic
 */
document.getElementById("exitChat").addEventListener("click", () => {
  const currentChatUser = document.getElementById("chatUsername").textContent;
  const endingOverlay = document.getElementById("endingOverlay");
  
  const trustLevel = chatManager.trustLevel ?? 0;
  const infoShared = chatManager.infoShared ?? new Set();
  //const catfisherName = chatManager.catfisherName ?? "Unknown User";

  // Only trigger 'good job' for catfisher
  if (chatManager.infoShared.size === 0 && !chatManager.meetingSuggested) {
    if (currentChatUser === catfisherName) {
      showGoodJob();
    }
  } else {
    showGotcha("exit");
  }

  // Close the chat UI
  const chatContainer = document.getElementById("chatContainer");
  chatContainer.classList.add("hidden");
  chatContainer.classList.remove("active");
});

chatManager.onChatEnd = (reason) => {
  if (reason === "goodjob") showGoodJob();
  else showGotcha(reason);
};

