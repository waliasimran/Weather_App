const express = require('express');
const https = require('https');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
const port = 8000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post('/', (req, res) => {
    const query = req.body.city;
    const apiKey = "48bdcc465d71a862c32e2589440a1080";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=metric&appid=" + apiKey;

    https.get(url, function (response) {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);

            res.write('<!DOCTYPE html>');
            res.write('<html>');
            res.write('<head>');
            res.write('<title>WEATHER DETAILS</title>');
            res.write('<meta charset="utf-8">'); 
            res.write('<style>');
            res.write('body { font-family: Arial, sans-serif; background-image: url("https://c1.wallpaperflare.com/preview/958/417/136/desktop-nature-sky-outdoors.jpg");background-size: cover; background-repeat: no-repeat; background-attachment: fixed; margin: 0; }');
            res.write('.weather-container { display: flex; justify-content: center; align-items: center; height: 100vh; }');
            res.write('.weather-details { text-align: center; padding: 100px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); background-color: #fff; }');
            res.write('.weather-details h1 { font-size: 45px;margin-top:5px;color:red}');
            res.write('.weather-details p { margin: 40px 0;font-size:30px;}');
            res.write('</style>');
            res.write('</head>');
            res.write('<body>');

            res.write('<div class="weather-container">');
            res.write('<div class="weather-details">');
            res.write('<h1>Weather Details for ' + query + '</h1>');
            res.write('<p>Temperature: ' + weatherData.main.temp + '°C</p>');
            res.write('<p>Humidity: ' + weatherData.main.humidity + '%</p>');

            const sunriseTime = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
            const sunsetTime = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
            res.write('<p>Sunrise Time: ' + sunriseTime + '</p>');
            res.write('<p>Sunset Time: ' + sunsetTime + '</p>');

            res.write('</div>');
            res.write('</div>');
            res.write('</body>');
            res.write('</html>');
            res.send();
        });
    });
});

app.listen(port, () => {
    console.log('Server is running on port' + port);
});



  



//both lines 14 and 15 can convert data to readable format but advantage of using JSON is that it gives data in a more symmetric pattern

//JSON stands for JavaScript Object Notation
//A common use of JSON is to exchange data to/from a web server.

//JSON is a text format for storing and transporting data

//When receiving data from a web server, the data is always a string. Parse the data with JSON.parse() , and the data becomes a JavaScript object.
//JSON format is text only.
//a JavaScript program can easily convert JSON data into JavaScript objects.

//JavaScript has a built in function for converting JSON strings into JavaScript objects:

//JSON.parse()
//JavaScript also has a built in function for converting an object into a JSON string:

//JSON.stringify()

                                    //DIFFERENCE

// JSON                                         //JAVASCRIPT 
// {"name":"John"}                               {name:"john"}

//functions and Date objects are not allowed in JSON.
