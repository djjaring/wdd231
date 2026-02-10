import { fetchProducts, renderProducts, filterByCategory, attachProductClicks } from './products.js';

const listEl = document.querySelector('#productList');
const dialogEl = document.querySelector('#productModal');
const categoryEl = document.querySelector('#category');

const closeBtn = document.querySelector('#modalClose');
if (closeBtn && dialogEl) closeBtn.addEventListener('click', () => dialogEl.close());

let allProducts = [];
let shownProducts = [];

attachProductClicks(listEl, () => shownProducts, dialogEl);

(async () => {
  allProducts = await fetchProducts('data/products.json');
  shownProducts = allProducts;

  renderProducts(listEl, shownProducts);
})();

categoryEl?.addEventListener('change', (e) => {
  const selected = e.target.value;
  shownProducts = filterByCategory(allProducts, selected);
  renderProducts(listEl, shownProducts);
});
