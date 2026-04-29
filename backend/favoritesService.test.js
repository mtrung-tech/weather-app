import assert from 'node:assert/strict'
import test from 'node:test'
import { createMemoryDatabase } from './database.js'
import { registerUser } from './authService.js'
import { addFavorite, listFavorites, removeFavorite } from './favoritesService.js'

test('favorites are stored per user', async () => {
  const db = createMemoryDatabase()
  const userA = await registerUser(db, 'a@example.com', 'password123')
  const userB = await registerUser(db, 'b@example.com', 'password123')

  addFavorite(db, userA.id, { cityName: 'Hanoi', country: 'VN' })
  addFavorite(db, userB.id, { cityName: 'Berlin', country: 'DE' })

  assert.deepEqual(listFavorites(db, userA.id), [
    { cityName: 'Hanoi', country: 'VN' },
  ])
  assert.deepEqual(listFavorites(db, userB.id), [
    { cityName: 'Berlin', country: 'DE' },
  ])
})

test('removeFavorite deletes only the selected user favorite', async () => {
  const db = createMemoryDatabase()
  const userA = await registerUser(db, 'a@example.com', 'password123')
  const userB = await registerUser(db, 'b@example.com', 'password123')

  addFavorite(db, userA.id, { cityName: 'Hanoi', country: 'VN' })
  addFavorite(db, userB.id, { cityName: 'Hanoi', country: 'VN' })

  removeFavorite(db, userA.id, 'Hanoi')

  assert.deepEqual(listFavorites(db, userA.id), [])
  assert.deepEqual(listFavorites(db, userB.id), [
    { cityName: 'Hanoi', country: 'VN' },
  ])
})
