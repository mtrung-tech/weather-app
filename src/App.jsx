import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import WeatherDisplay from './components/WeatherDisplay'
import WeatherDetails from './components/WeatherDetails'
import Forecast from './components/Forecast'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'

function App() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [favorites, setFavorites] = useState([])

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('weatherFavorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites))
  }, [favorites])

  const searchWeather = async (city) => {
    setLoading(true)
    setError(null)
    
    try {
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
      if (!API_KEY) {
        throw new Error('API key not found. Please add VITE_OPENWEATHER_API_KEY to your .env file')
      }

      // First, get coordinates for the city using Geocoding API
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      )
      
      if (!geoResponse.ok) {
        throw new Error('City not found')
      }
      
      const geoData = await geoResponse.json()
      if (geoData.length === 0) {
        throw new Error('City not found')
      }
      
      const { lat, lon, name, country } = geoData[0]

      // Use the free weather API with lat/lon coordinates
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      )
      
      if (!weatherResponse.ok) {
        if (weatherResponse.status === 401) {
          throw new Error('Invalid API key. Please check your API key in the .env file')
        } else if (weatherResponse.status === 404) {
          throw new Error('Weather data not found for this location')
        } else {
          throw new Error('Weather service unavailable. Please try again later')
        }
      }
      
      const weatherData = await weatherResponse.json()
      
      // Add city name and country to the weather data
      weatherData.name = name
      weatherData.sys = { country: country }
      
      setWeather(weatherData)

      // Fetch 5-day forecast using coordinates
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      )
      
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json()
        setForecast(forecastData)
      }
    } catch (err) {
      setError(err.message)
      setWeather(null)
      setForecast(null)
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = (cityName) => {
    if (!favorites.includes(cityName)) {
      setFavorites([...favorites, cityName])
    }
  }

  const removeFromFavorites = (cityName) => {
    setFavorites(favorites.filter(fav => fav !== cityName))
  }

  const isFavorite = (cityName) => {
    return favorites.includes(cityName)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg transition-colors duration-300 ${
            darkMode ? 'text-gray-100' : 'text-white'
          }`}>
            Weather App
          </h1>
          <p className={`text-lg transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-white/80'
          }`}>
            Get real-time weather information for any city
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={searchWeather} darkMode={darkMode} />

        {/* Dark Mode Toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`backdrop-blur-sm px-4 py-2 rounded-lg transition-colors duration-300 ${
              darkMode
                ? 'bg-gray-700/50 text-gray-100 hover:bg-gray-600/50'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 text-center transition-colors duration-300 ${
              darkMode ? 'text-gray-200' : 'text-white'
            }`}>
              Favorite Cities
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {favorites.map((city) => (
                <button
                  key={city}
                  onClick={() => searchWeather(city)}
                  className={`backdrop-blur-sm px-3 py-1 rounded-full text-sm transition-colors duration-300 ${
                    darkMode
                      ? 'bg-gray-700/50 text-gray-100 hover:bg-gray-600/50'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && <LoadingSpinner />}

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Weather Display */}
        {weather && !loading && (
          <div className="space-y-6">
            <WeatherDisplay 
              weather={weather} 
              onToggleFavorite={() => {
                const cityName = weather.name
                if (isFavorite(cityName)) {
                  removeFromFavorites(cityName)
                } else {
                  addToFavorites(cityName)
                }
              }}
              isFavorite={isFavorite(weather.name)}
              darkMode={darkMode}
            />
            <WeatherDetails weather={weather} />
            {forecast && <Forecast forecast={forecast} />}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
