import { useEffect, useState } from 'react'
import Country from './components/Country.jsx'
import countryService from './services/countryService.js'

const weatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [countriesError, setCountriesError] = useState('')
  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState('')

  const normalizedQuery = query.trim().toLowerCase()
  const matchingCountries = normalizedQuery
    ? countries.filter((country) =>
        country.name.common.toLowerCase().includes(normalizedQuery),
      )
    : []
  const countryToShow =
    selectedCountry ||
    (matchingCountries.length === 1 ? matchingCountries[0] : null)

  useEffect(() => {
    countryService
      .getAll()
      .then((countryData) => setCountries(countryData))
      .catch(() => {
        setCountriesError('Could not load country data. Please try again later.')
      })
      .finally(() => setLoadingCountries(false))
  }, [])

  useEffect(() => {
    setWeather(null)
    setWeatherError('')

    if (!selectedCountry) {
      setWeatherLoading(false)
      return undefined
    }

    if (!weatherApiKey) {
      setWeatherLoading(false)
      setWeatherError(
        'Weather API key is not configured. Add it to .env.local and restart the app.',
      )
      return undefined
    }

    const coordinates =
      selectedCountry.capitalInfo?.latlng || selectedCountry.latlng

    if (!coordinates || coordinates.length < 2) {
      setWeatherLoading(false)
      setWeatherError('Capital coordinates are not available for this country.')
      return undefined
    }

    let cancelled = false
    setWeatherLoading(true)
    countryService
      .getWeather(coordinates[0], coordinates[1], weatherApiKey)
      .then((weatherData) => {
        if (!cancelled) {
          setWeather(weatherData)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWeatherError('Could not load weather for this capital.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setWeatherLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [countryToShow])

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
    setSelectedCountry(null)
  }

  const showCountry = (country) => {
    setSelectedCountry(country)
    setQuery(country.name.common)
  }

  return (
    <main>
      <h1>Countries</h1>
      <div className="search-field">
        <label htmlFor="country-search">Find countries: </label>
        <input
          id="country-search"
          value={query}
          onChange={handleQueryChange}
          autoComplete="off"
        />
      </div>

      {loadingCountries && <p>Loading countries...</p>}
      {countriesError && <p className="error">{countriesError}</p>}

      {!loadingCountries && !countriesError && normalizedQuery && (
        <>
          {matchingCountries.length === 0 && <p>No countries found.</p>}
          {matchingCountries.length > 10 && (
            <p>Too many matches. Please make your search more specific.</p>
          )}
          {matchingCountries.length > 1 &&
            matchingCountries.length <= 10 && (
              <ul className="country-results">
                {matchingCountries.map((country) => (
                  <li key={country.cca3}>
                    {country.name.common}
                    <button
                      type="button"
                      onClick={() => showCountry(country)}
                    >
                      Show
                    </button>
                  </li>
                ))}
              </ul>
            )}
          {countryToShow && (
            <Country
              country={countryToShow}
              weather={weather}
              weatherLoading={weatherLoading}
              weatherError={weatherError}
              hasApiKey={Boolean(weatherApiKey)}
            />
          )}
        </>
      )}
    </main>
  )
}

export default App
