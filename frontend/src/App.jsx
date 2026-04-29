import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import WeatherDisplay from './components/WeatherDisplay'
import WeatherDetails from './components/WeatherDetails'
import Forecast from './components/Forecast'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import AuthPage from './components/AuthPage'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
const tokenStorageKey = 'weatherAuthToken'
const userStorageKey = 'weatherAuthUser'

function App() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [token, setToken] = useState(() => localStorage.getItem(tokenStorageKey))
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(userStorageKey)
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    const loadFavorites = async () => {
      if (!token) {
        setFavorites([])
        return
      }

      try {
        const response = await fetch(`${apiBaseUrl}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not load favorites')
        }

        setFavorites(data.favorites)
      } catch (err) {
        setError(err.message)
        setFavorites([])
      }
    }

    loadFavorites()
  }, [token])

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  })

  const handleAuth = async (mode, credentials) => {
    const response = await fetch(`${apiBaseUrl}/api/auth/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed')
    }

    localStorage.setItem(tokenStorageKey, data.token)
    localStorage.setItem(userStorageKey, JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    setError(null)
  }

  const handleLogout = () => {
    localStorage.removeItem(tokenStorageKey)
    localStorage.removeItem(userStorageKey)
    setToken(null)
    setUser(null)
    setFavorites([])
  }

  const searchWeather = async (city) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/weather?city=${encodeURIComponent(city)}`,
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Weather service unavailable. Please try again later')
      }

      setWeather(data.weather)
      setForecast(data.forecast)
    } catch (err) {
      setError(err.message)
      setWeather(null)
      setForecast(null)
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = async (cityName, country) => {
    if (!token) {
      setError('Please login to save favorite cities')
      return
    }

    const response = await fetch(`${apiBaseUrl}/api/favorites`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ cityName, country }),
    })
    const data = await response.json()

    if (!response.ok) {
      setError(data.message || 'Could not save favorite')
      return
    }

    setFavorites((currentFavorites) => {
      const withoutDuplicate = currentFavorites.filter((favorite) => favorite.cityName !== cityName)
      return [data.favorite, ...withoutDuplicate]
    })
  }

  const removeFromFavorites = async (cityName) => {
    if (!token) {
      return
    }

    const response = await fetch(`${apiBaseUrl}/api/favorites/${encodeURIComponent(cityName)}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })

    if (!response.ok) {
      const data = await response.json()
      setError(data.message || 'Could not remove favorite')
      return
    }

    setFavorites(favorites.filter(favorite => favorite.cityName !== cityName))
  }

  const isFavorite = (cityName) => {
    return favorites.some(favorite => favorite.cityName === cityName)
  }

  if (!user) {
    return (
      <AuthPage
        onAuth={handleAuth}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
    )
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

        {/* User actions */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-white/80'}`}>
            Logged in as {user.email}
          </span>
          <button
            onClick={handleLogout}
            className={`backdrop-blur-sm px-4 py-2 rounded-lg transition-colors duration-300 ${
              darkMode
                ? 'bg-gray-700/50 text-gray-100 hover:bg-gray-600/50'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Logout
          </button>
        </div>

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
              {favorites.map((favorite) => (
                <button
                  key={`${favorite.cityName}-${favorite.country}`}
                  onClick={() => searchWeather(favorite.cityName)}
                  className={`backdrop-blur-sm px-3 py-1 rounded-full text-sm transition-colors duration-300 ${
                    darkMode
                      ? 'bg-gray-700/50 text-gray-100 hover:bg-gray-600/50'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {favorite.cityName}
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
                  addToFavorites(cityName, weather.sys.country)
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
