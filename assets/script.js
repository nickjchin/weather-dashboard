var APIKey = "6f065262c75beb86075b18e78e909e50";
var city = document.getElementById("user-city");
var lat;
var lon;

var submitButton = $("#search-button");
var searchHistoryEl = document.querySelector(".search-history");
var currentWeatherContainer = document.querySelector(".current-conditions");
var forecastContainer = document.querySelector(".forecast");

var tomorrow = document.getElementById("1");
var dayAfterTomorrow = document.getElementById("2");
var thirdDay = document.getElementById("3");
var fourthDay = document.getElementById("4");
var fifthDay = document.getElementById("5");

window.onload = function () {
  localStorage.clear();
};

//Get user city input and save to localStorage
submitButton.on("click", function (event) {
  newCity = city.value;
  console.log("user-city: " + newCity);

  var existingCities = JSON.parse(localStorage.getItem("allCities"));
  if (existingCities == null) existingCities = [];
  localStorage.setItem("city", JSON.stringify(newCity));
  resetCityWeather();
  existingCities.push(newCity);
  localStorage.setItem("allCities", JSON.stringify(existingCities));

  console.log(existingCities);

  // Get Localstorage and render it in box

  // Add city to search history
  var cityButton = document.createElement("button");
  cityButton.setAttribute("class", "my-button btn btn-secondary mt-4 text-darkgray");
  var cityButtonText = JSON.parse(localStorage.getItem("city"));
  cityButton.innerHTML = cityButtonText.charAt(0).toUpperCase() + cityButtonText.slice(1);
  cityButton.setAttribute("id", cityButtonText, "onclick");
  searchHistoryEl.appendChild(cityButton);
  var cityName = newCity;
  getWeather(cityName);
});

// Get Current Weather data for submitted city
function getWeather(cityName) {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&units=imperial&appid=" +
      APIKey
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
      var todaysWeath = data.weather[0].icon;
      var todaysWeathImg = document.createElement("img");
      todaysWeathImg.src = "https://openweathermap.org/img/wn/" + todaysWeath + "@2x.png";

      // console.log(todaysWeath);

      currentWeatherContainer.classList.add("border", "border-dark", "p-2", "m-2");
      currentCityEl = document.createElement("h1");
      currentCityEl.classList.add(lat, lon);
      currentCityEl.setAttribute("id", "currentCity");
      currentTempEl = document.createElement("h2");
      currentTempEl.setAttribute("id", "currentTemp");
      currentWindEl = document.createElement("h2");
      currentWindEl.setAttribute("id", "currentWind");
      currentHumidityEl = document.createElement("h2");
      currentHumidityEl.setAttribute("id", "currentHum");

      currentCityEl.textContent = weatherData.name + " (" + today + ")";
      currentCityEl.append(todaysWeathImg);
      currentTempEl.textContent = "Temp: " + Math.round(weatherData.main.temp) + "\u00B0F";
      currentWindEl.textContent = "Wind: " + weatherData.wind.speed + "  MPH";
      currentHumidityEl.textContent = "Humidity: " + weatherData.main.humidity + "%";

      currentWeatherContainer.append(
        currentCityEl,
        currentTempEl,
        currentWindEl,
        currentHumidityEl
      );
      getUV(lat, lon);
      forecast(lat, lon);
    });
}

function resetCityWeather() {
  var existingCities = JSON.parse(localStorage.getItem("allCities"));
  if (existingCities) {
    if (existingCities.length > 0 && existingCities !== null) {
      var removeCurrentCity = document.getElementById("currentCity");
      removeCurrentCity.remove();
      var removeCurrentTemp = document.getElementById("currentTemp");
      removeCurrentTemp.remove();
      var removeCurrentWind = document.getElementById("currentWind");
      removeCurrentWind.remove();
      var removeCurrentHum = document.getElementById("currentHum");
      removeCurrentHum.remove();
      var removeCurrentUV = document.getElementById("currentUV");
      removeCurrentUV.remove();
      forecastTitle.textContent = "";
      var removeTomorrow = document.getElementById("day1");
      removeTomorrow.remove();
      var removeDayAfterTomorrow = document.getElementById("day2");
      removeDayAfterTomorrow.remove();
      var removeThirdDay = document.getElementById("day3");
      removeThirdDay.remove();
      var removeFourthDay = document.getElementById("day4");
      removeFourthDay.remove();
      var removeFifthDay = document.getElementById("day5");
      removeFifthDay.remove();
    }
  }
}

$(document).on("click", ".my-button", function () {
  resetCityWeather();
  var cityName = $(this).attr("id");
  getWeather(cityName);
});

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
      currentUVIndexEl.setAttribute("id", "currentUV");
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

      for (var i = 1; i < 5; i++) {
        // want to skip 0 as 0 is today
        // console.log(data.daily[i].temp);
        if ((i = 1)) {
          day1Container = document.createElement("div");
          day1Container.setAttribute("id", "day1");
          date1 = document.createElement("h3");
          date1.textContent = moment().add(1, "day").format("l");
          temp1 = document.createElement("h4");
          temp1.textContent = "Temp: " + Math.round(days[i].temp.day) + "\u00B0F";
          weathImg1 = document.createElement("img");
          weath1 = days[i].weather[0].icon;
          // console.log(weath1);
          weathImg1.src = "https://openweathermap.org/img/wn/" + weath1 + "@2x.png";
          wind1 = document.createElement("h4");
          wind1.textContent = "Wind: " + days[i].wind_speed + " MPH";
          humid1 = document.createElement("h4");
          humid1.textContent = "Humidity: " + days[i].humidity + "%";
          day1Container.append(date1, weathImg1, temp1, wind1, humid1);
          tomorrow.append(day1Container);
        }
        if ((i = 2)) {
          day2Container = document.createElement("div");
          day2Container.setAttribute("id", "day2");
          date2 = document.createElement("h3");
          date2.textContent = moment().add(2, "day").format("l");
          temp2 = document.createElement("h4");
          temp2.textContent = "Temp: " + Math.round(days[i].temp.day) + "\u00B0F";
          weathImg2 = document.createElement("img");
          weath2 = days[i].weather[0].icon;
          weathImg2.src = "https://openweathermap.org/img/wn/" + weath2 + "@2x.png";
          wind2 = document.createElement("h4");
          wind2.textContent = "Wind: " + days[i].wind_speed + " MPH";
          humid2 = document.createElement("h4");
          humid2.textContent = "Humidity: " + days[i].humidity + "%";
          day2Container.append(date2, weathImg2, temp2, wind2, humid2);
          dayAfterTomorrow.append(day2Container);
        }
        if ((i = 3)) {
          day3Container = document.createElement("div");
          day3Container.setAttribute("id", "day3");
          date3 = document.createElement("h3");
          date3.textContent = moment().add(3, "day").format("l");
          temp3 = document.createElement("h4");
          temp3.textContent = "Temp: " + Math.round(days[i].temp.day) + "\u00B0F";
          weathImg3 = document.createElement("img");
          weath3 = days[i].weather[0].icon;
          weathImg3.src = "https://openweathermap.org/img/wn/" + weath3 + "@2x.png";
          wind3 = document.createElement("h4");
          wind3.textContent = "Wind: " + days[i].wind_speed + " MPH";
          humid3 = document.createElement("h4");
          humid3.textContent = "Humidity: " + days[i].humidity + "%";
          day3Container.append(date3, weathImg3, temp3, wind3, humid3);
          thirdDay.append(day3Container);
        }
        if ((i = 4)) {
          day4Container = document.createElement("div");
          day4Container.setAttribute("id", "day4");
          date4 = document.createElement("h3");
          date4.textContent = moment().add(4, "day").format("l");
          temp4 = document.createElement("h4");
          temp4.textContent = "Temp: " + Math.round(days[i].temp.day) + "\u00B0F";
          weathImg4 = document.createElement("img");
          weath4 = days[i].weather[0].icon;
          weathImg4.src = "https://openweathermap.org/img/wn/" + weath4 + "@2x.png";
          wind4 = document.createElement("h4");
          wind4.textContent = "Wind: " + days[i].wind_speed + " MPH";
          humid4 = document.createElement("h4");
          humid4.textContent = "Humidity: " + days[i].humidity + "%";
          day4Container.append(date4, weathImg4, temp4, wind4, humid4);
          fourthDay.append(day4Container);
        }
        if ((i = 5)) {
          day5Container = document.createElement("div");
          day5Container.setAttribute("id", "day5");
          date5 = document.createElement("h3");
          date5.textContent = moment().add(5, "day").format("l");
          temp5 = document.createElement("h4");
          temp5.textContent = "Temp: " + Math.round(days[i].temp.day) + "\u00B0F";
          weathImg5 = document.createElement("img");
          weath5 = days[i].weather[0].icon;
          weathImg5.src = "https://openweathermap.org/img/wn/" + weath5 + "@2x.png";
          wind5 = document.createElement("h4");
          wind5.textContent = "Wind: " + days[i].wind_speed + " MPH";
          humid5 = document.createElement("h4");
          humid5.textContent = "Humidity: " + days[i].humidity + "%";
          day5Container.append(date5, weathImg5, temp5, wind5, humid5);
          fifthDay.append(day5Container);
        }
      }
    });
}
