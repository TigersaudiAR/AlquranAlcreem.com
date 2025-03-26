interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner = ({ text = 'جاري التحميل...' }: LoadingSpinnerProps) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
    <div className="text-emerald-700 dark:text-emerald-400 font-bold">{text}</div>
  </div>
);

export default LoadingSpinner;
