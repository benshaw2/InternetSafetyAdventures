// DOM elements
const landingButtons = document.getElementById('landing-buttons');
const loginForm = document.getElementById('login-form');
const accountRecovery = document.getElementById('account-recovery');

const createBtn = document.getElementById('createBtn');
const loginBtn = document.getElementById('loginBtn');
const backToLanding = document.getElementById('backToLanding');
const forgotLink = document.getElementById('forgotLink');
const backToLogin = document.getElementById('backToLogin');
const loginSubmit = document.getElementById('loginSubmit');
const recoverySubmit = document.getElementById('recoverySubmit');

// Navigation
createBtn.addEventListener('click', () => {
  window.location.href = 'profile.html';
});

loginBtn.addEventListener('click', () => {
  landingButtons.classList.add('hidden');
  loginForm.classList.remove('hidden');
});

backToLanding.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  landingButtons.classList.remove('hidden');
});

forgotLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  accountRecovery.classList.remove('hidden');
});

backToLogin.addEventListener('click', () => {
  accountRecovery.classList.add('hidden');
  loginForm.classList.remove('hidden');
});

// Login submit always fails (no existing profile)
loginSubmit.addEventListener('click', () => {
  alert("Invalid username/password. Please check your credentials or create a new profile.");
});

// Recovery submit: always shows the same message
recoverySubmit.addEventListener('click', () => {
  alert("If your email account is matched to a profile, we will send an email with instructions for recovering your account.");
});

