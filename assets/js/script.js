
var searchHistory = []
var weatherCall = "https://api.openweathermap.org/"
var searchInput = document.querySelector("#search-input")
var searchForm = document.querySelector("form")
var today = document.querySelector("#today")
var forecast = document.querySelector("#forecast")
var apiKey = "1382162e354e1320109c2cb84c66834d"

// Get the weather from the API endpoint using the API Key and location
// API sends weather forecast info, then info is appended to today, as well as the 5 day forecast

function submitForm(e) {
    e.preventDefault()
    if (searchInput.value.length > 1) {
        //geocode search for city name to get the lat/long
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchInput.value}&appid=${apiKey}`)
            .then(response => response.json())
            .then(geoData => {
                const lat = geoData[0].lat
                const long = geoData[0].lon
                //use lat and long to get weather
                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(data => {
                        displayCurrent(geoData, data) 
                    })
            });
        // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
        // console.log(searchInput.value)
    }

} 

function displayCurrent(geoData, data) {
    console.log(data)
    console.log(geoData)
    console.log(new Date())
    today.innerHTML = ""

    const currentDate = new Date()
    const day = currentDate.getDate()
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()
    const formattedDate = `${month+1}/${day}/${year}`

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
    console.log({city, date, icon, temp, humidity, windSpeed, uvIndex})
}
// fetchForecast = 

// fetch 



searchForm.addEventListener("submit", submitForm)