var APIKey = "6f065262c75beb86075b18e78e909e50";
var city = document.getElementById("user-city");
var lat;
var lon;

var submitButton = $("#search-button");
var searchHistoryEl = document.querySelector(".search-history");
var currentWeatherContainer = document.querySelector(".current-conditions");
var forecastContainer = document.querySelector(".forecast");

//Get user city input and save to localStorage
submitButton.on("click", function (event) {
  event.preventDefault();
  city = city.value;
  console.log("user-city: " + city);

  var existingCities = JSON.parse(localStorage.getItem("allCities"));
  if (existingCities == null) existingCities = [];
  localStorage.setItem("city", JSON.stringify(city));
  existingCities.push(city);
  localStorage.setItem("allCities", JSON.stringify(existingCities));

  city.value = "";

  // Add city to search history
  var cityButton = document.createElement("button");
  cityButton.setAttribute("class", "btn btn-secondary mt-4 text-darkgray");
  var cityButtonText = JSON.parse(localStorage.getItem("city"));
  cityButton.innerHTML = cityButtonText.charAt(0).toUpperCase() + cityButtonText.slice(1);
  cityButton.setAttribute("id", cityButtonText);
  searchHistoryEl.appendChild(cityButton);
  getWeather();
});

// Get Current Weather data for submitted city
function getWeather() {
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
      var today = moment().format("l");

      currentWeatherContainer.classList.add("border", "border-dark", "p-2", "m-2");
      currentCityEl = document.createElement("h1");
      currentCityEl.classList.add(lat, lon);
      currentTempEl = document.createElement("h2");
      currentWindEl = document.createElement("h2");
      currentHumidityEl = document.createElement("h2");

      currentCityEl.textContent = weatherData.name + " (" + today + ")";
      currentTempEl.textContent = "Temp: " + Math.round(weatherData.main.temp) + "\u00B0F";
      currentWindEl.textContent = "Wind: " + weatherData.wind.speed + " MPH";
      currentHumidityEl.textContent = "Humidity: " + weatherData.main.humidity + "%";

      currentWeatherContainer.append(currentCityEl);
      currentWeatherContainer.append(currentTempEl);
      currentWeatherContainer.append(currentWindEl);
      currentWeatherContainer.append(currentHumidityEl);

      getUV(lat, lon);
      forecast(lat, lon);
    });
}
function getUV(lat, lon) {
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=imperial&appid=" +
      APIKey
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      var uvData = data.current;

      currentUVIndexEl = document.createElement("h2");
      currentUVIndexEl.textContent = "UV Index: ";
      currentUVSpan = document.createElement("span");
      currentUVSpan.textContent = uvData.uvi;
      currentUVIndexEl.append(currentUVSpan);
      currentWeatherContainer.append(currentUVIndexEl);

      if ((uvData.uvi >= 0) & (uvData.uvi < 4)) {
        currentUVSpan.classList.add("px-2", "bg-success", "rounded");
      } else if (uvData.uvi < 7) {
        currentUVSpan.classList.add("px-2", "bg-warning", "rounded");
      } else {
        currentUVSpan.classList.add("px-2", "bg-danger", "rounded");
      }
    });
}
function forecast(lat, lon) {
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exlude=minutely,hourly,alerts&units=imperial&appid=" +
      APIKey
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.daily);
      var days = data.daily;

      forecastTitle = document.createElement("h2");
      forecastTitle.textContent = "5-day Forecast";
      forecastContainer.append(forecastTitle);

      var tomorrow = document.getElementById("1");
      var dayAfterTomorrow = document.getElementById("2");
      var thirdDay = document.getElementById("3");
      var fourthDay = document.getElementById("4");
      var fifthDay = document.getElementById("5");

      for (var i = 1; i < 5; i++) {
        // want to skip 0 as 0 is today
        // console.log(data.daily[i].temp);
        if ((i = 1)) {
          date1 = document.createElement("h3");
          date1.textContent = moment().add(1, "day").format("l");
          temp1 = document.createElement("h4");
          temp1.textContent = "Temp: " + Math.round(days[i].temp.day) + "\u00B0F";
          wind1.document.createElement("h4");
          wind1.textContent = "Wind: " + days[i].wind_speed + "MPH";
          humid1.document.createElement("h4");
          humid1.textContent = "Humidity: " + days[i].tomorrow.append(date1, temp1, wind1);
        }
        if ((i = 2)) {
          date2 = document.createElement("h3");
          date2.textContent = moment().add(2, "day").format("l");
          dayAfterTomorrow.append(date2);
        }
        if ((i = 3)) {
          date3 = document.createElement("h3");
          date3.textContent = moment().add(3, "day").format("l");
          thirdDay.append(date3);
        }
        if ((i = 4)) {
          date4 = document.createElement("h3");
          date4.textContent = moment().add(4, "day").format("l");
          fourthDay.append(date4);
        }
        if ((i = 5)) {
          date5 = document.createElement("h3");
          date5.textContent = moment().add(5, "day").format("l");
          fifthDay.append(date5);
        }
      }
    });
}
