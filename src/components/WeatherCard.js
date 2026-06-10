import React from "react";

function WeatherCard({ weather }) {
  return (
    <div className="weather-card">
      <h2>{weather.name}</h2>

      <h1>{Math.round(weather.main.temp)}°C</h1>

      <p>{weather.weather[0].description}</p>

      <div className="weather-details">
        <p>Humidity: {weather.main.humidity}%</p>

        <p>Wind Speed: {weather.wind.speed} m/s</p>
      </div>
    </div>
  );
}

export default WeatherCard;