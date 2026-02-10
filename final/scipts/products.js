import { openProductModal } from './modal.js';
import { addToCart } from './storage.js';

export async function fetchProducts(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    return data.products ?? [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export function renderProducts(listEl, products, dialogEl) {
  if (!listEl) return;

  listEl.innerHTML = products.map(p => `
    <article class="product card">
      <div class="thumb">
        <img src="${p.image}" alt="${p.alt}" loading="lazy" width="640" height="480">
      </div>
      <h3>${p.name}</h3>
      <div class="row">
        <span class="meta">${p.category} • ${p.level}</span>
        <span class="price">$${Number(p.price).toFixed(2)}</span>
      </div>
      <button type="button" data-id="${p.id}">View details</button>
      <button type="button" data-add="${p.id}">Add to cart</button>
    </article>
  `).join('');

  listEl.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('[data-id]');
    const addBtn = e.target.closest('[data-add]');

    if (viewBtn) {
      const id = Number(viewBtn.dataset.id);
      const product = products.find(x => x.id === id);
      if (product) openProductModal(dialogEl, product);
    }

    if (addBtn) {
      const id = Number(addBtn.dataset.add);
      const product = products.find(x => x.id === id);
      if (!product) return;
      const count = addToCart(product);
      const live = document.querySelector('#cartLive');
      if (live) live.textContent = `Added to cart. Cart now has ${count} items.`;
    }
  }, { once: true });
}

export function filterByCategory(products, category) {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
}
