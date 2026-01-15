// Responsive nav toggle (mobile)
const menuBtn = document.querySelector("#menuBtn");
const nav = document.querySelector("#primaryNav");

menuBtn?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen);
  menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

// Grid/List view toggle
const gridBtn = document.querySelector("#gridBtn");
const listBtn = document.querySelector("#listBtn");
const members = document.querySelector("#members");

gridBtn?.addEventListener("click", () => {
  members.classList.add("grid");
  members.classList.remove("list");
});

listBtn?.addEventListener("click", () => {
  members.classList.add("list");
  members.classList.remove("grid");
});

// Footer: year + last modified
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;
