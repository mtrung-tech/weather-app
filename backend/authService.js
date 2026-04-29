import { scrypt as scryptCallback, timingSafeEqual, randomBytes, createHmac } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)
const keyLength = 64

const normalizeEmail = (email) => email?.trim().toLowerCase()

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
})

const hashPassword = async (password) => {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = await scrypt(password, salt, keyLength)

  return `${salt}:${derivedKey.toString('hex')}`
}

const verifyPassword = async (password, storedHash) => {
  const [salt, key] = storedHash.split(':')
  const storedKey = Buffer.from(key, 'hex')
  const derivedKey = await scrypt(password, salt, keyLength)

  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey)
}

const encodeBase64Url = (value) => {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

const sign = (value, secret) => {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

export const registerUser = async (db, email, password) => {
  const normalizedEmail = normalizeEmail(email)

  if (!normalizedEmail || !password || password.length < 6) {
    throw new Error('Email and password with at least 6 characters are required')
  }

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail)
  if (existingUser) {
    throw new Error('Email is already registered')
  }

  const passwordHash = await hashPassword(password)
  const result = db
    .prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
    .run(normalizedEmail, passwordHash)

  return publicUser({ id: Number(result.lastInsertRowid), email: normalizedEmail })
}

export const loginUser = async (db, email, password) => {
  const normalizedEmail = normalizeEmail(email)
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail)

  if (!user || !(await verifyPassword(password || '', user.password_hash))) {
    throw new Error('Invalid email or password')
  }

  return publicUser(user)
}

export const createToken = (user, secret) => {
  const header = encodeBase64Url({ alg: 'HS256', typ: 'JWT' })
  const payload = encodeBase64Url({
    id: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  })
  const unsignedToken = `${header}.${payload}`

  return `${unsignedToken}.${sign(unsignedToken, secret)}`
}

export const verifyToken = (token, secret) => {
  const [header, payload, signature] = token?.split('.') || []

  if (!header || !payload || !signature) {
    throw new Error('Invalid token')
  }

  const unsignedToken = `${header}.${payload}`
  const expectedSignature = sign(unsignedToken, secret)

  if (signature !== expectedSignature) {
    throw new Error('Invalid token')
  }

  const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))

  if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired')
  }

  return decodedPayload
}
