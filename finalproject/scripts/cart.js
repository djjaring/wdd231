// scripts/cart.js (NO imports)

const CART_KEY = "ps_cart";

function money(n){
  return new Intl.NumberFormat("en-US", { style:"currency", currency:"USD" }).format(n);
}

function initNav() {
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

function getCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    const cart = raw ? JSON.parse(raw) : [];
    return Array.isArray(cart) ? cart : [];
  }catch{
    return [];
  }
}

function setCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  render();
}

function updateCartCount(){
  const countEl = document.querySelector("#cartCount");
  if (!countEl) return;
  countEl.textContent = String(getCart().length);
}

function render(){
  const itemsWrap = document.querySelector("#cartItems");
  const totalEl = document.querySelector("#cartTotal");
  const status = document.querySelector("#cartStatus");

  const cart = getCart();

  if (status){
    status.textContent = cart.length ? `You have ${cart.length} item(s) in your cart.` : "Your cart is empty.";
  }

  if (!itemsWrap || !totalEl) return;

  if (!cart.length){
    itemsWrap.innerHTML = "<p class='muted'>No items yet. Go to the Shop and add products.</p>";
    totalEl.textContent = money(0);
    return;
  }

  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  itemsWrap.innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <div>
        <p class="cart-name"><strong>${item.name}</strong></p>
        <p class="muted">${money(item.price)}</p>
      </div>
      <button class="small-btn" type="button" data-remove="${index}">Remove</button>
    </div>
  `).join("");

  totalEl.textContent = money(total);

  itemsWrap.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.remove);
      const newCart = getCart().filter((_, i) => i !== idx);
      setCart(newCart);
    });
  });
}

document.querySelector("#clearCartBtn")?.addEventListener("click", () => {
  setCart([]);
});

initNav();
updateCartCount();
render();
