// scripts/main.js (NO imports)

const DATA_URL = "data/products.json";

function money(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
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

function initViewPref() {
  const KEY = "ps_view_pref";
  const viewSelect = document.querySelector("#viewPref");
  const featuredWrap = document.querySelector("#featuredProducts");

  function applyView(value) {
    if (!featuredWrap) return;
    featuredWrap.dataset.view = value;
  }

  if (!viewSelect) return;

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

function openModal(item) {
  const modal = document.querySelector("#productModal");
  const title = document.querySelector("#modalTitle");
  const meta = document.querySelector("#modalMeta");
  const img = document.querySelector("#modalImg");
  const desc = document.querySelector("#modalDesc");
  const price = document.querySelector("#modalPrice");

  if (!modal || !title || !meta || !img || !desc || !price) return;

  title.textContent = item.name;
  meta.textContent = `${item.category.toUpperCase()} • ${item.level.toUpperCase()} • ${item.material}`;
  img.src = item.image;
  img.alt = item.alt || item.name;
  desc.textContent = item.description;
  price.textContent = money(item.price);

  modal.showModal();
}

function renderFeatured(items) {
  const wrap = document.querySelector("#featuredProducts");
  if (!wrap) return;

  wrap.innerHTML = items.map((p) => `
    <article class="card">
      <button type="button" data-id="${p.id}">
        <img src="${p.image}" alt="${p.alt || p.name}" loading="lazy" width="600" height="400">
        <div class="card-body">
          <h3 class="card-title">${p.name}</h3>
          <p class="card-meta">${p.level.toUpperCase()} • ${p.material}</p>
          <p class="price">${money(p.price)}</p>
        </div>
      </button>
    </article>
  `).join("");

  wrap.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const item = items.find((x) => x.id === id);
      if (item) openModal(item);
    });
  });
}

async function initFeaturedProducts() {
  const status = document.querySelector("#productStatus");

  try {
    if (status) status.textContent = "Loading featured products…";

    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const data = await res.json();
    const all = Array.isArray(data.products) ? data.products : [];

    const featured = all.filter((p) => p.featured === true);

    renderFeatured(featured);

    if (status) status.textContent = `Loaded ${featured.length} featured items. Click a product for details.`;
  } catch (err) {
    console.error(err);
    if (status) status.textContent = "Products failed to load. Check console + JSON path.";
  }
}

initNav();
initViewPref();
initFeaturedProducts();
