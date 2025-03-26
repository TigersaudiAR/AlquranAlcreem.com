import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner = ({ text = 'جاري التحميل...' }: LoadingSpinnerProps) => (
  <div className="flex flex-col items-center justify-center p-8 h-40">
    <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-emerald-500 mb-4"></div>
    <p className="text-gray-600 dark:text-gray-400">{text}</p>
  </div>
);

export default LoadingSpinner;