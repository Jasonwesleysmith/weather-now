var searchHistory = []
var weatherCall = "https://api.openweathermap.org/"
var apiKey = "1382162e354e1320109c2cb84c66834d"
var searchInput = document.querySelector("#search-input")
var searchForm = document.querySelector("form")
var today = document.querySelector("today")
var forecast = document.querySelector("forecast")

// Get the weather from the API endpoint using the API Key and location
// API sends weather forcast info, then info is appended to today, as well as the 5 day forecast

function submitForm(e) {
    e.preventDefault()
    if (searchInput.value.length > 1) {
        console.log(searchInput.value)
    }

} 

searchForm.addEventListener("submit", submitForm)