const ErrorMessage = ({ message }) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-red-200 text-lg font-semibold mb-2">Error</h3>
        <p className="text-red-100">{message}</p>
        <p className="text-red-200/70 text-sm mt-2">
          Please check the city name and try again
        </p>
      </div>
    </div>
  )
}

export default ErrorMessage
