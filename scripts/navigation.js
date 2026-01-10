const menuButton = document.querySelector("#menuButton");
const siteNav = document.querySelector("#siteNav");

function toggleMenu() {
  const isOpen = siteNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
}

if (menuButton && siteNav) {
  menuButton.addEventListener("click", toggleMenu);
}
