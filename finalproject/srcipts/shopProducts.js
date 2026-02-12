const DATA_URL = "data/products.json";

const VIEW_KEY = "ps_shop_view";
const CART_KEY = "ps_cart";

let allProducts = [];
let currentModalProduct = null;

function money(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const cart = raw ? JSON.parse(raw) : [];
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.querySelector("#cartCount");
  if (!countEl) return;
  const cart = getCart();
  countEl.textContent = String(cart.length);
}

function uniqueValues(arr, key) {
  return [...new Set(arr.map((x) => x[key]).filter(Boolean))].sort();
}

function applyView(value) {
  const wrap = document.querySelector("#shopProducts");
  if (!wrap) return;
  wrap.dataset.view = value;
}

function openModal(p) {
  currentModalProduct = p;

  const modal = document.querySelector("#productModal");
  const title = document.querySelector("#modalTitle");
  const meta = document.querySelector("#modalMeta");
  const img = document.querySelector("#modalImg");
  const desc = document.querySelector("#modalDesc");
  const price = document.querySelector("#modalPrice");

  if (!modal || !title || !meta || !img || !desc || !price) return;

  title.textContent = p.name;
  meta.textContent = `${p.category.toUpperCase()} • ${p.level.toUpperCase()} • ${p.material}`;
  img.src = p.image;
  img.alt = p.alt || p.name;
  desc.textContent = p.description;
  price.textContent = money(p.price);

  modal.showModal();
}

function addToCart(product) {
  const cart = getCart();
  cart.push({
    id: product.id,
    name: product.name,
    price: product.price
  });
  setCart(cart);
}

function matchesFilters(p, q, category, level) {
  const text = `${p.name} ${p.category} ${p.level} ${p.material}`.toLowerCase();
  const queryOk = !q || text.includes(q);
  const catOk = category === "all" || p.category === category;
  const levelOk = level === "all" || p.level === level;
  return queryOk && catOk && levelOk;
}

function renderProducts(list) {
  const wrap = document.querySelector("#shopProducts");
  const status = document.querySelector("#shopStatus");
  if (!wrap) return;

  if (status) status.textContent = `Showing ${list.length} product(s).`;

  wrap.innerHTML = list.map((p) => `
    <article class="card">
      <button type="button" class="card-open" data-id="${p.id}">
        <img src="${p.image}" alt="${p.alt || p.name}" loading="lazy" width="600" height="400">
        <div class="card-body">
          <h3 class="card-title">${p.name}</h3>
          <p class="card-meta">${p.level.toUpperCase()} • ${p.material}</p>
          <p class="price">${money(p.price)}</p>

          <div class="card-actions" aria-hidden="true">
            <span class="small-btn">View</span>
            <span class="small-btn">Add</span>
          </div>
        </div>
      </button>
    </article>
  `).join("");

  // DOM + event handling
  wrap.querySelectorAll(".card-open").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const product = allProducts.find((x) => x.id === id);
      if (product) openModal(product);
    });
  });
}

function readControls() {
  const q = (document.querySelector("#searchInput")?.value || "").trim().toLowerCase();
  const category = document.querySelector("#categorySelect")?.value || "all";
  const level = document.querySelector("#levelSelect")?.value || "all";
  return { q, category, level };
}

function updateList() {
  const { q, category, level } = readControls();

  // array methods (filter)
  const filtered = allProducts.filter((p) => matchesFilters(p, q, category, level));

  renderProducts(filtered);
}

function fillCategoryOptions() {
  const select = document.querySelector("#categorySelect");
  if (!select) return;

  const cats = uniqueValues(allProducts, "category");
  const options = ['<option value="all">All</option>']
    .concat(cats.map((c) => `<option value="${c}">${c[0].toUpperCase() + c.slice(1)}</option>`));

  select.innerHTML = options.join("");
}

export async function initShop() {
  const status = document.querySelector("#shopStatus");
  const viewSelect = document.querySelector("#viewSelect");

  updateCartCount();

  // view preference localStorage
  if (viewSelect) {
    const saved = localStorage.getItem(VIEW_KEY);
    if (saved) {
      viewSelect.value = saved;
      applyView(saved);
    } else {
      applyView(viewSelect.value);
    }

    viewSelect.addEventListener("change", (e) => {
      const value = e.target.value;
      localStorage.setItem(VIEW_KEY, value);
      applyView(value);
    });
  }

  // modal add button
  const modalAddBtn = document.querySelector("#modalAddBtn");
  if (modalAddBtn) {
    modalAddBtn.addEventListener("click", () => {
      if (currentModalProduct) addToCart(currentModalProduct);
    });
  }

  try {
    if (status) status.textContent = "Loading products…";

    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const data = await res.json();
    allProducts = Array.isArray(data.products) ? data.products : [];

    if (allProducts.length < 15 && status) {
      status.textContent = `Loaded ${allProducts.length} products (need at least 15).`;
    }

    fillCategoryOptions();
    updateList();

    // controls events
    document.querySelector("#searchInput")?.addEventListener("input", updateList);
    document.querySelector("#categorySelect")?.addEventListener("change", updateList);
    document.querySelector("#levelSelect")?.addEventListener("change", updateList);

    document.querySelector("#clearBtn")?.addEventListener("click", () => {
      const search = document.querySelector("#searchInput");
      const cat = document.querySelector("#categorySelect");
      const lvl = document.querySelector("#levelSelect");

      if (search) search.value = "";
      if (cat) cat.value = "all";
      if (lvl) lvl.value = "all";

      updateList();
    });

  } catch (err) {
    console.error(err);
    if (status) status.textContent = "Sorry — products failed to load. Check your JSON path and try again.";
  }
}
