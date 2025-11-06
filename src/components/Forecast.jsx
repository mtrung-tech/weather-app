const Forecast = ({ forecast }) => {
  // Group forecast data by day and get the first entry for each day
  const dailyForecast = forecast.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toDateString()
    if (!acc[date]) {
      acc[date] = item
    }
    return acc
  }, {})

  const forecastDays = Object.values(dailyForecast).slice(0, 5)

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">5-Day Forecast</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {forecastDays.map((day, index) => (
          <div
            key={index}
            className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition-colors"
          >
            <div className="text-white/80 text-sm mb-2">{formatDate(day.dt)}</div>
            <img
              src={getWeatherIcon(day.weather[0].icon)}
              alt={day.weather[0].description}
              className="w-12 h-12 mx-auto mb-2"
            />
            <div className="text-white font-semibold text-lg mb-1">
              {Math.round(day.main.temp)}°
            </div>
            <div className="text-white/70 text-sm capitalize">
              {day.weather[0].description}
            </div>
            <div className="text-white/60 text-xs mt-2">
              <div>H: {Math.round(day.main.temp_max)}°</div>
              <div>L: {Math.round(day.main.temp_min)}°</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Forecast
