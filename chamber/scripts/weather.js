// chamber/scripts/weather.js
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // <-- put your key here

// Jacksonville, FL (approx)
const LAT = 30.3322;
const LON = -81.6557;
const UNITS = "imperial"; // imperial = °F, metric = °C

const tempEl = document.querySelector("#temp");
const descEl = document.querySelector("#desc");
const forecastEl = document.querySelector("#forecast");

function safeText(el, text) {
  if (el) el.textContent = text;
}

function dayLabelFromUnix(unixSeconds) {
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function pick3MiddayForecasts(list) {
  // OpenWeather 5-day forecast is every 3 hours.
  // We will pick the next 3 unique days around 12:00:00 when possible.
  const byDay = new Map();

  for (const item of list) {
    const dtTxt = item.dt_txt; // "YYYY-MM-DD HH:MM:SS"
    const dayKey = dtTxt.slice(0, 10);
    const hour = dtTxt.slice(11, 13);

    // Prefer noon-ish
    const isMidday = hour === "12";

    if (!byDay.has(dayKey)) {
      byDay.set(dayKey, item);
    } else if (isMidday) {
      // Replace with better midday pick
      byDay.set(dayKey, item);
    }
  }

  // Get upcoming days (skip "today" if you want, but it's ok either way)
  const items = Array.from(byDay.values());
  // Sort by time
  items.sort((a, b) => a.dt - b.dt);

  // Return next 3 entries
  return items.slice(0, 3);
}

async function loadWeather() {
  // Guard: only run if weather section exists
  if (!tempEl || !descEl || !forecastEl) return;

  if (!API_KEY || API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    safeText(descEl, "Add your OpenWeatherMap API key.");
    return;
  }

  try {
    // Current weather
    const currentURL =
      `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=${UNITS}&appid=${API_KEY}`;

    const currentRes = await fetch(currentURL);
    if (!currentRes.ok) throw new Error("Current weather request failed");
    const currentData = await currentRes.json();

    const currentTemp = Math.round(currentData.main.temp);
    const currentDesc = currentData.weather?.[0]?.description ?? "Weather unavailable";

    safeText(tempEl, currentTemp);
    safeText(descEl, currentDesc);

    // 5-day forecast
    const forecastURL =
      `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=${UNITS}&appid=${API_KEY}`;

    const forecastRes = await fetch(forecastURL);
    if (!forecastRes.ok) throw new Error("Forecast request failed");
    const forecastData = await forecastRes.json();

    const picks = pick3MiddayForecasts(forecastData.list);

    forecastEl.innerHTML = "";
    for (const item of picks) {
      const li = document.createElement("li");
      li.className = "forecast-item";

      const label = dayLabelFromUnix(item.dt);
      const t = Math.round(item.main.temp);

      li.innerHTML = `
        <span class="f-day">${label}</span>
        <span class="f-temp">${t}°F</span>
      `;
      forecastEl.appendChild(li);
    }
  } catch (err) {
    console.error(err);
    safeText(descEl, "Weather unavailable right now.");
    forecastEl.innerHTML = "<li class='forecast-item'>Forecast unavailable.</li>";
  }
}

loadWeather();
