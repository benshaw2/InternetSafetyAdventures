// redirect.js — transitional "Gotcha!" logic

// Wait a few seconds before transitioning to the lesson page
setTimeout(() => {
  // Add fade-out effect
  document.body.classList.add('fade-out');

  // Redirect after fade completes (match CSS duration: 1.2s)
  setTimeout(() => {
    window.location.href = 'takeaway.html';
  }, 1200);
}, 4500); // Wait ~4.5 seconds before starting fade

