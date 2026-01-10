// ---- Course List Array (edit "completed" to match your real progress) ----
const courses = [
  { code: "CSE 110", name: "Introduction to Programming", credits: 2, completed: false },
  { code: "WDD 130", name: "Web Fundamentals", credits: 2, completed: true },
  { code: "CSE 111", name: "Programming with Functions", credits: 2, completed: false },
  { code: "CSE 210", name: "Programming with Classes", credits: 2, completed: false },
  { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 2, completed: true },
  { code: "WDD 231", name: "Frontend Web Development I", credits: 2, completed: false },
  { code: "WDD 330", name: "Web Frontend Development II", credits: 3, completed: false },
  { code: "WDD 331", name: "Advanced CSS", credits: 2, completed: false },
  { code: "CSE 340", name: "Web Backend Development", credits: 3, completed: false }
];

// ---- DOM refs ----
const listEl = document.querySelector("#courseList");
const creditTotalEl = document.querySelector("#creditTotal");
const filterButtons = document.querySelectorAll(".filter-btn");

// ---- Helpers ----
function isWDD(course) {
  return course.code.toLowerCase().startsWith("wdd");
}
function isCSE(course) {
  return course.code.toLowerCase().startsWith("cse");
}

function renderCourses(courseArray) {
  if (!listEl || !creditTotalEl) return;

  listEl.innerHTML = "";

  courseArray.forEach(course => {
    const card = document.createElement("div");
    card.classList.add("course");
    if (course.completed) card.classList.add("completed");

    const left = document.createElement("div");
    const code = document.createElement("div");
    code.classList.add("code");
    code.textContent = course.code;

    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = course.name;

    left.appendChild(code);
    left.appendChild(title);

    const right = document.createElement("div");

    const credits = document.createElement("div");
    credits.classList.add("credits");
    credits.textContent = `${course.credits} credits`;

    const status = document.createElement("div");
    status.classList.add("status");
    status.textContent = course.completed ? "Completed" : "Not completed";

    right.appendChild(credits);
    right.appendChild(status);

    card.appendChild(left);
    card.appendChild(right);

    listEl.appendChild(card);
  });

  // Total credits dynamically with reduce
  const total = courseArray.reduce((sum, c) => sum + c.credits, 0);
  creditTotalEl.textContent = total;
}

function setActiveButton(filterValue) {
  filterButtons.forEach(btn => {
    const isActive = btn.dataset.filter === filterValue;
    btn.style.outline = isActive ? "3px solid rgba(122,162,255,0.35)" : "none";
  });
}

function applyFilter(filterValue) {
  let filtered = courses;

  if (filterValue === "wdd") filtered = courses.filter(isWDD);
  if (filterValue === "cse") filtered = courses.filter(isCSE);

  setActiveButton(filterValue);
  renderCourses(filtered);
}

// ---- Events ----
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    applyFilter(btn.dataset.filter);
  });
});

// Initial render
applyFilter("all");
