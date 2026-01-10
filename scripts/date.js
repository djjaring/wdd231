// Current year
const yearSpan = document.querySelector("#currentyear");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Last modified
const modified = document.querySelector("#lastModified");
if (modified) {
  modified.textContent = `Last Modified: ${document.lastModified}`;
}
