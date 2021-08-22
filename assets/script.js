var APIKey = "6f065262c75beb86075b18e78e909e50";
var city = document.getElementById("user-city");
var lat;
var lon;

var submitButton = $("#search-button");
var searchHistoryEl = document.querySelector(".search-history");
var currentWeatherContainer = document.querySelector(".current-conditions");

//Get user city input and save to localStorage
submitButton.on("click", function (event) {
  event.preventDefault();
  city = city.value;
  console.log("user-city: " + city);
  localStorage.setItem("city", city);

  // Add city to search history
  var cityButton = document.createElement("button");
  cityButton.setAttribute("class", "btn btn-secondary mt-4 text-darkgray");
  var cityButtonText = localStorage.getItem("city");
  cityButton.innerHTML = cityButtonText;
  cityButton.setAttribute("id", cityButtonText);
  searchHistoryEl.appendChild(cityButton);
  currentWeather();
  return city;
});

// Get Current Weather data for submitted city
function currentWeather() {
  fetch(
    "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var weatherData = data;
      var lat = data.coord.lat;
      var lon = data.coord.lon;

      currentWeatherContainer.classList.add("border", "border-dark", "p-2", "m-2");
      currentCityEl = document.createElement("h1");
      currentCityEl.classList.add(lat, lon);
      currentTempEl = document.createElement("h2");
      currentWindEl = document.createElement("h2");
      currentHumidityEl = document.createElement("h2");

      currentCityEl.textContent = weatherData.name;
      currentTempEl.textContent = "Temp: " + Math.round(weatherData.main.temp) + "\u00B0F";
      currentWindEl.textContent = "Wind: " + weatherData.wind.speed + " MPH";
      currentHumidityEl.textContent = "Humidity: " + weatherData.main.humidity + "%";

      currentWeatherContainer.append(currentCityEl);
      currentWeatherContainer.append(currentTempEl);
      currentWeatherContainer.append(currentWindEl);
      currentWeatherContainer.append(currentHumidityEl);

      getUV(lat, lon);
      // next5Days();
    });
}
function getUV(lat, lon) {
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      APIKey
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var uvData = data.current;

      currentUVIndexEl = document.createElement("h2");
      currentUVIndexEl.textContent = "UV Index: ";
      currentUVSpan = document.createElement("span");
      currentUVSpan.textContent = uvData.uvi;
      currentUVIndexEl.append(currentUVSpan);
      currentWeatherContainer.append(currentUVIndexEl);

      if ((uvData.uvi > 0) & (uvData.uvi < 4)) {
        currentUVSpan.classList.add("px-2", "bg-success", "rounded");
      } else if (uvData.uvi < 7) {
        currentUVSpan.classList.add("px-2", "bg-warning", "rounded");
      } else {
        currentUVSpan.classList.add("px-2", "bg-danger", "rounded");
      }
    });
}
