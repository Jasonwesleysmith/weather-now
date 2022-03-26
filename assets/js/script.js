
var searchInput = document.querySelector("#search-input")
var searchForm = document.querySelector("form")
var today = document.querySelector("#today")
var forecast = document.querySelector("#forecast")
var historyContainer = document.querySelector("#history")
var apiKey = "1382162e354e1320109c2cb84c66834d"

// Get the weather from the API endpoint using the API Key and location
// API sends weather forecast info, then info is appended to today, as well as the 5 day forecast

function submitForm(e) {
    e.preventDefault()
    if (searchInput.value.length > 1) {
        //geocode search for city name to get the lat/long
        fetchWeather(searchInput.value)
    }
}

function fetchWeather(city) {
   
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(geoData => {
            
            const lat = geoData[0].lat
            const long = geoData[0].lon
            //use lat and long to get weather
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    displayCurrent(geoData, data)
                    displayForecast(data)
                    saveSearch(city)
                })
        });
}

function displayCurrent(geoData, data) {
    today.innerHTML = ""

    const currentDate = new Date()
    const day = currentDate.getDate()
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()
    const formattedDate = `${month + 1}/${day}/${year}`

    const topContainer = document.createElement("div")
    topContainer.classList.add("top-container")

    const city = document.createElement("h3")
    city.innerHTML = `${geoData[0].name}, ${geoData[0].state ? geoData[0].state : geoData[0].country}`

    const date = document.createElement("span")
    date.innerHTML = formattedDate
    date.classList.add('date')

    const icon = document.createElement("img")
    icon.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
    icon.classList.add("current-icon")

    topContainer.append(city, date, icon)

    const temp = document.createElement("div")
    temp.innerHTML = `Temp: ${data.current.temp}`

    const humidity = document.createElement("div")
    humidity.innerHTML = `Humidity: ${data.current.humidity}%`

    const windSpeed = document.createElement("div")
    windSpeed.innerHTML = `Wind: ${data.current.wind_speed} MPH`

    const uvIndex = document.createElement("div")
    uvIndex.innerHTML = `UV index: ${data.current.uvi}`

    today.append(topContainer, temp, humidity, windSpeed, uvIndex)

}

function displayForecast(data) {
    forecast.innerHTML = ""

    data.daily.forEach((day, i) => {
        if (i <= 4) {
            const currentDate = new Date()
            const date = currentDate.getDate()
            const month = currentDate.getMonth()
            const year = currentDate.getFullYear()
            const formattedDate = `${month + 1}/${date + (i + 1)}/${year}`

            const card = document.createElement("div")
            card.classList.add('card')

            const futureDate = document.createElement("h4")
            futureDate.innerHTML = formattedDate

            const highTemp = document.createElement("div")
            highTemp.innerHTML = data.daily[i].temp.max

            const lowTemp = document.createElement("div")
            lowTemp.innerHTML = data.daily[i].temp.min

            const wind = document.createElement("div")
            wind.innerHTML = `${data.daily[i].wind_speed} MPH`

            const humidity = document.createElement("div")
            humidity.innerHTML = `${data.daily[i].humidity}%`

            const icon = document.createElement("img")
            icon.src = `http://openweathermap.org/img/wn/${data.daily[0].weather[0].icon}@2x.png`
            icon.classList.add("forecast-icon")

            card.append(futureDate, highTemp, lowTemp, wind, humidity, icon)

            forecast.append(card)
        }
    })

}

function saveSearch(search) {
    const prevSearchArr = JSON.parse(localStorage.getItem("searchArr"))
    const saveSearchArr = prevSearchArr ? [search, ...prevSearchArr] : [search]
  
    let uniqueSearch = [];
    saveSearchArr.forEach((s) => {
        if (!uniqueSearch.includes(s)) {
            uniqueSearch.push(s);
        }
    });
    if(uniqueSearch.length >= 10) uniqueSearch.pop()

    localStorage.setItem("searchArr", JSON.stringify(uniqueSearch))
    displayHistory(uniqueSearch)
   
}

function checkLocalStorage() {
    const prevSearchArr = JSON.parse(localStorage.getItem("searchArr"))
    //display in dom
    if (prevSearchArr) {
        displayHistory(prevSearchArr)
    }
}

function displayHistory(arr) {
    historyContainer.innerHTML = ""
    arr.forEach(item => {
        const historyItem = document.createElement('button')
        historyItem.classList.add('history-item')
        historyItem.innerHTML = item
        historyItem.addEventListener('click', () => fetchWeather(item))
        historyContainer.append(historyItem)
    })
}


checkLocalStorage()

//on load query local storage and display stored searches

searchForm.addEventListener("submit", submitForm)