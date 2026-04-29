import { useState } from 'react'

const SearchBar = ({ onSearch, darkMode = false }) => {
  const [city, setCity] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim()) {
      onSearch(city.trim())
      setCity('')
    }
  }

  return (
    <div className="max-w-md mx-auto mb-8">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className={`flex-1 px-4 py-3 rounded-lg backdrop-blur-sm border transition-colors duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
            darkMode 
              ? 'bg-gray-800/30 text-gray-100 placeholder-gray-400 border-gray-600/30 focus:ring-gray-500/50' 
              : 'bg-white/20 text-white placeholder-white/70 border-white/30 focus:ring-white/50'
          }`}
        />
        <button
          type="submit"
          className={`px-6 py-3 backdrop-blur-sm rounded-lg transition-colors duration-300 font-semibold ${
            darkMode
              ? 'bg-gray-700/50 text-gray-100 hover:bg-gray-600/50'
              : 'bg-white/30 text-white hover:bg-white/40'
          }`}
        >
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchBar
