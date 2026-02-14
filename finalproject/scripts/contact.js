// scripts/contact.js (NO imports)

const CART_KEY = "ps_cart";

function initNavAndYear() {
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

function getCartCount() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const cart = raw ? JSON.parse(raw) : [];
    return Array.isArray(cart) ? cart.length : 0;
  } catch {
    return 0;
  }
}

function updateCartCounts() {
  const count = getCartCount();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = String(count);
  });
}

function isoNowLocal() {
  // simple readable timestamp (local)
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function initContactForm() {
  const form = document.querySelector("#contactForm");
  const submittedAt = document.querySelector("#submittedAt");
  const status = document.querySelector("#formStatus");

  if (submittedAt) submittedAt.value = isoNowLocal();
  if (!form) return;

  form.addEventListener("submit", (e) => {
    // basic front-end validation message (optional)
    const nameOk = form.fullName?.value.trim();
    const emailOk = form.email?.value.trim();
    const topicOk = form.topic?.value.trim();
    const msgOk = form.message?.value.trim();

    if (!nameOk || !emailOk || !topicOk || !msgOk) {
      e.preventDefault();
      if (status) status.textContent = "Please complete all required fields before submitting.";
      return;
    }

    if (submittedAt) submittedAt.value = isoNowLocal();
    if (status) status.textContent = "Submitting…";
  });
}

initNavAndYear();
updateCartCounts();
initContactForm();
