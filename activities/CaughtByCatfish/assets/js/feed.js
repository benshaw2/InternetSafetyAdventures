document.addEventListener("DOMContentLoaded", () => {
  // === USER PROFILE SETUP ===
  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
  const displayUsername = document.getElementById("displayUsername");
  const displayAbout = document.getElementById("displayAbout");
  const userPic = document.getElementById("userPic");

  displayUsername.textContent = userProfile.username || "Guest";
  displayAbout.textContent = userProfile.about || "Welcome to FriendNet!";
  if (userProfile.photoDataUrl) userPic.src = userProfile.photoDataUrl;
  else if (userProfile.selectedAvatar) userPic.src = userProfile.selectedAvatar;

  // === POST CREATION MODAL ===
  const newPostBtn = document.getElementById("newPostBtn");
  const newPostModal = document.getElementById("newPostModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const newPostForm = document.getElementById("newPostForm");
  const cancelPost = document.getElementById("cancelPost");
  const postText = document.getElementById("postText");
  const postImageInput = document.getElementById("postImage");
  const postsContainer = document.getElementById("postsContainer");

  function openModal() {
    newPostModal.classList.remove("hidden");
    modalBackdrop.classList.remove("hidden");
  }
  function closeModal() {
    newPostModal.classList.add("hidden");
    modalBackdrop.classList.add("hidden");
    postText.value = "";
    postImageInput.value = "";
  }

  newPostBtn.addEventListener("click", openModal);
  cancelPost.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);

  // === POST CREATION ===
  function formatPostText(text) {
    return text
      .replace(/(^|\s)(#[A-Za-z0-9_]+)/g, "$1<strong>$2</strong>")
      .replace(/(^|\s)(@[A-Za-z0-9_]+)/g, "$1<strong>$2</strong>");
  }

function createPost(username, contentHtml, imageDataUrl) {
  const article = document.createElement("article");
  article.className = "post fade-in";

  // --- Post Header (Clickable Username) ---
  const header = document.createElement("h4");
  header.innerText = username.startsWith("@") ? username : "@" + username;
  header.style.cursor = "pointer";
  header.style.color = "#1877f2";

  header.addEventListener("click", () => {
    const clickedUser = header.innerText.replace(/^@/, ""); // remove @ for consistency
    openChat(clickedUser); // pass username
    if (clickedUser !== catfisherName) {
      catfisherAvatar.src = "assets/img/avatars/avatar1.svg"; // generic avatar
    }
  });


  article.appendChild(header);

  // --- Post Text ---
  const para = document.createElement("p");
  para.innerHTML = contentHtml;
  article.appendChild(para);

  // --- Post Image ---
  if (imageDataUrl) {
    const container = document.createElement("div");
    container.className = "post-image-container";

    const img = document.createElement("img");
    img.src = imageDataUrl;
    img.alt = "User posted image";
    img.className = "post-image";
    container.appendChild(img);

    const overlay = document.createElement("div");
    overlay.className = "post-image-overlay";
    container.appendChild(overlay);

    article.appendChild(container);
  }

  // --- Interaction Bar ---
  createInteractionBar(article, username, contentHtml);
  postsContainer.insertBefore(article, postsContainer.firstChild);

  // --- Initialize Comments ---
  initializePostComments(article, username, contentHtml);

  // --- Initialize Heart Count ---
  if (!article.dataset.heartCount) article.dataset.heartCount = "0";
}


  // === CATFISHER LOGIC ===
  const catfisherNames = {
    music: "JamSession",
    gaming: "ProPlayer77",
    sports: "FitFan23",
    reading: "BookBuddy",
    art: "SketchPal",
    science: "CoolChemGuy",
    default: "CoolStreamer42",
  };
  function getCatfisherName(profile) {
    if (!profile || !profile.interests) return catfisherNames.default;
    let interests = profile.interests;
    if (typeof interests === "string") interests = interests.split(/[,;]\s*|\s+/).filter(Boolean);
    if (Array.isArray(interests) && interests.length) {
      const key = interests[0].toLowerCase();
      return catfisherNames[key] || catfisherNames.default;
    }
    return catfisherNames.default;
  }
  const catfisherName = getCatfisherName(userProfile);
  window.catfisherName = catfisherName;

  // === INTERACTION BAR ===
  function createInteractionBar(article, username, textContent) {
    const interactionBar = document.createElement("div");
    interactionBar.className = "interaction-bar";

    // Heart
    const heartBtn = document.createElement("button");
    heartBtn.className = "heart-btn";
    heartBtn.innerHTML = "❤️ <span class='heart-count'>0</span>";
    heartBtn.addEventListener("click", () => {
      const countEl = heartBtn.querySelector(".heart-count");
      countEl.textContent = parseInt(countEl.textContent) + 1;
      heartBtn.classList.add("popped");
      setTimeout(() => heartBtn.classList.remove("popped"), 300);
    });

    // Load comments
    const loadBtn = document.createElement("button");
    loadBtn.textContent = "💬 Load comments";
    loadBtn.className = "load-comments-btn";
    loadBtn.addEventListener("click", () => toggleComments(article));

    // Child comment
    const commentBtn = document.createElement("button");
    commentBtn.textContent = "➕ Comment";
    commentBtn.className = "comment-btn";
    commentBtn.addEventListener("click", () => promptChildComment(article));

    interactionBar.appendChild(heartBtn);
    interactionBar.appendChild(loadBtn);
    interactionBar.appendChild(commentBtn);
    article.appendChild(interactionBar);
  }

  // === COMMENTS & ACCUMULATION ===
  const fakeUsernames = [
    "musicFan22", "artgirl", "outdoorAndy", "petlover", "sunsetChaser",
    "retroPlayer", "gameHero", "photoBabe", "techieTom", "curiousCat"
  ];

  function generateComments(username, textContent) {
    const randUser = () => fakeUsernames[Math.floor(Math.random() * fakeUsernames.length)];
    const comments = [];

    if (textContent.includes("new look") || textContent.includes("How do I look")) {
      const lines = [
        "You look amazing! ❤️",
        "Wow, stunning 😍",
        "🔥🔥🔥",
        "Beautiful smile!",
        "Cute outfit!",
        "You look so mature now 😉"
      ];
      return lines.map((t, idx) => {
        const user = idx === lines.length - 1 ? catfisherName : randUser();
        return { user, text: t };
      });
    }

    const generic = ["Nice!", "Love this 😄", "Cool post!", "Haha same!", "That’s awesome!", "👏👏👏"];
    const num = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < num; i++) comments.push({ user: randUser(), text: generic[i % generic.length] });
    return comments;
  }

  function initializePostComments(postEl, username, textContent) {
    if (!postEl.dataset.comments) {
      const comments = generateComments(username, textContent);
      postEl.dataset.comments = JSON.stringify([]); // start empty
      postEl.dataset.allComments = JSON.stringify(comments);

      // Teen posts appear faster
      const isTeenPost = textContent.includes("new look") || textContent.includes("How do I look");
      const baseDelay = isTeenPost ? 200 : 800;
      const randomDelay = isTeenPost ? 300 : 2000;

      scheduleNextComment(postEl, baseDelay, randomDelay);
    }
  }

  function scheduleNextComment(postEl, baseDelay = 800, randomDelay = 2000) {
    const allComments = JSON.parse(postEl.dataset.allComments || "[]");
    const accumulated = JSON.parse(postEl.dataset.comments || "[]");

    if (accumulated.length >= allComments.length) return;

    const nextComment = allComments[accumulated.length];
    const delay = baseDelay + Math.random() * randomDelay;

    setTimeout(() => {
      addCommentToPost(postEl, nextComment);
      scheduleNextComment(postEl, baseDelay, randomDelay);
    }, delay);
  }

  function addCommentToPost(postEl, commentObj) {
    const comments = JSON.parse(postEl.dataset.comments || "[]");
    comments.push(commentObj);
    postEl.dataset.comments = JSON.stringify(comments);
    // If comments are visible, immediately update the DOM
    const commentSection = postEl.querySelector(".comments");
    if (commentSection && commentSection.classList.contains("visible")) {
      const p = document.createElement("p");
      p.innerHTML = `<strong>@${commentObj.user}</strong> ${commentObj.text}`;
      commentSection.appendChild(p);
    }
  }

  function getOrCreateCommentSection(postEl) {
    let commentSection = postEl.querySelector(".comments");
    if (!commentSection) {
      commentSection = document.createElement("div");
      commentSection.className = "comments slide-up";
      postEl.appendChild(commentSection);
    }
    return commentSection;
  }

  function toggleComments(postEl) {
    const commentSection = getOrCreateCommentSection(postEl);
    if (commentSection.classList.contains("visible")) {
      commentSection.classList.remove("visible");
      commentSection.style.display = "none";
    } else {
      commentSection.innerHTML = "";
      const accumulated = JSON.parse(postEl.dataset.comments || "[]");
      accumulated.forEach(({ user, text }) => {
        const p = document.createElement("p");
        p.innerHTML = `<strong>@${user}</strong> ${text}`;
        commentSection.appendChild(p);
      });
      commentSection.classList.add("visible");
      commentSection.style.display = "block";
    }
  }

  function promptChildComment(postEl) {
    const commentText = prompt("Share your thoughts!"); // instead of "Write a comment:"
    if (!commentText) return;

    const commentObj = { user: userProfile.username || "You", text: commentText };

    // Add to dataset
    const comments = JSON.parse(postEl.dataset.comments || "[]");
    comments.push(commentObj);
    postEl.dataset.comments = JSON.stringify(comments);

    // Append to DOM if comments section visible
    const commentSection = postEl.querySelector(".comments");
    if (commentSection && commentSection.classList.contains("visible")) {
      const p = document.createElement("p");
      p.innerHTML = `<strong>@${commentObj.user}</strong> ${commentObj.text}`;
      commentSection.appendChild(p);
    }
  }


  // === FAKE POSTS ===
  const fakePosts = [
    { user: "@musicFan22", text: "Just discovered a new band that SLAPS 🎧", img: "assets/img/fake_posts/music1.png" },
    { user: "@gameHero", text: "Anyone up for a 1v1 later? 💥", img: "assets/img/fake_posts/game1.png" },
    { user: "@artgirl", text: "Finished a new digital sketch today! ✏️", img: "assets/img/fake_posts/art1.png" },
    { user: "@outdoorAndy", text: "Hiking this morning was awesome 🌄 #nature" },
    { user: "@foodieMike", text: "Found the best burger spot downtown 🍔", img: "assets/img/fake_posts/food1.png" },
    { user: "@techieTom", text: "Finally built my own PC! 🚀 #DIY #Gaming" },
    { user: "@sci_kid", text: "Made a volcano experiment explode (on purpose) 🔬" },
    { user: "@bookwormJess", text: "Just finished a mystery novel — chills. 📚" },
    { user: "@sportySam", text: "Team practice went hard today 🏀 #dedication" },
    { user: "@photogirl", text: "Caught this sunset last night 🌇", img: "assets/img/fake_posts/sunset1.png" },
    { user: "@petlover", text: "My cat literally thinks she owns the bed 🐱" },
    { user: "@codeNova", text: "Finally fixed that one line of code… after 3 hours 😂" },
  ];


  // === FAKE POSTS & RANDOM INSERTION ===
  const recentPosts = new Set();

  function addRandomPost() {
    if (!fakePosts.length) return;
    let post;
    let attempts = 0;
    do {
      post = fakePosts[Math.floor(Math.random() * fakePosts.length)];
      attempts++;
    } while (recentPosts.has(post.text) && attempts < 10);

    recentPosts.add(post.text);
    if (recentPosts.size > 10) recentPosts.delete([...recentPosts][0]);

    createPost(post.user, post.text, post.img);
  }

  // Insert a few random posts before the teen post
  for (let i = 0; i < 2; i++) addRandomPost();

  // --- TEEN GIRL SPECIAL POST ---
  const teenPost = {
    user: "@puppygirl12",
    text: "Trying a new look today... what do you think? 💕",
    img: "assets/img/fake_posts/selfie1.png"
  };

  // Create teen post immediately after initial posts
  //createPost(teenPost.user, teenPost.text, teenPost.img);
  setTimeout(createPost, 2000, teenPost.user, teenPost.text, teenPost.img);

  // Set interval for ongoing random posts
  setInterval(addRandomPost, 20000);

  // === DM TRIGGER & FIRST POST SPECIAL HANDLING ===
  let firstPostMade = false;
  function scheduleDMTrigger() {
    setTimeout(() => {
      const initLine = "Hey there! Saw your post — cool stuff!";
      showDMAlert(catfisherName, initLine);
    }, 6000 + Math.random() * 4000);
  }

  newPostForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = postText.value.trim();
    if (!text && !postImageInput.files.length) {
      alert("Please add text or an image to post.");
      return;
    }

    const createAndInsert = (imgData = null) => {
      createPost(userProfile.username || "Guest", formatPostText(text), imgData);

      const newestPost = postsContainer.querySelector(".post");
      if (newestPost && !firstPostMade) {
        firstPostMade = true;
        scheduleDMTrigger();

        // Give child post a catfisher heart + comment
        setTimeout(() => {
          const heartEl = newestPost.querySelector(".heart-count");
          if (heartEl) heartEl.textContent = parseInt(heartEl.textContent) + 1;
        }, 2000 + Math.random() * 3000);

        setTimeout(() => {
          const comment = { user: catfisherName, text: "Love this! 😄" };
          addCommentToPost(newestPost, comment);
        }, 3000 + Math.random() * 4000);
      }

      closeModal();
    };

    if (postImageInput.files.length) {
      const file = postImageInput.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => createAndInsert(evt.target.result);
      reader.readAsDataURL(file);
    } else createAndInsert(null);
  });

  // === HEART ACCUMULATION (all posts, randomized display) ===
  setInterval(() => {
    document.querySelectorAll(".post").forEach((post) => {
      const text = post.querySelector("p")?.textContent || "";
      const heartCountEl = post.querySelector(".heart-count");
      if (!heartCountEl) return;

      const delay = Math.random() * 500; // stagger updates per post
      setTimeout(() => {
        let current = parseInt(heartCountEl.textContent);
        if (text.includes("new look")) {
          if (current < 50) heartCountEl.textContent = current + Math.floor(Math.random() * 3);
        } else {
          const commentCount = JSON.parse(post.dataset.comments || "[]").length;
          const target = commentCount * 2;
          if (current < target) heartCountEl.textContent = current + 1;
        }
      }, delay);
    });
  }, 5000);

  // === DM / CHAT ===
  const chatContainer = document.getElementById("chatContainer");
  const chatSend = document.getElementById("chatSend");
  const chatInput = document.getElementById("chatInput");
  const dmAlert = document.getElementById("dmAlert");
  const dmAlertText = document.getElementById("dmAlertText");
  const openChatFromAlert = document.getElementById("openChatFromAlert");
  const chatUsernameEl = document.getElementById("chatUsername");
  const catfisherAvatar = document.getElementById("catfisherAvatar");
  const exitChat = document.getElementById("exitChat");

  if (chatUsernameEl) chatUsernameEl.textContent = catfisherName;
  const cfAvatarMap = {
    ProPlayer77: "assets/img/avatars/avatar2.svg",
    JamSession: "assets/img/avatars/avatar2.svg",
    FitFan23: "assets/img/avatars/avatar1.svg",
    BookBuddy: "assets/img/avatars/avatar1.svg",
    SketchPal: "assets/img/avatars/avatar2.svg",
    CoolChemGuy: "assets/img/avatars/avatar1.svg",
    CoolStreamer42: "assets/img/avatars/avatar2.svg",
  };
  if (catfisherAvatar) catfisherAvatar.src = cfAvatarMap[catfisherName] || "assets/img/avatars/avatar2.svg";

  function showDMAlert(senderName, initialText) {
    dmAlertText.textContent = `${senderName} sent you a message`;
    dmAlert.classList.remove("hidden");
    dmAlert.classList.add("visible");
    openChatFromAlert.onclick = () => {
      dmAlert.classList.remove("visible");
      dmAlert.classList.add("hidden");
      openChat(catfisherName, initialText);
      //openChat();
      //appendCatfisherMessage(initialText);
    };
  }

  let activeChatUser = null;

  function openChat(username, initialMessage = null) {
    if (activeChatUser && username !== catfisherName) {
      alert("Free subscribers can only have one active chat at a time.");
      return;
    }
    activeChatUser = username;

    chatContainer.classList.remove("hidden");
    chatContainer.classList.add("active");
    chatInput.focus();

    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML = "";

    if (initialMessage && username === catfisherName) {
      appendCatfisherMessage(initialMessage);
    }

    chatUsernameEl.textContent = username;
  }

  function closeChat() {
    chatContainer.classList.add("hidden");
    chatContainer.classList.remove("active");
    activeChatUser = null;
  }
  exitChat.addEventListener("click", closeChat);

  chatSend.addEventListener("click", () => {
    const txt = chatInput.value.trim();
    if (!txt) return;
    appendUserMessage(txt);
    chatInput.value = "";
    //if (typeof sendMessageToCatfisher === "function")
    //  sendMessageToCatfisher(txt, (reply) => appendCatfisherMessage(reply));
    //else setTimeout(() => appendCatfisherMessage("…"), 800);
    const currentChatUser = chatUsernameEl.textContent;
    if (currentChatUser === catfisherName && typeof sendMessageToCatfisher === "function") {
      sendMessageToCatfisher(txt, (reply) => appendCatfisherMessage(reply));
    }
  });
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      chatSend.click();
    }
  });
});

document.addEventListener("contextmenu", e => {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
    alert("Saving images is disabled.");
  }
});


// ---- PROFILE OVERLAY LOGIC ---- //
document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("editProfileBtn");
  const overlay = document.getElementById("profileOverlay");
  const cancelBtn = document.getElementById("cancelProfile");
  const profileForm = document.getElementById("profileForm");

  // Sidebar elements
  const sidebarUsername = document.getElementById("displayUsername");
  const sidebarAbout = document.getElementById("displayAbout");
  const sidebarAvatar = document.getElementById("userPic");

  const photoUpload = document.getElementById("photoUpload");
  const photoPreview = document.getElementById("photoPreview");

  // ---- Helper: get profile ----
  function getProfile() {
    return JSON.parse(localStorage.getItem("userProfile") || "{}");
  }

  // ---- Helper: save profile ----
  function saveProfile(profile) {
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }

  // ---- Open overlay ----
  editBtn?.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    loadProfileData();
  });

  // ---- Cancel button ----
  cancelBtn?.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  // ---- Load profile into overlay ----
  function loadProfileData() {
    const profile = getProfile();

    document.getElementById("username").value = profile.username || "";
    document.getElementById("about").value = profile.about || "";
    document.getElementById("birthday").value = profile.birthday || "";
    document.getElementById("location").value = profile.location || "";
    document.getElementById("gender").value = profile.gender || "";
    document.getElementById("childName").value = profile.childName || "";

    // Interests checkboxes
    document.querySelectorAll(".checkboxes input[type='checkbox']").forEach(cb => {
      cb.checked = profile.interests?.includes(cb.value) || false;
    });

    // Photo preview
    if (profile.photoDataUrl) {
      photoPreview.src = profile.photoDataUrl;
      photoPreview.classList.remove("hidden");
    } else {
      photoPreview.src = "";
      photoPreview.classList.add("hidden");
    }
  }

  // ---- Save profile from overlay ----
  profileForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const profile = getProfile();
    profile.username = document.getElementById("username").value.trim();
    profile.about = document.getElementById("about").value.trim();
    profile.birthday = document.getElementById("birthday").value;
    profile.location = document.getElementById("location").value.trim();
    profile.gender = document.getElementById("gender").value;
    profile.childName = document.getElementById("childName").value.trim();

    // Interests
    profile.interests = Array.from(
      document.querySelectorAll(".checkboxes input[type='checkbox']:checked")
    ).map(cb => cb.value);

    // Profile picture
    if (photoPreview.src && !photoPreview.classList.contains("hidden")) {
      profile.photoDataUrl = photoPreview.src;
    }

    saveProfile(profile);
    overlay.classList.add("hidden");
    updateSidebar();
  });

  // ---- Update sidebar ----
  function updateSidebar() {
    const profile = getProfile();
    sidebarUsername.textContent = profile.username || "User123";
    sidebarAbout.textContent = profile.about || "Welcome to FriendNet!";
    sidebarAvatar.src =
      profile.photoDataUrl || profile.selectedAvatar || "assets/img/avatars/avatar1.svg";
  }

  // ---- Avatar click (if you keep avatars) ----
  document.querySelectorAll(".avatar").forEach(avatar => {
    avatar.addEventListener("click", () => {
      document.querySelectorAll(".avatar").forEach(a => a.classList.remove("selected"));
      avatar.classList.add("selected");
      photoPreview.classList.add("hidden");
      photoPreview.src = "";
    });
  });

  // ---- Upload preview ----
  photoUpload?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      photoPreview.src = evt.target.result;
      photoPreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

  // ---- Initialize sidebar ----
  updateSidebar();
});


