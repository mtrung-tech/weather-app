# 🌤️ Weather App

A modern, responsive weather application built with React and Tailwind CSS. Get real-time weather information for any city with a beautiful, intuitive interface.

## ✨ Features

- **Real-time Weather Data**: Current weather conditions for any city worldwide
- **5-Day Forecast**: Extended weather forecast with daily details
- **Responsive Design**: Works perfectly on mobile and desktop devices
- **Dark/Light Mode**: Toggle between themes for better user experience
- **Favorite Cities**: Save and quickly access your favorite cities
- **Weather Details**: Comprehensive information including humidity, wind speed, pressure, and more
- **Beautiful UI**: Modern glassmorphism design with smooth animations
- **Error Handling**: Graceful error handling with user-friendly messages

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Run the setup script: `npm run setup:env` (creates .env file automatically)
   - Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Edit the `.env` file and replace `your_api_key_here` with your actual API key:
     ```
     OPENWEATHER_API_KEY=your_actual_api_key_here
     ```

4. **Start the backend server**
   ```bash
   npm run dev:server
   ```

5. **Start the frontend development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` to see the app in action!

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **OpenWeatherMap API** - Weather data provider
- **JavaScript (ES6+)** - Modern JavaScript features

## 📱 Usage

1. **Search for a city**: Type any city name in the search bar and press Enter or click Search
2. **View weather details**: See current temperature, conditions, and detailed weather information
3. **Check the forecast**: Scroll down to see the 5-day weather forecast
4. **Add to favorites**: Click the heart icon to save cities for quick access
5. **Toggle dark mode**: Use the dark/light mode toggle for your preferred theme
6. **Quick access**: Click on favorite cities to instantly load their weather

## 🎨 Design Features

- **Glassmorphism UI**: Beautiful frosted glass effects with backdrop blur
- **Gradient Backgrounds**: Dynamic blue gradient backgrounds
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Smooth Animations**: Hover effects and transitions for better UX
- **Weather Icons**: Real weather icons from OpenWeatherMap
- **Color-coded Temperatures**: Temperature-based color coding for better visual feedback

## 🔧 Available Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend development server
- `npm run server` - Start backend server
- `npm run setup:env` - Create a starter `.env` file
- `npm test` - Run backend tests
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service like Vercel, Netlify, or GitHub Pages.

## 🌐 Deployment

This app can be easily deployed to:

- **Vercel**: Connect your GitHub repository and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect your repository
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **Any static hosting**: The built files work on any static file server

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://react.dev/) for the amazing UI library
- [Vite](https://vitejs.dev/) for the fast build tool

---

**Live Demo**: [Add your deployed URL here]

**Made with ❤️ using React and Tailwind CSS**
