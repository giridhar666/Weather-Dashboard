import React, { useState, useEffect } from "react";
import "./App.css";
import bgImage from "./assets/weather-bg.webp";
import forecastIcon from "./assets/weather-icon.webp";



function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [, setError] = useState("");
  const [, setLoading] = useState(false);
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
        setForecast([]);
        return;
      }

      setWeather(data);
      const forecastResponse = await fetch(
  `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
);

const forecastData = await forecastResponse.json();

const groupedForecast = {};

forecastData.list.forEach((item) => {
  const date = item.dt_txt.split(" ")[0];

  if (!groupedForecast[date]) {
    groupedForecast[date] = {
      date,
      min: item.main.temp_min,
      max: item.main.temp_max,
      icon: item.weather[0].icon,
      description: item.weather[0].description,
    };
  } else {
    groupedForecast[date].min = Math.min(
      groupedForecast[date].min,
      item.main.temp_min
    );

    groupedForecast[date].max = Math.max(
      groupedForecast[date].max,
      item.main.temp_max
    );
  }
});

const dailyForecast = Object.values(groupedForecast).slice(0, 5);

setForecast(dailyForecast);


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
            <h2>{weather.main.temp}°C</h2>

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
          {forecast.map((day) => (
            <div key={day.date} className="forecast-card">
              <h4>
                {new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </h4>

              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
              />

              <p>{Math.round(day.max)}°</p>

              <p>{Math.round(day.min)}°</p>
            </div>
          ))}
        </div>

    </>
  )}
</div>
  );
}

export default App;