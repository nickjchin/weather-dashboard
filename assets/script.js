var requestURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
var APIKey = "6f065262c75beb86075b18e78e909e50";
var city;

var submitButton = $("#search-button");
var searchHistoryEl = document.querySelector(".search-history");

//Get user city input and save to localStorage
submitButton.on("click", function (event) {
  event.preventDefault();
  console.log("here");
  city = document.getElementById("user-city").value;
  console.log("user-city: " + city);
  localStorage.setItem("city", city);

  // Add city to search history
  var cityButton = document.createElement("button");
  cityButton.setAttribute("class", "btn btn-secondary mt-4 text-darkgray");
  var cityButtonText = localStorage.getItem("city");
  cityButton.innerHTML = cityButtonText;
  cityButton.setAttribute("id", cityButtonText);
  searchHistoryEl.appendChild(cityButton);

  return city;
  getWeather();
});

// Pass city and API key into:
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// function getWeather(city, APIKey){
//     fetch(function (response){
//         return response.json();
//     })
//     .then function(data){

//     }
// };
