import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    city_name TEXT NOT NULL,
    country TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id, city_name)
  );
`

export const initializeDatabase = (db) => {
  db.exec('PRAGMA foreign_keys = ON;')
  db.exec(schema)
  return db
}

export const createDatabase = (dbPath = process.env.DATABASE_PATH || 'backend/data/weather.db') => {
  mkdirSync(dirname(dbPath), { recursive: true })
  return initializeDatabase(new DatabaseSync(dbPath))
}

export const createMemoryDatabase = () => {
  return initializeDatabase(new DatabaseSync(':memory:'))
}
