import { addToCart } from "./storage.js";

export function wireModal(dialogEl, closeBtn) {
  if (!dialogEl) return;

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener("click", () => dialogEl.close());
  }

  // ESC close is built-in for <dialog>, but we’ll also support backdrop click:
  dialogEl.addEventListener("click", (e) => {
    const rect = dialogEl.getBoundingClientRect();
    const clickedInDialog =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!clickedInDialog) dialogEl.close();
  });
}

export function openProductModal(dialogEl, product) {
  if (!dialogEl || !product) return;

  const titleEl = dialogEl.querySelector("[data-modal-title]");
  const bodyEl = dialogEl.querySelector("[data-modal-body]");

  if (titleEl) titleEl.textContent = product.name;

  if (bodyEl) {
    bodyEl.innerHTML = `
      <div class="grid" style="grid-template-columns: 1fr; gap: 1rem; margin-top: .75rem;">
        <div class="card" style="padding: 1rem;">
          <div class="thumb" style="margin-bottom: .75rem;">
            <img src="${product.image}" alt="${product.alt}" loading="lazy" width="800" height="600">
          </div>

          <p class="help" style="margin:0 0 .5rem;">
            <strong>${product.category}</strong> • ${product.level}
          </p>

          <p style="margin:0 0 .5rem;"><strong>Price:</strong> $${Number(product.price).toFixed(2)}</p>
          <p style="margin:0 0 .5rem;"><strong>Material:</strong> ${product.material}</p>
          <p style="margin:0 0 .75rem;">${product.description}</p>

          <button class="btn primary" type="button" id="modalAdd">
            Add to cart
          </button>

          <p class="help" id="modalLive" aria-live="polite" style="margin-top:.75rem;"></p>
        </div>
      </div>
    `;

    const addBtn = bodyEl.querySelector("#modalAdd");
    const live = bodyEl.querySelector("#modalLive");

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const count = addToCart(product);
        if (live) live.textContent = `Added to cart. Cart now has ${count} items.`;
      });
    }
  }

  // showModal is supported in modern browsers; fallback to open
  if (typeof dialogEl.showModal === "function") dialogEl.showModal();
  else dialogEl.setAttribute("open", "");
}
