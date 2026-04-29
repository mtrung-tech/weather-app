// Setup script to create .env file at the project root.
import fs from 'fs'

const envContent = `# OpenWeatherMap API Key
# Get your free API key from: https://openweathermap.org/api
# Replace 'your_api_key_here' with your actual API key
OPENWEATHER_API_KEY=your_api_key_here
AUTH_SECRET=replace_this_with_a_long_random_secret
`

fs.writeFileSync('.env', envContent)
console.log('.env file created successfully.')
console.log('Please edit .env and add your OpenWeatherMap API key.')
console.log('Get your free API key at: https://openweathermap.org/api')
