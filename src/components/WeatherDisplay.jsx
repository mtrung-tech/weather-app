const WeatherDisplay = ({ weather, onToggleFavorite, isFavorite, darkMode = false }) => {
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  const getTemperatureColor = (temp) => {
    if (temp < 0) return 'text-blue-200'
    if (temp < 10) return 'text-blue-300'
    if (temp < 20) return 'text-green-300'
    if (temp < 30) return 'text-yellow-300'
    return 'text-red-300'
  }

  return (
    <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-2xl border transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-800/30 border-gray-700/30' 
        : 'bg-white/10 border-white/20'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
            darkMode ? 'text-gray-100' : 'text-white'
          }`}>
            {weather.name}
          </h2>
          <p className={`text-lg transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-white/80'
          }`}>
            {weather.sys.country}
          </p>
        </div>
        <button
          onClick={onToggleFavorite}
          className="text-2xl hover:scale-110 transition-transform"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img
            src={getWeatherIcon(weather.weather[0].icon)}
            alt={weather.weather[0].description}
            className="w-20 h-20"
          />
          <div className="ml-4">
            <div className={`text-6xl font-bold ${getTemperatureColor(weather.main.temp)}`}>
              {Math.round(weather.main.temp)}°
            </div>
            <p className="text-white/80 text-xl capitalize">
              {weather.weather[0].description}
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className={`text-sm transition-colors duration-300 ${
          darkMode ? 'text-gray-400' : 'text-white/70'
        }`}>
          Feels like {Math.round(weather.main.feels_like)}°C
        </p>
      </div>
    </div>
  )
}

export default WeatherDisplay
