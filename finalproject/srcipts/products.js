const DATA_URL = "data/products.json";

function money(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function byFeatured(item) {
  return item.featured === true;
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

function renderCards(items) {
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

  // event handling (DOM manipulation)
  wrap.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const item = items.find((x) => x.id === id);
      if (item) openModal(item);
    });
  });
}

export async function initFeaturedProducts() {
  const status = document.querySelector("#productStatus");

  try {
    if (status) status.textContent = "Loading featured products…";

    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const data = await res.json();
    const all = Array.isArray(data.products) ? data.products : [];

    // array method usage (filter)
    const featured = all.filter(byFeatured);

    // Show at least 15 items overall in your project later.
    // On home we show featured only (you can still include 15+ in JSON).
    renderCards(featured);

    if (status) status.textContent = `Loaded ${featured.length} featured items. Click a product for details.`;
  } catch (err) {
    console.error(err);
    if (status) status.textContent = "Sorry — products failed to load. Please try again later.";
  }
}
