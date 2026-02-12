const CART_KEY = "ps_cart";
const PROFILE_KEY = "ps_profile";

function initNav(){
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

function updateCartCount(){
  const countEl = document.querySelector("#cartCount");
  if (!countEl) return;

  try{
    const raw = localStorage.getItem(CART_KEY);
    const cart = raw ? JSON.parse(raw) : [];
    countEl.textContent = String(Array.isArray(cart) ? cart.length : 0);
  }catch{
    countEl.textContent = "0";
  }
}

function loadProfile(){
  try{
    const raw = localStorage.getItem(PROFILE_KEY);
    const profile = raw ? JSON.parse(raw) : null;

    if (profile?.fullName) document.querySelector("#fullName").value = profile.fullName;
    if (profile?.email) document.querySelector("#email").value = profile.email;
  }catch{
    // ignore
  }
}

function saveProfile(){
  const fullName = document.querySelector("#fullName").value.trim();
  const email = document.querySelector("#email").value.trim();
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ fullName, email }));
}

function setTimestamp(){
  const el = document.querySelector("#submittedAt");
  if (!el) return;
  el.value = new Date().toISOString();
}

function validateForm(){
  const form = document.querySelector("#contactForm");
  const status = document.querySelector("#formStatus");
  if (!form || !status) return true;

  if (form.checkValidity()) {
    status.textContent = "";
    return true;
  }

  status.textContent = "Please complete all required fields with valid information.";
  return false;
}

initNav();
updateCartCount();
loadProfile();
setTimestamp();

document.querySelector("#contactForm")?.addEventListener("submit", (e) => {
  setTimestamp();

  if (!validateForm()) {
    e.preventDefault();
    return;
  }

  saveProfile();
});
