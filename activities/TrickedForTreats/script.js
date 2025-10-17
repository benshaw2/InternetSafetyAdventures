const avatars = document.querySelectorAll('.avatar');
const startButton = document.getElementById('startButton');
let selectedAvatar = null;

avatars.forEach(avatar => {
  avatar.addEventListener('click', () => {
    avatars.forEach(a => a.classList.remove('selected'));
    avatar.classList.add('selected');
    selectedAvatar = avatar.dataset.avatar;
    startButton.disabled = false;
  });
});

startButton.addEventListener('click', () => {
  if (!selectedAvatar) return;
  // For now, go to a placeholder page (to be replaced by the question flow)
  window.location.href = 'game.html';
});

