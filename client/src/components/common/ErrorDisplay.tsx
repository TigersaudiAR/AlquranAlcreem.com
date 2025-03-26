interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  retryText?: string;
}

const ErrorDisplay = ({ error, onRetry, retryText = "إعادة المحاولة" }: ErrorDisplayProps) => (
  <div className="bg-red-100 dark:bg-red-900 p-6 rounded-lg text-center">
    <div className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-3">
      <i className="fas fa-triangle-exclamation text-4xl"></i>
    </div>
    <div className="text-red-600 dark:text-red-400 font-bold text-lg mb-2">حدث خطأ!</div>
    <div className="text-red-700 dark:text-red-300 mb-4">{error}</div>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
      >
        {retryText}
      </button>
    )}
  </div>
);

export default ErrorDisplay;
