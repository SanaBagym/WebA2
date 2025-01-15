const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const OPENWEATHER_API_KEY = "16f4ffab7f44152357c41442e2bfee09";
const PEXELS_API_KEY = "hJ4GKGY2kyT7iwRwzZt4SQsLnnnn7z2nUeA9W2GyIR3P3MkDMhbGyINb";
const MEMEBUILD_API_KEY = "1f7015401878e04976df171a1e0774";

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/weather", async (req, res) => {
    const city = req.body.city;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    try {
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;

        const pexelsUrl = `https://api.pexels.com/v1/search?query=${city}&per_page=1`;
        const pexelsResponse = await axios.get(pexelsUrl, {
            headers: { Authorization: PEXELS_API_KEY },
        });
        const photoUrl = pexelsResponse.data.photos[0]?.src?.medium || null;

        const memeUrl = `https://memebuild.com/api/${MEMEBUILD_API_KEY}/random`;
        const memeResponse = await axios.get(memeUrl);
        const meme = memeResponse.data.image || null;

        res.json({
            success: true,
            weather: {
                city: weatherData.name,
                temp: weatherData.main.temp,
                description: weatherData.weather[0].description,
                icon: weatherData.weather[0].icon,
                lat: weatherData.coord.lat,
                lon: weatherData.coord.lon,
                feels_like: weatherData.main.feels_like,
                humidity: weatherData.main.humidity,
                pressure: weatherData.main.pressure,
                wind_speed: weatherData.wind.speed,
                country: weatherData.sys.country,
            },
            photoUrl,
            meme,
        });
    } catch (error) {
        res.json({ success: false, message: "City not found or an error occurred." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:3000`);
});