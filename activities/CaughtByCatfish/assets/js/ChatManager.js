// ChatManager.js
// Enhanced conversation controller for CaughtByCatfish

//import { classifyInput } from "./classifier.js";
//import { chooseResponse, loadResponseMatrix } from "./responseUtils.js";

//const classifyInput = window.classifyInput;
//const chooseResponse = window.chooseResponse;
//const loadResponseMatrix = window.loadResponseMatrix;

//export default class ChatManager {
class ChatManager {
  constructor() {
    this.phase = "Access and Engagement";
    this.strategy = "Friendly Banter / Casual Chat";
    this.responses = loadResponseMatrix();
    this.history = [];
    this.goals = [];
    this.recentIntents = [];
    this.recentRisks = [];
    this.onPhaseChange = null;
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

    // Log user message with metadata
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

    // Choose response
    const { variant: reply, fallbackLevel } = chooseResponse(
      this.strategy,
      this.phase,
      style,
      this.responses,
      true // enable fallback tracking
    );

    // Log bot response
    this.history.push({
      role: "bot",
      text: reply,
      strategy: this.strategy,
      phase: this.phase,
      fallback: fallbackLevel,
      timestamp: Date.now()
    });

    // Track goal
    this.goals.push({
      phase: this.phase,
      strategy: this.strategy,
      goal: this.inferGoal(this.strategy)
    });

    return reply;
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
