const CART_KEY = "ps_cart";

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

function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showResults(){
  const params = new URLSearchParams(window.location.search);
  const result = document.querySelector("#result");
  if (!result) return;

  const rows = [];
  for (const [key, value] of params.entries()) {
    rows.push(`
      <div class="result-row">
        <p class="muted"><strong>${escapeHtml(key)}</strong></p>
        <p>${escapeHtml(value)}</p>
      </div>
    `);
  }

  result.innerHTML = rows.length
    ? rows.join("")
    : "<p class='muted'>No form data found.</p>";
}

initNav();
updateCartCount();
showResults();
