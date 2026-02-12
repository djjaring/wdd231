import { initFeaturedProducts } from "./products.js";

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

// localStorage preference (grid/list)
const viewSelect = document.querySelector("#viewPref");
const featuredWrap = document.querySelector("#featuredProducts");

const KEY = "ps_view_pref";

function applyView(value) {
  if (!featuredWrap) return;
  featuredWrap.dataset.view = value;
}

if (viewSelect) {
  const saved = localStorage.getItem(KEY);
  if (saved) {
    viewSelect.value = saved;
    applyView(saved);
  } else {
    applyView(viewSelect.value);
  }

  viewSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    localStorage.setItem(KEY, value);
    applyView(value);
  });
}

initFeaturedProducts();
