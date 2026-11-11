const Country = ({ country, weather, weatherLoading, weatherError, hasApiKey }) => {
  const languages = Object.values(country.languages || {})
  const capital = country.capital?.[0]

  return (
    <section className="country">
      <h2>{country.name.common}</h2>
      <p>Capital: {capital || 'Not available'}</p>
      <p>Area: {country.area.toLocaleString()} km²</p>
      <p>Population: {country.population.toLocaleString()}</p>

      <h3>Languages</h3>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        className="flag"
        src={country.flags.svg || country.flags.png}
        alt={country.flags.alt || `Flag of ${country.name.common}`}
      />

      {capital && (
        <section className="weather">
          <h3>Weather in {capital}</h3>
          {weatherLoading && <p>Loading weather...</p>}
          {weatherError && <p className="error">{weatherError}</p>}
          {!hasApiKey && !weatherError && (
            <p>
              Configure <code>VITE_OPENWEATHER_API_KEY</code> in
              <code> .env.local</code> to load the weather report.
            </p>
          )}
          {weather && (
            <div className="weather-details">
              <p>Temperature: {weather.main.temp} °C</p>
              <p>Conditions: {weather.weather[0].description}</p>
              <p>Wind: {weather.wind.speed} m/s</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
            </div>
          )}
        </section>
      )}
    </section>
  )
}

export default Country
