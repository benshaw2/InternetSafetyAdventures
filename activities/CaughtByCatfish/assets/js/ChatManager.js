// ChatManager.js
// Enhanced conversation controller for CaughtByCatfish

//import { classifyInput } from "./classifier.js";
//import { chooseResponse, loadResponseMatrix } from "./responseUtils.js";

//const classifyInput = window.classifyInput;
//const chooseResponse = window.chooseResponse;
//const loadResponseMatrix = window.loadResponseMatrix;

async function loadVagueResponses() {
  const response = await fetch("assets/data/vague_responses.json");
  if (!response.ok) throw new Error("Failed to load vague_responses.json");
  return await response.json();
}

async function loadAcknowledgementPhrases() {
  const response = await fetch("assets/data/acknowledgement_phrases.json");
  if (!response.ok) throw new Error("Failed to load acknowledgement_phrases.json");
  return await response.json();
}

async function loadResponseMatrix() {
  const response = await fetch("assets/data/augmented_response_matrix.json");
  if (!response.ok) throw new Error("Failed to load augmented_response_matrix.json");
  return await response.json();
}

//const loadVagueResponses = window.loadVagueResponses;
//const loadAcknowledgementPhrases = window.loadAcknowledgementPhrases;

//export default class ChatManager {
/*class ChatManager {
  constructor() {
    this.phase = "Access and Engagement";
    this.strategy = "Friendly Banter / Casual Chat";
    this.responses = null; //loadResponseMatrix();
    this.history = [];
    this.goals = [];
    this.recentIntents = [];
    this.recentRisks = [];
    this.onPhaseChange = null;
    this.trustLevel = 0;
    this.infoShared = new Set();
    this.catfisherName = null;
    this.meetingSuggested = false;
    this.turnCount = 0;
    this.onChatEnd = null;
  }
  
  //setCatfisherName(name) 
  
//  async init() {
//    this.responses = await loadResponseMatrix();
//  }

  async getInitialMessage() {
    const greeting = "Hey! I just saw your post — looks cool 😄";
    this.history.push({ role: "bot", text: greeting, timestamp: Date.now() });
    this.goals.push({
      phase: this.phase,
      strategy: this.strategy,
      goal: "Initiate casual engagement"
    });
    return greeting;
  }

  
async processInput(userText) {
  const timestamp = Date.now();
  const classification = await classifyInput(userText);
  const { intent, type, risk, style } = classification;

  // Update recent context
  this.recentIntents.push(intent);
  this.recentRisks.push(risk);
  if (this.recentIntents.length > 3) this.recentIntents.shift();
  if (this.recentRisks.length > 3) this.recentRisks.shift();

  // Keyword & trust tracking
  const textLower = userText.toLowerCase();
  const personalInfoKeywords = [
    "school", "class", "grade", "city", "town", "address", "phone", "number",
    "snap", "snapchat", "instagram", "tiktok", "discord", "house", "where", "live"
  ];
  for (const k of personalInfoKeywords) {
    if (textLower.includes(k)) this.infoShared.add(k);
  }

  const meetingKeywords = [
    "meet", "hang", "call", "come over", "see you", "in person", "video chat", "park", "mall"
  ];
  for (const k of meetingKeywords) {
    if (textLower.includes(k)) this.meetingSuggested = true;
  }

  if (userText.length > 20) this.trustLevel++;
  if (userText.match(/(ok|sure|yes|yeah|cool|lol)/i)) this.trustLevel++;
  if (this.trustLevel > 10) this.trustLevel = 10;

  // Log user message
  this.history.push({
    role: "user",
    text: userText,
    classification,
    timestamp
  });

  // Update phase and strategy
  const oldPhase = this.phase;
  this.updatePhase(intent, risk);
  this.updateStrategy(intent, risk);
  if (this.onPhaseChange && oldPhase !== this.phase) {
    this.onPhaseChange(this.phase);
  }

  // --- NEW: Modular response composition ---
  const vagueResponses = await loadVagueResponses();
  const acknowledgementPhrases = await loadAcknowledgementPhrases();
  //const responseMatrix = await this.responses;
  const responseMatrix = await loadResponseMatrix();

  const composer = new ResponseComposer(
    vagueResponses,
    acknowledgementPhrases,
    responseMatrix
  );

  const reply = composer.compose({
    intent, type, risk, style,
    phase: this.phase,
    strategy: this.strategy
  });

  // Log bot response
  this.history.push({
    role: "bot",
    text: reply,
    strategy: this.strategy,
    phase: this.phase,
    timestamp: Date.now()
  });

  // Track goal
  this.goals.push({
    phase: this.phase,
    strategy: this.strategy,
    goal: this.inferGoal(this.strategy)
  });

  this.turnCount = (this.turnCount || 0) + 1;
  this.checkChatEndConditions();
  
  console.log("Classification result:", classification);

  return reply;
}


  
  checkChatEndConditions() {
    if (this.meetingSuggested) {
      this.onChatEnd?.("meeting");
      return;
    }
    if (this.infoShared && this.infoShared.size > 1) {
      this.onChatEnd?.("info");
      return;
    }
    if ((this.turnCount || 0) >= 12) {
      this.onChatEnd?.("timeout");
      return;
    }
  }

  updatePhase(intent, risk) {
    const phaseOrder = [
      "Access and Engagement",
      "Trust Development",
      "Isolation and Secrecy",
      "Risk Escalation"
    ];
    const currentIndex = phaseOrder.indexOf(this.phase);
    let nextIndex = currentIndex;

    if (intent === "Emotional Disclosure" || intent === "Validation Seeking") {
      nextIndex = Math.max(nextIndex, 1);
    } else if (intent === "Personal Sharing" || risk === "Medium Risk") {
      nextIndex = Math.max(nextIndex, 2);
    } else if (intent === "Flirtation" || risk === "High Risk") {
      nextIndex = Math.max(nextIndex, 3);
    } else if (intent === "Suspicion") {
      nextIndex = Math.max(0, currentIndex - 1);
      this.strategy = "Deflection and Backpedaling";
    }

    this.phase = phaseOrder[nextIndex];
  }

  updateStrategy(intent, risk) {
    if (intent === "Information Seeking") {
      this.strategy = "Information Gathering";
    } else if (intent === "Emotional Disclosure" && risk === "Vulnerable") {
      this.strategy = "Emotional Bonding";
    } else if (intent === "Validation Seeking" || intent === "Flirtation") {
      this.strategy = "Flattery and Validation";
    } else if (intent === "Suspicion") {
      this.strategy = "Deflection and Backpedaling";
    } else if (risk === "High Risk") {
      this.strategy = "Boundary Testing";
    } else if (this.phase === "Isolation and Secrecy") {
      this.strategy = "Secrecy and Isolation";
    } else if (this.phase === "Risk Escalation") {
      this.strategy = "Emotional Manipulation";
    } else {
      this.strategy = "Friendly Banter / Casual Chat";
    }
  }

  inferGoal(strategy) {
    const goals = {
      "Friendly Banter / Casual Chat": "Build rapport through casual conversation",
      "Information Gathering": "Extract personal details subtly",
      "Emotional Bonding": "Create emotional dependency",
      "Flattery and Validation": "Boost trust and self-esteem",
      "Deflection and Backpedaling": "Avoid suspicion and regain control",
      "Boundary Testing": "Push limits of comfort and privacy",
      "Secrecy and Isolation": "Encourage secrecy and isolate from others",
      "Emotional Manipulation": "Exploit emotional vulnerability"
    };
    return goals[strategy] || "Unknown goal";
  }

  getConversationGoals() {
    return this.goals;
  }

  getHistory() {
    return this.history;
  }
}

window.ChatManager = ChatManager;

//window.loadVagueResponses = loadVagueResponses;
//window.loadAcknowledgementPhrases = loadAcknowledgementPhrases; */

class ChatManager {
  constructor() {
    this.phase = "Access and Engagement";
    this.strategy = "Friendly Banter / Casual Chat";
    this.responses = null;
    this.history = [];
    this.goals = [];
    this.recentIntents = [];
    this.recentRisks = [];
    this.intentHistory = [];
    this.riskHistory = [];
    this.onPhaseChange = null;
    this.trustLevel = 0;
    this.infoShared = new Set();
    this.catfisherName = null;
    this.meetingSuggested = false;
    this.turnCount = 0;
    this.onChatEnd = null;
  }

  async getInitialMessage() {
    const greeting = "Hey! I just saw your post — looks cool 😄";
    this.history.push({ role: "bot", text: greeting, timestamp: Date.now() });
    this.goals.push({
      phase: this.phase,
      strategy: this.strategy,
      goal: "Initiate casual engagement"
    });
    return greeting;
  }

  async processInput(userText) {
    const timestamp = Date.now();
    const classification = await classifyInput(userText);
    const { intent, type, risk, style } = classification;

    // Update recent context
    this.recentIntents.push(intent);
    this.recentRisks.push(risk);
    if (this.recentIntents.length > 3) this.recentIntents.shift();
    if (this.recentRisks.length > 3) this.recentRisks.shift();

    // Update cumulative histories with timestamps
    this.intentHistory.push({ label: intent, time: timestamp });
    this.riskHistory.push({ label: risk, time: timestamp });

    // Keyword & trust tracking
    const textLower = userText.toLowerCase();
    const personalInfoKeywords = [
      "school", "class", "grade", "city", "town", "address", "phone", "number",
      "snap", "snapchat", "instagram", "tiktok", "discord", "house", "where", "live"
    ];
    for (const k of personalInfoKeywords) {
      if (textLower.includes(k)) this.infoShared.add(k);
    }

    const meetingKeywords = [
      "meet", "hang", "call", "come over", "see you", "in person", "video chat", "park", "mall"
    ];
    for (const k of meetingKeywords) {
      if (textLower.includes(k)) this.meetingSuggested = true;
    }

    if (userText.length > 20) this.trustLevel++;
    if (userText.match(/(ok|sure|yes|yeah|cool|lol)/i)) this.trustLevel++;
    if (this.trustLevel > 10) this.trustLevel = 10;

    // Log user message
    this.history.push({
      role: "user",
      text: userText,
      classification,
      timestamp
    });

    // Update phase and strategy
    const oldPhase = this.phase;
    this.updatePhase();
    this.updateStrategy(intent, risk);
    if (this.onPhaseChange && oldPhase !== this.phase) {
      this.onPhaseChange(this.phase);
    }

    // Modular response composition
    const vagueResponses = await loadVagueResponses();
    const acknowledgementPhrases = await loadAcknowledgementPhrases();
    const responseMatrix = await loadResponseMatrix();

    const composer = new ResponseComposer(
      vagueResponses,
      acknowledgementPhrases,
      responseMatrix
    );

    const reply = composer.compose({
      intent, type, risk, style,
      phase: this.phase,
      strategy: this.strategy
    });
    
    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");

    const context = {
      childName: profile.childName || "Friend",
      username: profile.username || "User123",
      location: profile.location || "your city",
      state: profile.state || "your state",
      gender: profile.gender || "they",
      interests: (profile.interests || []).join(", ") || "music, gaming",
      hobby: (profile.interests || [])[0] || "music",
      popularGame: "Dragon's Fury",
      popularApp: "TikTok"//,
      //catfisherName: this.catfisherName || "Alex",
      //trustLevel: this.trustLevel.toString(),
      //phase: this.phase,
      //strategy: this.strategy
    };
    
    function replacePlaceholders(text, context) {
      return text.replace(/\{(\w+)\}/g, (_, key) => context[key] || "");
    }

    const finalReply = replacePlaceholders(reply, context);

    // Log bot response
    this.history.push({
      role: "bot",
      text: reply,
      strategy: this.strategy,
      phase: this.phase,
      timestamp: Date.now()
    });

    // Track goal
    this.goals.push({
      phase: this.phase,
      strategy: this.strategy,
      goal: this.inferGoal(this.strategy)
    });

    this.turnCount = (this.turnCount || 0) + 1;
    this.checkChatEndConditions();

    //console.log("Classification result:", classification);
    return finalReply; //reply;
  }

  checkChatEndConditions() {
    if (this.meetingSuggested) {
      this.onChatEnd?.("meeting");
      return;
    }
    if (this.infoShared && this.infoShared.size > 1) {
      this.onChatEnd?.("info");
      return;
    }
    if ((this.turnCount || 0) >= 12) {
      this.onChatEnd?.("timeout");
      return;
    }
  }

  getWeightedLabel(history, decayRate = 0.001) {
    const now = Date.now();
    const scores = {};
    for (const { label, time } of history) {
      const age = now - time;
      const weight = Math.exp(-decayRate * age);
      scores[label] = (scores[label] || 0) + weight;
    }
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";
  }

updatePhase() {
  const intent = this.getWeightedLabel(this.intentHistory);
  const risk = this.getWeightedLabel(this.riskHistory);

  const phaseOrder = [
    "Access and Engagement",
    "Trust Development",
    "Isolation and Secrecy",
    "Risk Escalation"
  ];
  const currentIndex = phaseOrder.indexOf(this.phase);
  let targetIndex = currentIndex;

  // Determine target phase based on intent/risk
  if (intent === "Emotional Disclosure" || intent === "Validation Seeking") {
    targetIndex = 1;
  } else if (intent === "Personal Sharing" || risk === "Medium Risk") {
    targetIndex = 2;
  } else if (intent === "Flirtation" || risk === "High Risk") {
    targetIndex = 3;
  }

  // Cap escalation to +1
  const nextIndex = Math.min(currentIndex + 1, targetIndex);

  // Handle regression
  const regressiveIntents = ["Suspicion", "Disinterest", "Boundary Setting"];
  const riskDampeningLabels = ["Low Risk", "No Risk"];
  if (regressiveIntents.includes(intent) || riskDampeningLabels.includes(risk)) {
    this.phase = phaseOrder[Math.max(0, currentIndex - 1)];
    this.strategy = "Deflection and Backpedaling";
    return;
  }

  this.phase = phaseOrder[nextIndex];
}

  updateStrategy(intent, risk) {
    if (intent === "Information Seeking") {
      this.strategy = "Information Gathering";
    } else if (intent === "Emotional Disclosure" && risk === "Vulnerable") {
      this.strategy = "Emotional Bonding";
    } else if (intent === "Validation Seeking" || intent === "Flirtation") {
      this.strategy = "Flattery and Validation";
    } else if (intent === "Suspicion") {
      this.strategy = "Deflection and Backpedaling";
    } else if (risk === "High Risk") {
      this.strategy = "Boundary Testing";
    } else if (this.phase === "Isolation and Secrecy") {
      this.strategy = "Secrecy and Isolation";
    } else if (this.phase === "Risk Escalation") {
      this.strategy = "Emotional Manipulation";
    } else {
      this.strategy = "Friendly Banter / Casual Chat";
    }
  }

  inferGoal(strategy) {
    const goals = {
      "Friendly Banter / Casual Chat": "Build rapport through casual conversation",
      "Information Gathering": "Extract personal details subtly",
      "Emotional Bonding": "Create emotional dependency",
      "Flattery and Validation": "Boost trust and self-esteem",
      "Deflection and Backpedaling": "Avoid suspicion and regain control",
      "Boundary Testing": "Push limits of comfort and privacy",
      "Secrecy and Isolation": "Encourage secrecy and isolate from others",
      "Emotional Manipulation": "Exploit emotional vulnerability"
    };
    return goals[strategy] || "Unknown goal";
  }

  getConversationGoals() {
    return this.goals;
  }

  getHistory() {
    return this.history;
  }
}

window.ChatManager = ChatManager;
