import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createToken, loginUser, registerUser } from './authService.js'
import { requireAuth } from './authMiddleware.js'
import { createDatabase } from './database.js'
import { addFavorite, listFavorites, removeFavorite } from './favoritesService.js'
import { fetchWeatherBundle } from './weatherService.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const authSecret = process.env.AUTH_SECRET || 'weather-app-development-secret'
const db = createDatabase()

app.use(cors())
app.use(express.json())

const statusFromError = (error) => {
  if (error.message === 'City is required') return 400
  if (error.message === 'City not found') return 404
  if (error.message.includes('API key')) return 500
  return 502
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const user = await registerUser(db, req.body.email, req.body.password)
    const token = createToken(user, authSecret)

    res.status(201).json({ user, token })
  } catch (error) {
    const status = error.message.includes('already registered') ? 409 : 400
    res.status(status).json({ message: error.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const user = await loginUser(db, req.body.email, req.body.password)
    const token = createToken(user, authSecret)

    res.json({ user, token })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
})

app.get('/api/auth/me', requireAuth(authSecret), (req, res) => {
  res.json({ user: { id: req.user.id, email: req.user.email } })
})

app.get('/api/weather', async (req, res) => {
  try {
    const data = await fetchWeatherBundle(
      req.query.city,
      process.env.OPENWEATHER_API_KEY,
    )

    res.json(data)
  } catch (error) {
    res.status(statusFromError(error)).json({ message: error.message })
  }
})

app.get('/api/favorites', requireAuth(authSecret), (req, res) => {
  res.json({ favorites: listFavorites(db, req.user.id) })
})

app.post('/api/favorites', requireAuth(authSecret), (req, res) => {
  try {
    const favorite = addFavorite(db, req.user.id, {
      cityName: req.body.cityName,
      country: req.body.country,
    })

    res.status(201).json({ favorite })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.delete('/api/favorites/:cityName', requireAuth(authSecret), (req, res) => {
  try {
    removeFavorite(db, req.user.id, req.params.cityName)
    res.status(204).end()
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.listen(port, () => {
  console.log(`Weather backend listening on http://localhost:${port}`)
})
