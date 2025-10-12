// script.js — handles demo interactions and safe redirect simulation
document.addEventListener('DOMContentLoaded', () => {

  // Helper: redirect to intermediate page
  function goToRedirect(title) {
    const encoded = encodeURIComponent(title || 'unknown');
    location.href = `redirect.html?title=${encoded}`;
  }

  // Handle Watch buttons
  document.querySelectorAll('.watch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.dataset.title || btn.closest('.card')?.dataset?.title;
      goToRedirect(title);
    });
  });

  // Handle Play buttons inside thumbnails
  document.querySelectorAll('.card .play').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.closest('.card')?.dataset?.title;
      goToRedirect(title);
    });
  });

  // Info button placeholder
  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.closest('.card')?.dataset?.title;
      alert(`${title}\n\nThis is a demo description area. (You can replace this alert with a modal or info panel.)`);
    });
  });

  // If we are on redirect.html, handle staged reveal and auto-forward
  if (document.body.classList.contains('redirect')) {
    const params = new URLSearchParams(location.search);
    const title = params.get('title');

    // Fade out "Loading movie..." after 2 seconds
    setTimeout(() => {
      const loading = document.querySelector('.loading-text');
      if (loading) loading.classList.add('fade-out');
    }, 2000);

    // Redirect after total delay (~11.5s)
    const totalDelay = 11500;
    setTimeout(() => {
      const next = title ? `gotcha.html?title=${encodeURIComponent(title)}` : 'gotcha.html';
      location.href = next;
    }, totalDelay);
  }
  

});

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".catalog-wrapper");
  if (!wrapper) return;

  const catalog = wrapper.querySelector(".catalog");
  const leftBtn = wrapper.querySelector(".scroll-btn.left");
  const rightBtn = wrapper.querySelector(".scroll-btn.right");

  const scrollAmount = 300; // pixels per click

  leftBtn.addEventListener("click", () => {
    catalog.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    catalog.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
});

