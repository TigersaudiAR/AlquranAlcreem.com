interface ErrorDisplayProps {
  message: string;
}

export default function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4 text-center">
      <div className="text-red-600 dark:text-red-400 text-xl mb-2">
        <i className="fas fa-exclamation-triangle mr-2"></i>
        حدث خطأ
      </div>
      <p className="text-red-700 dark:text-red-300">{message}</p>
    </div>
  );
}