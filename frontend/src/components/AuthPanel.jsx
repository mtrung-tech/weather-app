import { useState } from 'react'

const AuthPanel = ({ onAuth, darkMode = false }) => {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await onAuth(mode, { email, password })
      setPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`max-w-md mx-auto mb-8 backdrop-blur-sm rounded-2xl p-5 border transition-colors duration-300 ${
      darkMode ? 'bg-gray-800/30 border-gray-700/30' : 'bg-white/10 border-white/20'
    }`}>
      <div className="flex justify-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            mode === 'login' ? 'bg-white/30 text-white' : 'text-white/70 hover:bg-white/10'
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            mode === 'register' ? 'bg-white/30 text-white' : 'text-white/70 hover:bg-white/10'
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className={`w-full px-4 py-3 rounded-lg backdrop-blur-sm border transition-colors duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
            darkMode
              ? 'bg-gray-800/30 text-gray-100 placeholder-gray-400 border-gray-600/30 focus:ring-gray-500/50'
              : 'bg-white/20 text-white placeholder-white/70 border-white/30 focus:ring-white/50'
          }`}
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className={`w-full px-4 py-3 rounded-lg backdrop-blur-sm border transition-colors duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
            darkMode
              ? 'bg-gray-800/30 text-gray-100 placeholder-gray-400 border-gray-600/30 focus:ring-gray-500/50'
              : 'bg-white/20 text-white placeholder-white/70 border-white/30 focus:ring-white/50'
          }`}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
            darkMode
              ? 'bg-gray-700/50 text-gray-100 hover:bg-gray-600/50'
              : 'bg-white/30 text-white hover:bg-white/40'
          } disabled:opacity-60`}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
        </button>
      </form>

      {error && <p className="text-red-100 text-sm mt-3 text-center">{error}</p>}
    </div>
  )
}

export default AuthPanel
