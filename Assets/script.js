
// get items from html for use in function sie. event listener and printing data
var search = document.querySelector(".search-btn");
var cityName = document.getElementById("cityName");
var currentTemp = document.getElementById("currentTemp");
var currentWind = document.getElementById("currentWind");
var currentHumidity = document.getElementById("currentHumidity");
// API key required for access
var APIKey = "1469a0fc17dbb9a6e1b4cc2b019e6b33";

// creating a function to check if the user has entered a city , country 
// If user does not write "City, Country", the incorrect city can be returned
//I have done this in a simple way as I have not yet learned about regex, but came acorss it in research
function inputAlert(input) {
    var cityCountryInput = input.split(",");

    return cityCountryInput.length === 2 &&
        cityCountryInput[0].trim().length > 0 &&
        cityCountryInput[1].trim().length > 0;
}

//fetch API to get data from Weather API
function getApiCurrent() {

    //calling the function that checks if the city, country has been entered correctly, if not- show an alert
    if (inputAlert(cityName.value) === false) {
        window.alert("Please write the name of your CITY, separated by a COMMA (,), followed by your COUNTRY name")
        return; //writing return will stop the api from returning the data if it is written incorrectly
    }


    // In order to recieve the correct CITY in the correct COUNTRY we will split the user input data
    //noting that the input having 2 values, separated by a comma has already been qualified in the inputAlert function
    var userInput = cityName.value.split(",")
    city = userInput[0].trim();
    country = userInput[1].trim();

    countryCode= countryList.code(country);
    if (!countryCode){
        window.alert("Please enter a valid Country")
    }

    //concatenating our user input, API key and required parameters to query url
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + countryCode + "&appid=" + APIKey + "&units=metric";

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data) //to check through the data that we have recieved in the response- can be removed

            // creating variables with the recieved data from the geo location- this api uses longitude and latitude
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            // here we are setting the text content of our elements (declared at the top of our script) to the data we have 
            // recieved from the API and creating the string to be added to that element id

            // I want the recieved data to have a different class than the title 'ie Temp:'

            var spanTemp = document.createElement("span"); //dynamically create a span element for the response data
            spanTemp.textContent = data.main.temp + " \u00B0C"; //unicode for the degree symbol added here to the text Content recieved
            spanTemp.classList.add("text-primary"); //adding a boostrap class to our new text content for the aesthetic value
            currentTemp.innerHTML = "Temp: "; //making sure the HTML is clear with only 'Temp:' inside it
            currentTemp.appendChild(spanTemp); //adding our new shiny, colourful span element containing the temp data from the API

            var spanWind = document.createElement("span");  //same process as above for wind data
            spanWind.textContent = data.wind.speed + " KPH";
            spanWind.classList.add("text-primary");
            currentWind.innerHTML = "Wind: ";
            currentWind.appendChild(spanWind);

            var spanHumidity = document.createElement("span");  //same process as above for humidity data
            spanHumidity.textContent = data.main.humidity + " %";
            spanHumidity.classList.add("text-primary");
            currentHumidity.innerHTML = "Humidity: ";
            currentHumidity.appendChild(spanHumidity);

            // Now we call our forecast function for the next 5 days, using those local latitude, longitude, and city parameters
            //The API documentation calls for this info for longer term forecasts 
            getApiForecast(lat, lon, city);
        })
};

function getApiForecast(lat, lon, city) {

    //concatenating our user input, API key and required parameters to query url
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("data = ", data);

            // currentTemp.textContent= `Temp: ${data.main.temp} \u00B0C`
            // currentWind.textContent= `Wind: ${data.wind.speed} KPH`
            // currentHumidity.textContent= `Humidity: ${data.main.humidity} %`

            for (var i = 0; i < data.list.length; i++) {
                if (i % 8 === 0) {
                    //create element
                    //assign list.ie temp --- list.ie wind [i]
                }
            }




        })
}


// event listener on click run function 
search.addEventListener("click", getApiCurrent)
