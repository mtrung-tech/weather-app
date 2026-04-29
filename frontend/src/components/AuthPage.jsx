import AuthPanel from './AuthPanel'

const AuthPage = ({ onAuth, darkMode, onToggleDarkMode }) => {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg transition-colors duration-300 ${
            darkMode ? 'text-gray-100' : 'text-white'
          }`}>
            Weather App
          </h1>
          <p className={`text-lg transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-white/80'
          }`}>
            Login to search weather and save your favorite cities
          </p>
        </div>

        <AuthPanel onAuth={onAuth} darkMode={darkMode} />

        <div className="flex justify-center">
          <button
            onClick={onToggleDarkMode}
            className={`backdrop-blur-sm px-4 py-2 rounded-lg transition-colors duration-300 ${
              darkMode
                ? 'bg-gray-700/50 text-gray-100 hover:bg-gray-600/50'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
