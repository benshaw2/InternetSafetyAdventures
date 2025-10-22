/**
 * chat.js
 *
 * Handles the catfisher simulation for the online chat activity.
 * Integrates with feed.js's sendButton/userInput and chatMessages div.
 */

let model; // USE model
let prototypes = {};
let responseBank = {};

// Chat state
let trustLevel = 0;
let infoShared = new Set();
let meetingSuggested = false;
let turnCount = 0;

// Keyword detection
const personalInfoKeywords = [
  "school", "class", "grade", "city", "town", "address", "phone", "number",
  "snap", "snapchat", "instagram", "tiktok", "discord", "house", "where", "live"
];
const meetingKeywords = [
  "meet", "hang", "call", "come over", "see you", "in person", "video chat", "park", "mall"
];

// DOM elements
const chatMessages = document.getElementById("chatMessages");
const chatContainer = document.getElementById("chatContainer");
const endingOverlay = document.getElementById("endingOverlay");

/**
 * Initialize USE model and data
 */
async function initializeChatModel() {
  //appendSystemMessage("Loading model and data…");

  try {
    model = await use.load({ modelUrl: "assets/models/use_model/model.json" });

    const [protoRes, bankRes] = await Promise.all([
      fetch("assets/data/catfisher_prototypes.json"),
      fetch("assets/data/catfisher_responses.json")
    ]);
    prototypes = await protoRes.json();
    responseBank = await bankRes.json();

    //appendSystemMessage("Model and data loaded. You can start chatting!");
  } catch (err) {
    //console.error("Error loading model/data:", err);
    //appendSystemMessage("Error loading model or data. Check console.");
  }
}

// Call this immediately to preload
initializeChatModel();

/**
 * Send a message to the catfisher simulation.
 * This is called from feed.js when the user sends a message.
 * Returns a Promise that resolves to the catfisher's reply.
 */
async function sendMessageToCatfisher(userText, callback) {
  turnCount++;

  // Check for personal info
  personalInfoKeywords.forEach(k => {
    if (userText.toLowerCase().includes(k)) infoShared.add(k);
  });

  // Check for meeting intent
  meetingKeywords.forEach(k => {
    if (userText.toLowerCase().includes(k)) meetingSuggested = true;
  });

  // Adjust trust level heuristically
  if (userText.length > 20) trustLevel++;
  if (userText.match(/(ok|sure|yes|yeah|cool|lol)/i)) trustLevel++;
  if (trustLevel > 10) trustLevel = 10;

  // Generate catfisher response
  const reply = await generateCatfisherReply(userText);
  callback(reply);

  // Check end conditions
  checkChatEndConditions();
}

/**
 * Generate a catfisher reply using USE embeddings and response bank
 */
async function generateCatfisherReply(childMessage) {
  if (!model || !Object.keys(prototypes).length) {
    return "Sorry, I’m still loading…";
  }

  // Embed child message
  const embedding = await model.embed([childMessage]);
  const childVec = (await embedding.array())[0];
  embedding.dispose();

  // Find closest intent
  let bestIntent = null;
  let bestSim = -Infinity;
  for (const [intent, data] of Object.entries(prototypes)) {
    const sim = cosineSimilarity(childVec, data.centroid);
    if (sim > bestSim) {
      bestSim = sim;
      bestIntent = intent;
    }
  }
  
  //console.log("Best intent:", bestIntent, "Similarity:", bestSim.toFixed(3));

  const responses = responseBank[bestIntent] || ["..."];
  //// Random selection (can be improved with embedding matching later)
  //return responses[Math.floor(Math.random() * responses.length)];
  //console.log("Best intent:", bestIntent, "Similarity:", bestSim);
  let bestResponse = "...";
  let bestResponseSim = -Infinity;
  
  for (const resp of responses) {
    const respEmbedding = await model.embed([resp]);
    const respVec = await respEmbedding.array();
    respEmbedding.dispose();
    
    //const sim = cosineSimilarity(inputVec[0], respVec[0]);
    //console.log(respVec[0]);
    const sim = cosineSimilarity(childVec, respVec[0]);
    if (sim > bestResponseSim) {
      bestResponseSim = sim;
      bestResponse = resp;
    }
  }
  //console.log(Selected reply: "${bestResponse}" (response sim: ${bestResponseSim.toFixed(3)}));
  
  return bestResponse;
}

/**
 * Cosine similarity helper
 */
function cosineSimilarity(a, b) {
  // Normalize vectors
  const norm = v => {
    const len = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    return v.map(x => x / (len || 1));
  };
  const aNorm = norm(a);
  const bNorm = norm(b);

  let dot = 0;
  for (let i = 0; i < aNorm.length; i++) dot += aNorm[i] * bNorm[i];
  return dot;
}


/**
 * Append messages to the chatMessages div
 */
function appendUserMessage(msg) {
  appendMessage("user", msg);
}
function appendCatfisherMessage(msg) {
  appendMessage("catfisher", msg);
}
function appendSystemMessage(msg) {
  appendMessage("system", msg);
}

function appendMessage(sender, text) {
  // --- Get profile ---
  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");

  // --- Prepare replacements ---
  const replacements = {
    "{username}": profile.username || "you",
    "{location}": profile.location || "your area",
    "{state}": profile.state || "",
    "{birthday}": profile.birthday || "",
    "{genderedCompliment}": (() => {
      // Generate a gendered compliment
      switch ((profile.gender || "").toLowerCase()) {
        case "male": return "handsome";
        case "female": return "beautiful";
        case "non-binary": return "amazing";
        default: return "awesome";
      }
    })(),
    "{childName}": profile.childName || "your child",
    "{hobby}": (() => {
      if (profile.interests && profile.interests.length > 0) {
        // pick a random interest
        const idx = Math.floor(Math.random() * profile.interests.length);
        return profile.interests[idx];
      }
      return "something fun";
    })()
  };

  // --- Replace all placeholders ---
  let renderedText = text;
  for (const key in replacements) {
    renderedText = renderedText.replaceAll(key, replacements[key]);
  }

  // --- Create and append the message ---
  const div = document.createElement("div");
  div.classList.add("chat-message", `${sender}-message`);
  div.textContent = renderedText;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}




/**
 * Check end-of-chat conditions
 */
function checkChatEndConditions() {
  if (meetingSuggested) {
    showGotcha("meeting");
    return;
  }
  if (infoShared.size > 1) {
    showGotcha("info");
    return;
  }
  if (turnCount >= 12) {
    showGotcha("timeout");
    return;
  }
}

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
  //endingOverlay.classList.add("visible");
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
      <!-- <button onclick="restartChat()">Try Again</button> -->
    </div>
  `;
  
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

  // Only trigger 'good job' for catfisher
  if (currentChatUser === catfisherName) {
    if (trustLevel < 4 && infoShared.size === 0) {
      showGoodJob();
    } else {
      showGotcha("exit");
    }
  }

  // Close the chat UI
  const chatContainer = document.getElementById("chatContainer");
  chatContainer.classList.add("hidden");
  chatContainer.classList.remove("active");
});


