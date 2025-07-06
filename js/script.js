const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
// ===============Variables for Today's Weather==============
const currentDay = document.querySelector(".current-day");
const currentDate = document.querySelector(".current-date");
const cityName = document.querySelector(".city-name");
const currentTemp = document.querySelector(".current-temp");
const todayIcon = document.querySelector(".today-icon");
const todayDescription = document.querySelector(".today-description");
const todayHumidity = document.querySelector(".today-humidity");
const todayWind = document.querySelector(".today-wind");
// ===============Variables for Tomorrow's Weather==============
const nextDay = document.querySelector(".next-day");
const tomorrowDate = document.querySelector(".tomorrow-date");
const tomorrowTemp = document.querySelector(".tomorrow-temp");
const tomorrowIcon = document.querySelector(".tomorrow-icon");
const tomorrowDescription = document.querySelector(".tomorrow-description");
const tomorrowHumidity = document.querySelector(".tomorrow-humidity");
const tomorrowWind = document.querySelector(".tomorrow-wind");
// ===============Variables for After Tomorrow's Weather==============
const afterNextDay = document.querySelector(".after-next-day");
const afterTomorrowDate = document.querySelector(".after-tomorrow-date");
const afterTomorrowTemp = document.querySelector(".after-tomorrow-temp");
const afterTomorrowIcon = document.querySelector(".after-tomorrow-icon");
const afterTomorrowDescription = document.querySelector(
  ".after-tomorrow-description"
);
const afterTomorrowHumidity = document.querySelector(
  ".after-tomorrow-humidity"
);
const afterTomorrowWind = document.querySelector(".after-tomorrow-wind");

navigator.geolocation.getCurrentPosition(
  (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    updateWeather(`${latitude},${longitude}`);
  },
  (error) => {
    console.error("Location access denied or failed", error);
    updateWeather("Cairo");
  }
);

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeather(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});
cityInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && cityInput.value.trim() != "") {
    updateWeather(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

// Get weather forecast data from API
async function getFetchData(city) {
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=228dded3d79741a4b8f180311250207&q=${city}&days=3`;
  const res = await fetch(apiUrl);
  return res.json();
}

// Update weather information on the page
async function updateWeather(city) {
  const weatherData = await getFetchData(city);

  const {
    location: { name: cityValue },
    current: {
      temp_c: tempValue,
      wind_kph: windValue,
      humidity: humidityValue,
      condition: { text: conditionText, icon: conditionIcon },
    },
    forecast: { forecastday },
  } = weatherData;
  // ==========Today's Weather==========
  cityName.innerHTML = `<i class="fa-solid fa-location-dot me-2"></i>${cityValue}`;
  currentDay.textContent = getDayName();
  currentTemp.textContent = `${tempValue}°C`;
  todayIcon.innerHTML = `<img src="${conditionIcon}" alt="Weather Icon">`;
  todayDescription.textContent = conditionText;
  todayHumidity.textContent = `Humidity: ${humidityValue}%`;
  todayWind.innerHTML = `<i class="fa-solid fa-wind"></i> ${windValue} km/h`;
  currentDate.textContent = formatDate();
  // ==========Tomorrow's Weather==========
  const currentHour = new Date().getHours();
  const tomorrowForecast = forecastday[1];
  const tomorrowTempValue = tomorrowForecast.day.avgtemp_c;
  const tomorrowIconValue = tomorrowForecast.day.condition.icon;
  const tomorrowCondition = tomorrowForecast.day.condition.text;
  const tomorrowHumidityValue = tomorrowForecast.day.avghumidity;
  const tomorrowWindValue = tomorrowForecast.hour[currentHour].wind_kph;

  nextDay.textContent = getDayName(1);
  tomorrowDate.textContent = formatDate(1);
  tomorrowTemp.textContent = `${tomorrowTempValue}°C`;
  tomorrowIcon.innerHTML = `<img src="${tomorrowIconValue}" alt="Weather Icon">`;
  tomorrowDescription.textContent = tomorrowCondition;
  tomorrowHumidity.textContent = `Humidity: ${tomorrowHumidityValue}%`;
  tomorrowWind.innerHTML = `<i class="fa-solid fa-wind"></i> ${tomorrowWindValue} km/h`;

  // ==========After Tomorrow's Weather==========
  const afterTomorrowForecast = forecastday[2];
  const afterTomorrowTempValue = afterTomorrowForecast.day.avgtemp_c;
  const afterTomorrowIconValue = afterTomorrowForecast.day.condition.icon;
  const afterTomorrowCondition = afterTomorrowForecast.day.condition.text;
  const afterTomorrowHumidityValue = afterTomorrowForecast.day.avghumidity;
  const afterTomorrowWindValue =
    afterTomorrowForecast.hour[currentHour].wind_kph;

  afterNextDay.textContent = getDayName(2);
  afterTomorrowDate.textContent = formatDate(2);
  afterTomorrowTemp.textContent = `${afterTomorrowTempValue}°C`;
  afterTomorrowIcon.innerHTML = `<img src="${afterTomorrowIconValue}" alt="Weather Icon">`;
  afterTomorrowDescription.textContent = afterTomorrowCondition;
  afterTomorrowHumidity.textContent = `Humidity: ${afterTomorrowHumidityValue}%`;
  afterTomorrowWind.innerHTML = `<i class="fa-solid fa-wind"></i> ${afterTomorrowWindValue} km/h`;
}
// Format day to e.g "Sunday"
function getDayName(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}
// Format date e.g "1 Jul"
function formatDate(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  return `${day} ${month}`;
}
