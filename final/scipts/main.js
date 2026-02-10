const btn = document.querySelector('#navToggle');
const menu = document.querySelector('#navLinks');

if (btn && menu) {
  const closeMenu = () => {
    menu.dataset.open = 'false';
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', () => {
    const isOpen = menu.dataset.open === 'true';
    menu.dataset.open = String(!isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// Wayfinding: aria-current based on pathname
const path = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === path) a.setAttribute('aria-current', 'page');
});
