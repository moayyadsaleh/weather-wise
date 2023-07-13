const express = require("express");
const path = require("path");
const https = require("https");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // Middleware for parsing form data

app.get("/", (req, res) => {
  fs.readFile(path.join(__dirname, "index.html"), "utf8", (err, html) => {
    if (err) {
      console.error("Error reading HTML file:", err);
      res.send("Error reading HTML file");
    } else {
      res.send(html);
    }
  });
});

app.post("/search", (req, res) => {
  try {
    const cityNameRegex = /^[\w\s.-]+$/;
    let cityName = req.body.cityName.trim();

    // Remove extra characters
    cityName = cityName.replace(/[,.;:!?'"()\[\]{}<>\/\\#@$%^&*_+=~`|]/g, "");

    if (!cityNameRegex.test(cityName)) {
      // City name is not valid, handle the error
      const errorMessage = "You didn't type in City Name or Zip Code. Please enter a valid city name or Zip Code and try again.";
      console.error(errorMessage);
      res.send(errorMessage);
      return;
    }
    const options = {
      hostname: "api.openweathermap.org",
      path: `/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=imperial&appid=My-API-Key`,
      method: "GET",
    };

    const request = https.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const weatherData = JSON.parse(data);

        if (weatherData.cod === "404") {
          // City not found, handle the error
          const errorMessage = `${cityName} not found. Please try again with a different city name or check the spelling of the current city. `;
          console.error(errorMessage);
          res.send(errorMessage);
        } else {
// Retrieve all the available weather information
const temperature = weatherData.main.temp;
const minTemperature = weatherData.main.temp_min;
const maxTemperature = weatherData.main.temp_max;
const feelsLike = weatherData.main.feels_like;
const pressure = weatherData.main.pressure;
const humidity = weatherData.main.humidity;
const visibility = weatherData.visibility;
const windSpeed = weatherData.wind.speed;
const windDirection = weatherData.wind.deg;
const clouds = weatherData.clouds.all;
const weatherDescription = weatherData.weather[0].description;
const weatherIcon = weatherData.weather[0].icon;
const rainVolume = weatherData.rain ? weatherData.rain["1h"] : 0;
const snowVolume = weatherData.snow ? weatherData.snow["1h"] : 0;
const sunrise = new Date(weatherData.sys.sunrise * 1000);
const sunset = new Date(weatherData.sys.sunset * 1000);
const countryCode = weatherData.sys.country;
const city = weatherData.name;
const seaLevelPressure = weatherData.main.sea_level !== undefined ? weatherData.main.sea_level : "N/A";
const groundLevelPressure = weatherData.main.grnd_level !== undefined ? weatherData.main.grnd_level : "N/A";
const windGust = weatherData.wind.gust !== undefined ? weatherData.wind.gust : "N/A";
const precipitationProbability = weatherData.pop !== undefined ? weatherData.pop : "N/A";
const uvIndex = weatherData.uvi !== undefined ? weatherData.uvi : "N/A";
const visibilityMiles = visibility * 0.000621371; // Convert visibility to miles
const sunriseTime = sunrise.toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
});
const sunsetTime = sunset.toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
});

// Construct the response with the weather information
          const responseText = `
<img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
<p><strong>Weather information for ${cityName}, ${countryCode}:</strong></p>
<p><strong>Temperature:</strong> ${temperature} F</p>
<p><strong>Min Temperature:</strong> ${minTemperature} F</p>
<p><strong>Max Temperature:</strong> ${maxTemperature} F</p>
<p><strong>Feels Like:</strong> ${feelsLike} F</p>
<p><strong>Pressure:</strong> ${pressure} hPa</p>
<p><strong>Humidity:</strong> ${humidity} %</p>
<p><strong>Visibility:</strong> ${visibility} meters (${visibilityMiles} miles)</p>
<p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
<p><strong>Wind Direction:</strong> ${windDirection}°</p>
<p><strong>Cloudiness:</strong> ${clouds} %</p>
<p><strong>Description:</strong> ${weatherDescription}</p>
<p><strong>Rain Volume (last hour):</strong> ${rainVolume} mm</p>
<p><strong>Snow Volume (last hour):</strong> ${snowVolume} mm</p>
<p><strong>Sunrise:</strong> ${sunriseTime}</p>
<p><strong>Sunset:</strong> ${sunsetTime}</p>
<p><strong>Sea Level Pressure:</strong> ${seaLevelPressure}</p>
<p><strong>Ground Level Pressure:</strong> ${groundLevelPressure}</p>
<p><strong>Wind Gust:</strong> ${windGust}</p>
<p><strong>Precipitation Probability:</strong> ${precipitationProbability}</p>
<p><strong>UV Index:</strong> ${uvIndex}</p>
<p><strong>Visibility Miles:</strong> ${visibilityMiles}</p>

<form action="/" method="get">
  <button type="submit">Search a Different City</button>
</form>
`;

          // Send the weather information as the response
          res.send(responseText);
        }
      });
    });

    request.on("error", (error) => {
      console.error("Error fetching weather data:", error);
      res.send("Error fetching weather data. Please try again later");
    });

    request.end();
  } catch (error) {
    console.error("Error in the request handler:", error);
    res.send("An error occurred. Please make sure to enter the zip code if the city name didn't work.");
  }
});
app.listen(process.env.PORT ||3000, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`Example app listening on port ${process.env.PORT}`);
});