// Modern interactions for Internet Safety Adventures
document.addEventListener("DOMContentLoaded", () => {
  console.log("Internet Safety Adventures homepage loaded!");

  // Fade-in sections
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".fade-section, section").forEach(el => observer.observe(el));

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      target?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // === Dark/Light Mode Toggle ===
  const toggle = document.getElementById("theme-toggle");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");

  const applyTheme = theme => {
    document.documentElement.setAttribute("data-theme", theme);
    toggle.textContent = theme === "dark" ? "🌙" : "🌞";
  };

  // Set initial theme
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });

  // Subtle parallax header effect
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.3;
    header.style.backgroundPositionY = `${offset}px`;
  });
});

