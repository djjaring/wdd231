import { places } from "./discover.mjs";

const grid = document.querySelector("#discoverGrid");
const msgEl = document.querySelector("#visitMessage");

const areaNames = ["area-a","area-b","area-c","area-d","area-e","area-f","area-g","area-h"];

function buildCards() {
  if (!grid) return;

  grid.innerHTML = "";

  places.slice(0, 8).forEach((place, i) => {
    const card = document.createElement("article");
    card.classList.add("card", "discover-card", areaNames[i] || "");

    const h2 = document.createElement("h2");
    h2.textContent = place.name;

    const fig = document.createElement("figure");
    const img = document.createElement("img");
    img.src = place.image;
    img.alt = place.alt || place.name;
    img.loading = "lazy";
    img.width = 300;
    img.height = 200;

    fig.appendChild(img);

    const addr = document.createElement("address");
    addr.textContent = place.address;

    const p = document.createElement("p");
    p.textContent = place.description;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Learn more";
    btn.addEventListener("click", () => {
      alert(`${place.name}\n\n${place.address}`);
    });

    card.append(h2, fig, addr, p, btn);
    grid.appendChild(card);
  });
}

function setVisitMessage() {
  if (!msgEl) return;

  const KEY = "discoverLastVisit";
  const now = Date.now();
  const last = Number(localStorage.getItem(KEY));

  if (!last) {
    msgEl.textContent = "Welcome! Let us know if you have any questions.";
    localStorage.setItem(KEY, String(now));
    return;
  }

  const diffMs = now - last;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    msgEl.textContent = "Back so soon! Awesome!";
  } else if (diffDays === 1) {
    msgEl.textContent = "You last visited 1 day ago.";
  } else {
    msgEl.textContent = `You last visited ${diffDays} days ago.`;
  }

  localStorage.setItem(KEY, String(now));
}

buildCards();
setVisitMessage();
