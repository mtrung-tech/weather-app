import { verifyToken } from './authService.js'

export const requireAuth = (secret) => (req, res, next) => {
  const authorization = req.get('authorization') || ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''

  try {
    req.user = verifyToken(token, secret)
    next()
  } catch {
    res.status(401).json({ message: 'Authentication required' })
  }
}
