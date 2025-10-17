// takeaway.js — reusable lesson navigation

document.getElementById('homeButton').addEventListener('click', () => {
  window.location.href = 'index.html';
});

document.getElementById('replayButton').addEventListener('click', () => {
  // Assumes this lesson followed game.html — easy to adapt for other activities.
  window.location.href = 'game.html';
});

