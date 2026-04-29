import assert from 'node:assert/strict'
import test from 'node:test'
import { createMemoryDatabase } from './database.js'
import { createToken, loginUser, registerUser, verifyToken } from './authService.js'

test('registerUser creates a user without exposing the password hash', async () => {
  const db = createMemoryDatabase()

  const user = await registerUser(db, 'test@example.com', 'password123')

  assert.equal(user.email, 'test@example.com')
  assert.equal(typeof user.id, 'number')
  assert.equal(user.password_hash, undefined)
})

test('loginUser returns the user when credentials are valid', async () => {
  const db = createMemoryDatabase()
  const registeredUser = await registerUser(db, 'test@example.com', 'password123')

  const user = await loginUser(db, 'test@example.com', 'password123')

  assert.deepEqual(user, registeredUser)
})

test('loginUser rejects invalid credentials', async () => {
  const db = createMemoryDatabase()
  await registerUser(db, 'test@example.com', 'password123')

  await assert.rejects(
    () => loginUser(db, 'test@example.com', 'wrong-password'),
    /Invalid email or password/,
  )
})

test('createToken and verifyToken round trip the user id', async () => {
  const token = createToken({ id: 42, email: 'test@example.com' }, 'secret')
  const payload = verifyToken(token, 'secret')

  assert.equal(payload.id, 42)
  assert.equal(payload.email, 'test@example.com')
})
