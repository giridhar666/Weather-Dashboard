import React, { useState, useEffect } from "react";
import "./App.css";
import bgImage from "./assets/weather-bg.webp";
import forecastIcon from "./assets/weather-icon.webp";

import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";

function App() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("Hyderabad");

  const fetchWeather = async (city) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
      );

      const data = await response.json();

      if (data.cod !== 200) {
        setError("City not found");
        setWeather(null);
        return;
      }

      setWeather(data);
    } catch (error) {
      setError("Something went wrong");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather("Hyderabad");
  }, []);

  return (
    <div
  className="weather-container"
  style={{ backgroundImage: `url(${bgImage})` }}
>
  <h1>Weather</h1>

  <div className="search-box">
    <input
      type="text"
      placeholder="Enter city"
      value={city}
      onChange={(e) => setCity(e.target.value)}
    />

    <button onClick={() => fetchWeather(city)}>
  Search
</button>
  </div>

  {weather && (
    <>
      <div className="weather-info">
        <div className="weather-left">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather Icon"
          />

          <div>
            <h2>{Math.round(weather.main.temp)}°C</h2>

            <p>Humidity: {weather.main.humidity}%</p>

            <p>Wind: {weather.wind.speed} km/h</p>
          </div>
        </div>

        <div className="weather-right">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          <p>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
            })}
          </p>

          <p>{weather.weather[0].description}</p>
        </div>
      </div>

      <div className="forecast-container">
        {[1, 2, 3, 4, 5].map((day) => (
          <div key={day} className="forecast-card">
            <h4>
              {new Date(
                Date.now() + day * 24 * 60 * 60 * 1000
              ).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </h4>

            <img src={forecastIcon} alt="Forecast" />

            <p>{Math.round(weather.main.temp + day)}°</p>

            <p>{Math.round(weather.main.temp - day)}°</p>
          </div>
        ))}
      </div>
    </>
  )}
</div>
  );
}

export default App;