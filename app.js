const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files, including styles.css

const port = 8000;
const apiKey = "48bdcc465d71a862c32e2589440a1080";

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/current-location', (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetchWeatherData(res, weatherUrl, forecastUrl, "Your Current Location");
});

app.post('/', (req, res) => {
    const query = req.body.city;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&appid=${apiKey}`;

    fetchWeatherData(res, weatherUrl, forecastUrl, query);
});

function fetchWeatherData(res, weatherUrl, forecastUrl, locationName) {
    https.get(weatherUrl, function (weatherResponse) {
        let weatherData = '';
        weatherResponse.on("data", function (chunk) {
            weatherData += chunk;
        });
        weatherResponse.on("end", function () {
            const currentWeather = JSON.parse(weatherData);

            https.get(forecastUrl, function (forecastResponse) {
                let forecastData = '';
                forecastResponse.on("data", function (chunk) {
                    forecastData += chunk;
                });
                forecastResponse.on("end", function () {
                    const forecast = JSON.parse(forecastData);

                    res.write('<!DOCTYPE html>');
                    res.write('<html>');
                    res.write('<head>');
                    res.write('<title>Weather Details</title>');
                    res.write('<meta charset="utf-8">');
                    res.write('<link rel="stylesheet" href="styles.css">'); // Link to the external CSS file
                    res.write('<style>');
                    res.write('body { font-family: Arial, sans-serif; background-image: url("https://c1.wallpaperflare.com/preview/958/417/136/desktop-nature-sky-outdoors.jpg"); background-size: cover; background-repeat: no-repeat; background-attachment: fixed; margin: 0; }');
                    res.write('.weather-container { margin-top: 30px; text-align: center; }');
                    res.write('.weather-details { text-align: center; padding: 100px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); background-color: #fff; }');
                    res.write('.weather-details h1 { font-size: 45px; margin-top: 5px; color: red }');
                    res.write('.weather-details p { margin: 5px; font-size: 30px; }');
                    res.write('</style>');
                    res.write('</head>');
                    res.write('<body>');

                    res.write('<div class="weather-container">');
                    res.write('<div class="weather-details">');
                    res.write(`<h1>Weather Details for ${locationName}</h1>`);
                    res.write(`<p>Temperature: ${currentWeather.main.temp}°C</p>`);
                    res.write(`<p>Humidity: ${currentWeather.main.humidity}%</p>`);
                    res.write(`<p>Wind Speed: ${currentWeather.wind.speed} m/s</p>`);
                    res.write(`<p>Visibility: ${currentWeather.visibility} meters</p>`);
                    res.write(`<p>Pressure: ${currentWeather.main.pressure} hPa</p>`);
                    res.write(`<p>Description: ${currentWeather.weather[0].description}</p>`);

                    const sunriseTime = new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString();
                    const sunsetTime = new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString();
                    res.write(`<p>Sunrise Time: ${sunriseTime}</p>`);
                    res.write(`<p>Sunset Time: ${sunsetTime}</p>`);
                    
                    res.write('<h2>5-Day Forecast</h2>');

                    forecast.list.forEach((forecastItem, index) => {
                        if (index % 8 === 0) { // 8 * 3h intervals = 24h
                            const date = new Date(forecastItem.dt * 1000).toLocaleDateString();
                            const time = new Date(forecastItem.dt * 1000).toLocaleTimeString();
                            res.write(`<p>${date} ${time}</p>`);
                            res.write(`<p>Temperature: ${forecastItem.main.temp}°C</p>`);
                            res.write(`<p>Weather: ${forecastItem.weather[0].description}</p>`);
                            res.write('<hr>');
                        }
                    });

                    res.write('</div>');
                    res.write('</div>');
                    res.write('</body>');
                    res.write('</html>');
                    res.send();
                });
            });
        });
    });
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
