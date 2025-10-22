document.addEventListener("DOMContentLoaded", () => {
  // Retrieve stored session data
  const trust = localStorage.getItem("trustLevel") || "72";
  const infoShared = localStorage.getItem("infoShared") || "2";
  const turns = localStorage.getItem("turnCount") || "12";
  const takeaway = localStorage.getItem("takeawayMessage") ||
    "Remember: online conversations can build false trust quickly. Always think twice before sharing anything personal.";

  // Update display
  document.getElementById("trustValue").textContent = `${trust}%`;
  document.getElementById("infoValue").textContent = `${infoShared} items`;
  document.getElementById("durationValue").textContent = `${turns} turns`;
  document.getElementById("takeawayText").textContent = takeaway;

  // Load and render chat history
  const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
  const historyContainer = document.getElementById("chatHistory");
  history.forEach((entry, i) => {
    const div = document.createElement("div");
    div.classList.add("log-entry");
    div.innerHTML = `
      <strong>${entry.role === "user" ? "🧑 You" : "🤖 Bot"}:</strong> ${entry.text}
      ${entry.classification ? `<br><em>Intent:</em> ${entry.classification.intent}, <em>Risk:</em> ${entry.classification.risk}, <em>Style:</em> ${entry.classification.style}` : ""}
      ${entry.strategy ? `<br><em>Strategy:</em> ${entry.strategy}, <em>Phase:</em> ${entry.phase}` : ""}
      ${entry.fallback !== undefined ? `<br><em>Fallback Level:</em> ${entry.fallback}` : ""}
    `;
    historyContainer.appendChild(div);
  });

  // Load and render goal log
  const goals = JSON.parse(localStorage.getItem("chatGoals") || "[]");
  const goalContainer = document.getElementById("goalLog");
  goals.forEach((goal, i) => {
    const div = document.createElement("div");
    div.classList.add("log-entry");
    div.innerHTML = `
      <strong>Turn ${i + 1}</strong><br>
      <em>Phase:</em> ${goal.phase}<br>
      <em>Strategy:</em> ${goal.strategy}<br>
      <em>Goal:</em> ${goal.goal}
    `;
    goalContainer.appendChild(div);
  });
});

function returnToFeed() {
  localStorage.removeItem("trustLevel");
  localStorage.removeItem("infoShared");
  localStorage.removeItem("turnCount");
  localStorage.removeItem("takeawayMessage");
  localStorage.removeItem("chatHistory");
  localStorage.removeItem("chatGoals");
  window.location.href = "feed.html";
}
