const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="ml-4">
        <p className="text-white text-lg font-semibold">Loading weather data...</p>
        <p className="text-white/70 text-sm">Please wait</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
