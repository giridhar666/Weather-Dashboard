import React, { useState, useEffect } from "react";
import "./App.css";

import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";

function App() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (city) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ea29904160ad86619425798c7bb78d7a&units=metric`
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
    <div className="app">
      <div className="container">
        <h1>Weather Dashboard</h1>

        <SearchBar onSearch={fetchWeather} />

        {loading && <p>Loading...</p>}

        {error && <p className="error">{error}</p>}

        {weather && <WeatherCard weather={weather} />}
      </div>
    </div>
  );
}

export default App;