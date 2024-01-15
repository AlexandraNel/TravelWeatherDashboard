
// get items from html for use in function sie. event listener and printing data
var search = document.querySelector(".search-btn");
var cityName = document.getElementById("cityName");
var currentTemp = document.getElementById("currentTemp");
var currentWind = document.getElementById("currentWind");
var currentHumidity = document.getElementById("currentHumidity");
var locationHeader = document.getElementById("locationHeader");
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

    countryCode = countryList.code(country);
    // handles if the incorrect city is entered ie. it does not exist. returns after so that incorrect city is not displayed
    if (!countryCode) {
        window.alert("Please enter a valid Country")
        return
    }

    //concatenating our user input, API key and required parameters to query url
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + countryCode + "&appid=" + APIKey + "&units=metric";

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
                // handles if the incorrect city is entered ie. it does not exist
            } else { alert("Please enter a valid city"); }

        })

        .then(function (data) {
            console.log(data) //to check through the data that we have recieved in the response- can be removed

            // creating variables with the recieved data from the geo location- this api uses longitude and latitude
            //we need to pass this data through to our 5 day forecast which we will do at the end of this function
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            // grabbing the date which is in unix and converting it for use in a variable
            var unixTimestamp= data.dt;
            var dateConvert= new Date(unixTimestamp*1000);
            var date = dateConvert.toLocaleDateString("en-GB");
         
            // here we are filling the text content of our elements (declared at the top of our script) to the data we have 
            // recieved from the API. We create a new span element in order to style it differently and dynamically using 
            //bootstrap class as well as replace the title 'Your Location' with the current area displayed

            locationHeader.innerHTML = (city + ", " + country + ". " + date);

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

            // Because the 5 day forecast requires longitude and latitude location data, we have captured it within variables
            //These variables are now being passed to our getApiForecast function
            getApiForecast(lat, lon);
        })
};

function getApiForecast(lat, lon) {

    //concatenating our user input, API key and required parameters to query url, using lon and lat data from previous funtion
    var daysQueryUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric";

    fetch(daysQueryUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("data = ", data); //console logging data with title 'data=' can be removed- for my own benefit

            // response returns 40 objects within an array (8 results for 5days).
            // I want the 12pm forecast of each day, loop at [2] which is 12pm today. 
            // Increments in 8's so i have i have writte i+=8 to get each days 12 noon.
            
            for (var i = 2; i < data.list.length; i += 8) {



                //create element
                //assign list.ie temp --- list.ie wind [i]
            }
    //     }

    //         var spanTemp = document.createElement("span"); //dynamically create a span element for the response data
    // spanTemp.textContent = data.main.temp + " \u00B0C"; //unicode for the degree symbol added here to the text Content recieved
    // spanTemp.classList.add("text-primary"); //adding a boostrap class to our new text content for the aesthetic value
    // currentTemp.innerHTML = "Temp: "; //making sure the HTML is clear with only 'Temp:' inside it
    // currentTemp.appendChild(spanTemp); //adding our new shiny, colourful span element containing the temp data from the API

    // //             // currentTemp.textContent= `Temp: ${data.main.temp} \u00B0C`
    // //             // currentWind.textContent= `Wind: ${data.wind.speed} KPH`
    // //             // currentHumidity.textContent= `Humidity: ${data.main.humidity} %`





})
}


// event listener on click run function 
search.addEventListener("click", getApiCurrent)
