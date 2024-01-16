
// get items from html for use in function sie. event listener and printing data
var search = document.querySelector(".search-btn");
var cityName = document.getElementById("cityName");
var currentTemp = document.getElementById("currentTemp");
var currentWind = document.getElementById("currentWind");
var currentHumidity = document.getElementById("currentHumidity");
var locationHeader = document.getElementById("locationHeader");
var forecastDay = document.querySelectorAll(".forecast-day"); //get all the list items for forecast
var rainboxImg = document.createElement("img");
rainboxImg.src = "./Assets/favicon.ico";
var daysIndex = 0; //global counter to iterate trhough data for forecasts
var leftColumn = document.getElementById("search-bar");

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
    //if true call my save to local storage function called 'savedSearch
    if (inputAlert(cityName.value)) {
        savedSearch(cityName.value);
    } else {
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
        // handles if the incorrect city is entered ie. it does not exist

        .then(function (response) {
            if (response.ok) {
                return response.json();

            } else { alert("Please enter a valid city"); }

        })

        .then(function (data) {
            console.log(data) //to check through the data that we have recieved in the response- can be removed

            // creating variables with the recieved data from the geo location- this api uses longitude and latitude
            //we need to pass this data through to our 5 day forecast which we will do at the end of this function
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            // grabbing the date which is in unix and converting it for use in a variable
            var unixTimestamp = data.dt;
            var dateConvert = new Date(unixTimestamp * 1000);
            var date = dateConvert.toLocaleDateString("en-GB", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // here we are filling the text content of our elements (declared at the top of our script) to the data we have 
            // recieved from the API. We create a new span element in order to style it differently and dynamically using 
            //bootstrap class as well as replace the title 'Your Location' with the current area displayed

            locationHeader.innerHTML = (city + ", " + country + "<br>" + date);

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
            //These variables are now being passed to our getApiForecast function incl city and country data
            getApiForecast(lat, lon, city, country);
        })
};

function getApiForecast(lat, lon, city, country) {

    //concatenating our user input, API key and required parameters to query url, using lon and lat data from previous funtion
    var daysQueryUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric";

    fetch(daysQueryUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("No response, please try again")
            } return response.json()
        })

        .then(function (data) {
            console.log("data = ", data); //console logging data with title 'data=' can be removed- for my own benefit


            // response returns 40 objects within an array (8 results for 5days).
            // I want the 12pm forecast of each day, loop at [3] which is 12pm today. 
            // Increments at every 8th entry to get 12 noon for each day
            for (var i = 3; i < data.list.length; i += 8) {
                //save the data list arrays in a variable
                var forecast = data.list[i];
                console.log(forecast); //checking if i actually get 12pm

                //given an abbreviated method for the date conversion
                //putting all my required data into variables
                var forecastDate = new Date(forecast.dt * 1000).toLocaleDateString("en-GB", {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                var forecastTemp = forecast.main.temp;
                var forecastWind = forecast.wind.speed;
                var forecastHumidity = forecast.main.humidity;
                var forecastLocation = city + " " + country;

                createElements(forecastDate, forecastTemp, forecastWind, forecastHumidity, forecastLocation);
            }
        })
        //advised to catch any errors from the API retrieval
        .catch(function (error) {
            console.error("Error in fetch", error);
            alert.error("Error with forecast, please try again");
        })
};

//function to use on each piece of data parsed from previous function 
function createElements(forecastDate, forecastTemp, forecastWind, forecastHumidity, forecastLocation) {

    //if statement using global index counter variable
    //if the counter is less than the amount of forecast list items then use this function
    if (daysIndex < forecastDay.length) {

        //list item is our list item class by how many there are
        var listItem = forecastDay[daysIndex]

        //clear existing content
        listItem.innerHTML = "";

        // create a header
        var forecastHeader = document.createElement("h6");
        forecastHeader.innerHTML = forecastDate + "<br>" + forecastLocation;
        forecastHeader.classList.add("text-primary");
        listItem.appendChild(forecastHeader);

        var temp = document.createElement("p");
        temp.textContent = "Temp: " + forecastTemp + " \u00B0C";
        listItem.appendChild(temp);

        var wind = document.createElement("p");
        wind.textContent = "Wind: " + forecastWind + " KPH";
        listItem.appendChild(wind);

        var humidity = document.createElement("p");
        humidity.textContent = "Humidity: " + forecastHumidity + " %";
        listItem.appendChild(humidity);

        daysIndex++;
    }
};

///this function is having the user input search values passed into it within the getApiCurrent
//the parameter has been named similarly for legibility
function savedSearch(cityName) {

    //retrieve existing data if in local storage, if not create an empty array
    //push new data to the array we either retrieved or made during parse
    //set the local storage data 
    var searches = JSON.parse(localStorage.getItem('citySearched')) || [];
    searches.push(cityName);
    localStorage.setItem('citySearched', JSON.stringify(searches));

    savedSearchButtons(searches);

}

//calling the buttons on page load- again help with this one as I coudlnt do it myself!
function callButtons(){
    var savedSearches = JSON.parse(localStorage.getItem('citySearched')) || [];
    savedSearchButtons(savedSearches);
}

// Call this function to load saved searches when the page loads
callButtons();


//had a LOT of help with this function as I was very very stuck
function savedSearchButtons(searches) {
    searches.forEach(function (citySearched) {
        // Check if a button for this city already exists with query selector data-city, if it DOESNT, then keep going
        if (!document.querySelector(`button[data-city='${citySearched}']`)) {

            var memoryButton = document.createElement("button");//create button
            memoryButton.textContent = citySearched; // Set button text to the saved city name
            memoryButton.classList.add("search-btn", "btn", "btn-info", "fw-bold"); // Adding Bootstrap classes
             // This sets attricbutes of the city name and 'data-city', this allows us to differentiate repeats
            memoryButton.setAttribute('data-city', citySearched);

            // Adding an event listener to each button
            memoryButton.addEventListener('click', function() {
                cityName.value = citySearched; // Set the input field to the saved city name
                getApiCurrent(); // Trigger the search
            });

            leftColumn.appendChild(memoryButton); // Append the button
        }
    });
}

 

// event listener on click run function 
search.addEventListener("click", getApiCurrent)

//local storage
// -if input is valid save as a button append underneath serach input area
//save the search parameter to local storage
//on click return search parameter results from local storage


