const normalizeCity = (cityName) => cityName?.trim()

export const listFavorites = (db, userId) => {
  const rows = db
    .prepare(
      `SELECT city_name AS cityName, country
       FROM favorites
       WHERE user_id = ?
       ORDER BY created_at DESC, city_name ASC`,
    )
    .all(userId)

  return rows.map((row) => ({
    cityName: row.cityName,
    country: row.country,
  }))
}

export const addFavorite = (db, userId, favorite) => {
  const cityName = normalizeCity(favorite.cityName)
  const country = favorite.country?.trim() || null

  if (!cityName) {
    throw new Error('City name is required')
  }

  db
    .prepare(
      `INSERT INTO favorites (user_id, city_name, country)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, city_name) DO UPDATE SET country = excluded.country`,
    )
    .run(userId, cityName, country)

  return { cityName, country }
}

export const removeFavorite = (db, userId, cityName) => {
  const normalizedCity = normalizeCity(cityName)

  if (!normalizedCity) {
    throw new Error('City name is required')
  }

  db
    .prepare('DELETE FROM favorites WHERE user_id = ? AND city_name = ?')
    .run(userId, normalizedCity)
}
