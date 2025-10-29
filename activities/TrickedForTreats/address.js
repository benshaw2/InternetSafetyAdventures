// address.js — handles fake candy claim

const form = document.getElementById('claim-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Prevent storing or sending data
  //const name = document.getElementById('playerName').value.trim();
  const address = document.getElementById('streetAddress').value.trim();

  // Simulate "processing" before redirect
  const processingDiv = document.createElement('div');
  processingDiv.className = 'processing';
  //processingDiv.innerHTML = `<p class="packing-text">🎁 Packing your candy, ${name || 'friend'}...</p>`;
  processingDiv.innerHTML = `<p class="packing-text">🎁 Packing your candy...</p>`;
  document.body.innerHTML = '';
  document.body.appendChild(processingDiv);

  setTimeout(() => {
    window.location.href = 'redirect.html';
  }, 3000);
});

