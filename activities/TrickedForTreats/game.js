// Game logic for Online Trick-or-Treat Challenge

const avatarDisplay = document.getElementById("avatarDisplay");
const candyCountDisplay = document.getElementById("candyCount");
const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const submitButton = document.getElementById("submitButton");
const nextButton = document.getElementById("nextButton");
const houseTitle = document.getElementById("houseTitle");
const quitButton = document.getElementById("quitButton");
const leaderboardList = document.getElementById("leaderboardList");

let candyCount = 0;
let houseNumber = 1;
let questionIndex = 0;
let playerAnsweredPersonal = false;
let playerAnsweredSensitive = false;

// Retrieve avatar from previous page
const avatar = new URLSearchParams(window.location.search).get("avatar") || "🎃 Pumpkinhead";
avatarDisplay.textContent = `Your Costume: ${avatar}`;

// Question sets by category
const questions = [
  { text: "Would you rather have a dog or a cat?", type: 1 },
  { text: "What’s your favorite type of candy?", type: 1 },
  { text: "What’s your favorite color?", type: 1 },
  { text: "What’s your mother’s maiden name?", type: 2 },
  { text: "What was the name of your first pet?", type: 2 },
  { text: "What’s your favorite teacher’s name?", type: 2 },
  { text: "What is your first name?", type: 3 },
  { text: "When is your birthday (month and day)?", type: 3 },
  { text: "How old are you?", type: 3 }
];

// Reward curve
const rewards = [10,10,10,15,15,15,20,20,20];

// Fake players
let fakePlayers = [
  { name: "CandyGhost", candy: 80 },
  { name: "Witchy", candy: 75 },
  { name: "SpookyKid", candy: 70 },
  { name: "PumpkinPal", candy: 65 },
  { name: "ToffeeTom", candy: 60 },
  { name: "BooBuddy", candy: 58 },
  { name: "MallowMonster", candy: 55 },
  { name: "ChocoBat", candy: 52 }
];

let player = { name: "You", candy: 0 };

// Periodic leaderboard drift
function updateFakePlayers() {
  fakePlayers.forEach(p => {
    if (Math.random() < 0.6) {
      p.candy += Math.floor(Math.random() * 3) + 1; // +1 to +3
    }
  });

  // Occasionally swap in a new fake name
  if (Math.random() < 0.2) {
    const newName = ["GhostyGal", "TricksterTim", "LolliLad", "SugarSue"][Math.floor(Math.random()*4)];
    fakePlayers[Math.floor(Math.random()*fakePlayers.length)] = { name: newName, candy: 50 + Math.floor(Math.random()*20) };
  }

  renderLeaderboard();
}
setInterval(updateFakePlayers, 5000 + Math.random() * 2000); // every 5–7s

function renderLeaderboard() {
  const combined = [...fakePlayers, player];
  combined.sort((a, b) => b.candy - a.candy);
  leaderboardList.innerHTML = "";
  combined.slice(0, 5).forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} — ${p.candy}`;
    if (p.name === "You") li.classList.add("you");
    leaderboardList.appendChild(li);
  });
}

submitButton.addEventListener("click", () => {
  const answer = answerInput.value.trim();
  if (!answer) return;

  // Mark if personal/sensitive answered
  if (questions[questionIndex].type === 2) playerAnsweredPersonal = true;
  if (questions[questionIndex].type === 3) playerAnsweredSensitive = true;

  // Reward player
  candyCount += rewards[questionIndex];
  player.candy = candyCount;
  candyCountDisplay.textContent = `🍬 Candy: ${candyCount}`;

  // Update leaderboard position
  renderLeaderboard();

  answerInput.disabled = true;
  //submitButton.style.display = "none";
  //nextButton.style.display = "inline-block";
  ////submitButton.disabled = true;
  // instead, move directly to the next question
  nextButton.click();
});

nextButton.addEventListener("click", () => {
  questionIndex++;
  houseNumber++;

  // End of game flow
  if (questionIndex >= questions.length) {
    window.location.href = "address.html";
    return;
  }

  // Update question
  const q = questions[questionIndex];
  houseTitle.textContent = `🏠 House #${houseNumber}`;
  questionText.textContent = q.text;
  answerInput.value = "";
  answerInput.disabled = false;
  submitButton.style.display = "inline-block";
  nextButton.style.display = "none";
});

quitButton.addEventListener("click", () => {
  if (playerAnsweredPersonal || playerAnsweredSensitive) {
    window.location.href = "redirect.html";
  } else {
    window.location.href = "quit.html";
  }
});

// Initialize leaderboard
renderLeaderboard();

