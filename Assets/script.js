
// get the button for event listener
var search = document.querySelector(".search-btn");
var cityName = document.getElementById("cityName");
var currentTemp = document.getElementById("currentTemp");
var currentWind = document.getElementById("currentWind");
var currentHumidity = document.getElementById("currentHumidity");
// API key required for access
var APIKey = "1469a0fc17dbb9a6e1b4cc2b019e6b33";

//fetch API to get data from Weather API
function getApiCurrent() {

    // variable for city- this comes from user input
    var city = cityName.value;
    var lat, lon;

    
    //concatenating our user input, API key and required parameters to query url
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
            .then(function (data) {
                console.log(data)

                lat= data.coord.lat;
                lon= data.coord.lon;
                currentTemp.textContent= `Temp: ${data.main.temp} \u00B0C`
                currentWind.textContent= `Wind: ${data.wind.speed} KPH`
                currentHumidity.textContent= `Humidity: ${data.main.humidity} %`
           
         getApiForecast(lat,lon, city);           
        })
};

function getApiForecast(lat, lon, city){
      
    //concatenating our user input, API key and required parameters to query url
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
            .then(function (data) {
                console.log("data = ", data );

                // currentTemp.textContent= `Temp: ${data.main.temp} \u00B0C`
                // currentWind.textContent= `Wind: ${data.wind.speed} KPH`
                // currentHumidity.textContent= `Humidity: ${data.main.humidity} %`

           for(var i = 0; i < data.list.length; i++){
            if (i%8 === 0)  {
                //create element
                //assign list.ie temp --- list.ie wind [i]
            }
           }     


           
                  
        })
}


// event listener on click run function 
search.addEventListener("click", getApiCurrent)

//include state

// fetch(requestUrl)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       for (var i = 0; i < data.length; i++) {
//         var listItem = document.createElement('li');
//         listItem.textContent = data[i].html_url;
//         repoList.appendChild(listItem);
//       }
//     });
// }