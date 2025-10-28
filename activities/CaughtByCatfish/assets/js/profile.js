// ---- Helper: validate password ----
function validatePassword(password) {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return password.length >= 8 && hasUpper && hasLower && hasNumber;
}

// ---- Avatar selection ----
document.querySelectorAll('.avatar').forEach(img => {
  img.addEventListener('click', () => {
    document.querySelectorAll('.avatar').forEach(i => i.classList.remove('selected'));
    img.classList.add('selected');
  });
});

// ---- Photo upload preview ----
const photoUpload = document.getElementById('photoUpload');
const photoPreviewContainer = document.createElement('img');
photoPreviewContainer.className = 'upload-preview';
photoUpload.parentElement.appendChild(photoPreviewContainer);

let uploadedPhotoDataUrl = null;

photoUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    uploadedPhotoDataUrl = evt.target.result;
    photoPreviewContainer.src = uploadedPhotoDataUrl;
  };
  reader.readAsDataURL(file);

  // Remove avatar selection if uploading photo
  document.querySelectorAll('.avatar').forEach(i => i.classList.remove('selected'));
});

// ---- Form submission ----
const profileForm = document.getElementById('profileForm');
const errorMsg = document.getElementById('errorMsg');

profileForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const password = document.getElementById('password').value;
  if (!validatePassword(password)) {
    errorMsg.textContent = 'Password must be at least 8 characters long and include uppercase, lowercase, and a number.';
    return;
  }

  const selectedAvatar = document.querySelector('.avatar.selected');
  const hasPhoto = !!uploadedPhotoDataUrl;

  if (!hasPhoto && !selectedAvatar) {
    errorMsg.textContent = 'Please upload a photo or select an avatar.';
    return;
  }

  // Collect all profile fields
  const username = document.getElementById('username').value.trim();
  const about = document.getElementById('about').value.trim();
  const birthday = document.getElementById('birthday').value;
  const location = document.getElementById('location').value.trim();
  const state = document.getElementById('location-state')?.value.trim() || "";
  const gender = document.getElementById('gender')?.value || "";
  const childName = document.getElementById('childName')?.value.trim() || "";

  const interests = Array.from(document.querySelectorAll('.checkboxes input:checked'))
    .map(cb => cb.value);

  const avatarOrPhoto = hasPhoto ? uploadedPhotoDataUrl : selectedAvatar.src;

  const profile = {
    username,
    about,
    birthday,
    location,
    state,
    gender,
    childName,
    interests,
    selectedAvatar: avatarOrPhoto,
    photoDataUrl: uploadedPhotoDataUrl
  };

  localStorage.setItem('userProfile', JSON.stringify(profile));
  window.location.href = 'feed.html';
});
``

/*profileForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const password = document.getElementById('password').value;
  if (!validatePassword(password)) {
    errorMsg.textContent = 'Password must be at least 8 characters long and include uppercase, lowercase, and a number.';
    return;
  }

  // Collect all profile fields
  const username = document.getElementById('username').value.trim();
  const about = document.getElementById('about').value.trim();
  const birthday = document.getElementById('birthday').value;
  const location = document.getElementById('location').value.trim();
  const state = document.getElementById('location-state')?.value.trim() || "";
  const gender = document.getElementById('gender')?.value || "";
  const childName = document.getElementById('childName')?.value.trim() || "";

  // Interests
  const interests = Array.from(document.querySelectorAll('.checkboxes input:checked'))
    .map(cb => cb.value);

  // Determine avatar/photo
  const selectedAvatar = document.querySelector('.avatar.selected');
  const avatarOrPhoto = uploadedPhotoDataUrl || (selectedAvatar ? selectedAvatar.src : "assets/img/avatars/avatar1.svg");

  // Save profile to localStorage
  const profile = {
    username,
    about,
    birthday,
    location,
    state,
    gender,
    childName,
    interests,
    selectedAvatar: avatarOrPhoto,
    photoDataUrl: uploadedPhotoDataUrl
  };

  localStorage.setItem('userProfile', JSON.stringify(profile));

  // Redirect to feed
  window.location.href = 'feed.html';
});*/

