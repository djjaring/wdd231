export function initNavAndYear() {
  const yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggleBtn = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");

  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });
  }
}
