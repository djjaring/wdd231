const membersContainer = document.querySelector("#members");

function membershipLabel(level) {
  if (level === 3) return "Gold";
  if (level === 2) return "Silver";
  return "Member";
}

async function getMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error("Failed to load members.json");
    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    membersContainer.innerHTML = `<p>Sorry, members could not load.</p>`;
    console.error(error);
  }
}

function displayMembers(members) {
  membersContainer.innerHTML = "";

  members.forEach(member => {
    const card = document.createElement("article");
    card.classList.add("member-card");

    const img = document.createElement("img");
    img.src = `images/members/${member.image}`;
    img.alt = `${member.name} logo or photo`;
    img.width = 300;
    img.height = 200;
    img.loading = "lazy";

    const name = document.createElement("h3");
    name.textContent = member.name;

    const address = document.createElement("p");
    address.textContent = member.address;

    const phone = document.createElement("p");
    phone.textContent = member.phone;

    const link = document.createElement("p");
    link.innerHTML = `Website: <a href="${member.website}" target="_blank" rel="noopener">Visit</a>`;

    const notes = document.createElement("p");
    notes.textContent = member.notes;

    const badge = document.createElement("span");
    badge.classList.add("badge");
    badge.textContent = `Level: ${membershipLabel(member.membership)}`;

    card.append(img, name, address, phone, link, notes, badge);
    membersContainer.appendChild(card);
  });
}

getMembers();
