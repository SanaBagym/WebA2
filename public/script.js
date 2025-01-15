document.getElementById("weather-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = document.getElementById("city").value;

    try {
        const response = await fetch("/weather", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `city=${encodeURIComponent(city)}`, // Исправлено на корректный формат строки
        });

        const data = await response.json();

        if (data.success) {
            const weather = data.weather;

            // Заполняем информацию о погоде
            document.getElementById("weather-info").innerHTML = `
                <h2>Weather in ${weather.city}, ${weather.country}</h2>
                <p>Temperature: ${weather.temp}°C</p>
                <p>Feels Like: ${weather.feels_like}°C</p>
                <p>Weather: ${weather.description}</p>
                <p>Humidity: ${weather.humidity}%</p>
                <p>Pressure: ${weather.pressure} hPa</p>
                <p>Wind Speed: ${weather.wind_speed} m/s</p>
                <img src="https://openweathermap.org/img/wn/${weather.icon}.png" alt="Weather icon">
            `;

            // Отображаем карту
            const map = L.map("map").setView([weather.lat, weather.lon], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '© OpenStreetMap contributors',
            }).addTo(map);

            L.marker([weather.lat, weather.lon]).addTo(map)
                .bindPopup(`<b>${weather.city}</b><br>${weather.description}`).openPopup();

            // Фото города, если доступно
            if (data.photoUrl) {
                document.getElementById("weather-info").innerHTML += `
                    <h3>Photo of ${weather.city}</h3>
                    <img src="${data.photoUrl}" alt="City photo" style="max-width: 100%; height: auto;">
                `;
            }
            // Мем, если доступен
            if (data.memeUrl) {
                document.getElementById("weather-info").innerHTML += `
                    <h3>Random Meme</h3>
                    <img src="${data.memeUrl}" alt="Meme" style="max-width: 100%; height: auto;">
                `;
            } else {
                document.getElementById("weather-info").innerHTML += `<p>Could not fetch a meme.</p>`;
            }

            // Мем, если доступен
            if (data.meme) {
                document.getElementById("weather-info").innerHTML += `
                    <h3>Random Meme</h3>
                    <img src="${data.meme}" alt="Meme" style="max-width: 100%; height: auto;">
                `;
            }
        } else {
            // Если данные не пришли
            document.getElementById("weather-info").innerHTML = `<p>${data.message}</p>`;
        }
    } catch (error) {
        // Обработка ошибок
        console.error("Error fetching weather data:", error);
        document.getElementById("weather-info").innerHTML = `<p>Failed to fetch weather information. Please try again later.</p>`;
    }
});
