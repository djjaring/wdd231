document.addEventListener("DOMContentLoaded", () => {
  const tsInput = document.querySelector("#timestamp");
  if (tsInput) {
    tsInput.value = new Date().toISOString();
  }

  // Animate cards on page load
  document.querySelectorAll(".mcard").forEach((card) => {
    requestAnimationFrame(() => card.classList.add("is-visible"));
  });

  // Modals
  document.querySelectorAll("[data-modal]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.getAttribute("data-modal");
      const dialog = document.getElementById(id);
      if (dialog) dialog.showModal();
    });
  });

  document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dialog = btn.closest("dialog");
      if (dialog) dialog.close();
    });
  });

  document.querySelectorAll("dialog").forEach((dlg) => {
    dlg.addEventListener("click", (e) => {
      const rect = dlg.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) dlg.close();
    });
  });
});
