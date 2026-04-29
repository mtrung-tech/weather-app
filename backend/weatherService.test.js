import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchWeatherBundle } from './weatherService.js'

const response = (ok, body, status = ok ? 200 : 500) => ({
  ok,
  status,
  json: async () => body,
})

test('fetchWeatherBundle returns current weather and forecast for a city', async () => {
  const calls = []
  const fetchMock = async (url) => {
    calls.push(url)

    if (url.includes('/geo/1.0/direct')) {
      return response(true, [{ lat: 21.03, lon: 105.85, name: 'Hanoi', country: 'VN' }])
    }

    if (url.includes('/data/2.5/weather')) {
      return response(true, {
        main: { temp: 30 },
        weather: [{ description: 'clear sky', icon: '01d' }],
        sys: {},
      })
    }

    if (url.includes('/data/2.5/forecast')) {
      return response(true, { list: [{ dt: 1710000000, main: { temp: 29 }, weather: [] }] })
    }

    throw new Error(`Unexpected URL: ${url}`)
  }

  const result = await fetchWeatherBundle('Ha Noi', 'test-key', fetchMock)

  assert.equal(result.weather.name, 'Hanoi')
  assert.equal(result.weather.sys.country, 'VN')
  assert.deepEqual(result.forecast.list, [{ dt: 1710000000, main: { temp: 29 }, weather: [] }])
  assert.equal(calls.length, 3)
  assert.ok(calls[0].includes('q=Ha%20Noi'))
  assert.ok(calls.every((url) => url.includes('appid=test-key')))
})

test('fetchWeatherBundle rejects empty city names', async () => {
  await assert.rejects(
    () => fetchWeatherBundle('   ', 'test-key', async () => response(true, {})),
    /City is required/,
  )
})

test('fetchWeatherBundle reports missing cities', async () => {
  const fetchMock = async () => response(true, [])

  await assert.rejects(
    () => fetchWeatherBundle('Atlantis', 'test-key', fetchMock),
    /City not found/,
  )
})

test('fetchWeatherBundle reports invalid API keys', async () => {
  const fetchMock = async (url) => {
    if (url.includes('/geo/1.0/direct')) {
      return response(true, [{ lat: 1, lon: 2, name: 'Test', country: 'TS' }])
    }

    return response(false, {}, 401)
  }

  await assert.rejects(
    () => fetchWeatherBundle('Test', 'bad-key', fetchMock),
    /Invalid API key/,
  )
})
