// chamber/scripts/spotlights.js
const spotlightsEl = document.querySelector("#spotlights");

function membershipLabel(level) {
  if (level === 3) return "Gold";
  if (level === 2) return "Silver";
  return "Member";
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick2or3(items) {
  const count = Math.random() < 0.5 ? 2 : 3;
  return items.slice(0, count);
}

function renderSpotlight(member) {
  const card = document.createElement("article");
  card.classList.add("member-card", "spotlight-card");

  const img = document.createElement("img");
  img.src = `images/members/${member.image}`;
  img.alt = `${member.name} logo`;
  img.width = 300;
  img.height = 200;
  img.loading = "lazy";

  const name = document.createElement("h3");
  name.textContent = member.name;

  const address = document.createElement("p");
  address.textContent = member.address;

  const phone = document.createElement("p");
  phone.textContent = member.phone;

  const website = document.createElement("p");
  website.innerHTML = `Website: <a href="${member.website}" target="_blank" rel="noopener">Visit</a>`;

  const badge = document.createElement("span");
  badge.classList.add("badge");
  badge.textContent = `Level: ${membershipLabel(member.membership)}`;

  card.append(img, name, address, phone, website, badge);
  return card;
}

async function loadSpotlights() {
  if (!spotlightsEl) return;

  try {
    const res = await fetch("data/members.json");
    if (!res.ok) throw new Error("Failed to load members.json");
    const data = await res.json();

    const eligible = (data.members || []).filter(m => m.membership === 2 || m.membership === 3);
    const chosen = pick2or3(shuffle(eligible));

    spotlightsEl.innerHTML = "";
    chosen.forEach(m => spotlightsEl.appendChild(renderSpotlight(m)));
  } catch (err) {
    console.error(err);
    spotlightsEl.innerHTML = "<p>Spotlights could not load.</p>";
  }
}

loadSpotlights();
