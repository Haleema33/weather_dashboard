document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const cityInput = document.getElementById('city');
    const currentWeatherDiv = document.getElementById('current-weather');
    const forecastDiv = document.getElementById('forecast');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const city = cityInput.value;
        if (city) {
            fetchWeather(city);
        }
    }); // Removed extra closing parenthesis here

    function fetchWeather(city) {
        fetch(`fetchWeather.php?city=${city}`)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
                localStorage.setItem('lastCity', city);
            })
            .catch(error => {
                currentWeatherDiv.innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
            });
    }

    function displayWeather(data) {
        if (data.cod === '404') {
            currentWeatherDiv.innerHTML = `<p>City not found.</p>`;
            return;
        }

        const { main, name, weather, wind } = data;
        currentWeatherDiv.innerHTML = `
            <h2>${name}</h2>
            <p>Temperature: ${main.temp} °C</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${wind.speed} m/s</p>
            <img src="http://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}">
            <p>${weather[0].description}</p>
        `;

        // Fetch 5-day forecast
        fetch(`fetchWeather.php?city=${name}&forecast=true`)
            .then(response => response.json())
            .then(data => {
                displayForecast(data);
            });
    }

    function displayForecast(data) {
        forecastDiv.innerHTML = '<h3>5-Day Forecast</h3>';
        data.list.forEach(item => {
            forecastDiv.innerHTML += `
                <div>
                    <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
                    <p>Temperature: ${item.main.temp} °C</p>
                    <p>${item.weather[0].description}</p>
                    <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                </div>
            `;
        });
    }

    // Load last searched city from local storage
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        fetchWeather(lastCity);
    }
});
