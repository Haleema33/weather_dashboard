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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data.');
                }
                return response.json();
            })
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

        const { main, name, weather, wind,dt } = data;
       const dateTime = dt ? new Date(dt * 1000).toLocaleString() : 'N/A';
       
        currentWeatherDiv.innerHTML = `
        <div class="weather-card" onclick="moveCartoon(this)" >
        <h2 style="text-align: left;">${name}</h2>
 
            
            <h3>Current Time:  ${dateTime} <br>
            Temperature:  ${main.temp} °C  <br>
            Humidity:  ${main.humidity}%  <br>
            Wind Speed:  ${wind.speed} m/s</h3>
            <img src="http://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}">
            <h3>${weather[0].description}</h3>
            </div>
            <div class="animation-container">
            <img class="cartoon-image" src="images/LXANLPAI_output_1.jpeg" alt="Cartoon Image">
</div>
            </div>
        `;

        // Fetch 5-day forecast
        fetch(`fetchWeather.php?city=${name}&forecast=true`)
            .then(response => response.json())
            .then(data => {
                displayForecast(data);
            });
    }

    function displayForecast(data) {
         // Group forecast data by date
         const forecastByDate = data.list.reduce((acc, item) => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(item);
            return acc;
        }, {});

        forecastDiv.innerHTML = '<h3>5-Day Forecast</h3>';
        for (const date in forecastByDate) {
            forecastDiv.innerHTML += `
                <div class="forecast-card">
                    <h4>${date}</h4>
                    <div class="weather-container">
                        ${forecastByDate[date].map(item => `
                            <div>
                                <p>${new Date(item.dt * 1000).toLocaleTimeString()}</p>
                                <p>Temperature: ${item.main.temp} °C</p>
                                <p>${item.weather[0].description}</p>
                                <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    // Load last searched city from local storage
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        fetchWeather(lastCity);
    }
})

function moveCartoon(card) {
    const cartoonImage = card.querySelector('.cartoon-image');
    cartoonImage.style.animation = 'moveCartoonImage 2s ease forwards';
    setTimeout(() => {
        cartoonImage.style.animation = ''; // Reset animation after completion
    }, 2000); // Adjust timing to match animation duration
}




;
