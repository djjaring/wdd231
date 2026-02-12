import { fetchProducts, renderProducts, filterByCategory, attachProductClicks } from "./product.js";
import { wireModal } from "./modal.js";
import { getCartCount } from "./storage.js";

const DATA_URL = "data/products.json"; // make sure this path matches your folder

const els = {
  list: document.querySelector("#productList"),
  category: document.querySelector("#category"),
  modal: document.querySelector("#productModal"),
  modalClose: document.querySelector("#modalClose"),
  cartLive: document.querySelector("#cartLive"),
  resultsLive: document.querySelector("#resultsLive"),
  error: document.querySelector("#shopError"),
};

let allProducts = [];

function setCartLive() {
  const count = getCartCount();
  if (els.cartLive) els.cartLive.textContent = `Cart has ${count} item${count === 1 ? "" : "s"}.`;
}

function setResultsLive(count, category) {
  if (!els.resultsLive) return;
  const label = category === "all" ? "all categories" : category;
  els.resultsLive.textContent = `Showing ${count} product${count === 1 ? "" : "s"} in ${label}.`;
}

function setError(msg = "") {
  if (!els.error) return;
  els.error.textContent = msg;
}

function safeInit() {
  if (!els.list || !els.category || !els.modal) {
    console.warn("Shop page missing required elements.");
    return false;
  }
  return true;
}

async function init() {
  if (!safeInit()) return;

  // Modal wiring
  wireModal(els.modal, els.modalClose);

  // Load products
  setError("Loading products…");
  allProducts = await fetchProducts(DATA_URL);

  if (!allProducts.length) {
    setError("Could not load products. Check that data/products.json exists and paths are correct.");
    return;
  }

  setError("");

  // Initial render
  const initial = filterByCategory(allProducts, els.category.value);
  renderProducts(els.list, initial);
  setResultsLive(initial.length, els.category.value);
  setCartLive();

  // Hook product buttons (view/add)
  attachProductClicks(els.list, () => allProducts, els.modal);

  // Filter changes
  els.category.addEventListener("change", () => {
    const filtered = filterByCategory(allProducts, els.category.value);
    renderProducts(els.list, filtered);
    setResultsLive(filtered.length, els.category.value);
  });

  // Update cart live count when returning to tab
  window.addEventListener("focus", setCartLive);
}

init();
