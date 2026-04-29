const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org'

const ensureOk = async (response, fallbackMessage) => {
  if (response.ok) {
    return
  }

  if (response.status === 401) {
    throw new Error('Invalid API key. Please check your OpenWeatherMap API key')
  }

  if (response.status === 404) {
    throw new Error('Weather data not found for this location')
  }

  throw new Error(fallbackMessage)
}

export const fetchWeatherBundle = async (city, apiKey, fetchImpl = fetch) => {
  const normalizedCity = city?.trim()

  if (!normalizedCity) {
    throw new Error('City is required')
  }

  if (!apiKey) {
    throw new Error('OpenWeatherMap API key is not configured')
  }

  const encodedCity = encodeURIComponent(normalizedCity)
  const encodedApiKey = encodeURIComponent(apiKey)

  const geoResponse = await fetchImpl(
    `${OPENWEATHER_BASE_URL}/geo/1.0/direct?q=${encodedCity}&limit=1&appid=${encodedApiKey}`,
  )
  await ensureOk(geoResponse, 'City not found')

  const geoData = await geoResponse.json()

  if (!Array.isArray(geoData) || geoData.length === 0) {
    throw new Error('City not found')
  }

  const { lat, lon, name, country } = geoData[0]
  const coordinates = `lat=${lat}&lon=${lon}`

  const weatherResponse = await fetchImpl(
    `${OPENWEATHER_BASE_URL}/data/2.5/weather?${coordinates}&appid=${encodedApiKey}&units=metric`,
  )
  await ensureOk(weatherResponse, 'Weather service unavailable. Please try again later')

  const weather = await weatherResponse.json()
  weather.name = name
  weather.sys = { ...weather.sys, country }

  const forecastResponse = await fetchImpl(
    `${OPENWEATHER_BASE_URL}/data/2.5/forecast?${coordinates}&appid=${encodedApiKey}&units=metric`,
  )
  const forecast = forecastResponse.ok ? await forecastResponse.json() : null

  return { weather, forecast }
}
