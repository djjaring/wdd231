const DATA_URL = "data/products.json";
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

async function loadStats(){
  try{
    const res = await fetch(DATA_URL);
    if(!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    const products = data.products || [];

    document.querySelector("#statProducts").textContent = products.length;

    const categories = [...new Set(products.map(p => p.category))];
    document.querySelector("#statCategories").textContent = categories.length;

  }catch(error){
    console.error(error);
  }
}

initNav();
updateCartCount();
loadStats();
