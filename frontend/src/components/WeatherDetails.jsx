const WeatherDetails = ({ weather }) => {
  const details = [
    {
      label: 'Humidity',
      value: `${weather.main.humidity}%`,
      icon: '💧'
    },
    {
      label: 'Wind Speed',
      value: `${weather.wind.speed} m/s`,
      icon: '💨'
    },
    {
      label: 'Pressure',
      value: `${weather.main.pressure} hPa`,
      icon: '📊'
    },
    {
      label: 'Visibility',
      value: `${weather.visibility / 1000} km`,
      icon: '👁️'
    },
    {
      label: 'Min Temp',
      value: `${Math.round(weather.main.temp_min)}°C`,
      icon: '❄️'
    },
    {
      label: 'Max Temp',
      value: `${Math.round(weather.main.temp_max)}°C`,
      icon: '☀️'
    }
  ]

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">Weather Details</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {details.map((detail, index) => (
          <div
            key={index}
            className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition-colors"
          >
            <div className="text-2xl mb-2">{detail.icon}</div>
            <div className="text-white/80 text-sm mb-1">{detail.label}</div>
            <div className="text-white font-semibold text-lg">{detail.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeatherDetails
