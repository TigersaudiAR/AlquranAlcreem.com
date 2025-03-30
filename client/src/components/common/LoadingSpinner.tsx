import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

/**
 * مكوّن شاشة التحميل
 * يستخدم لعرض مؤشر التحميل أثناء تحميل البيانات أو معالجتها
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'amber'
}) => {
  const sizeMap = {
    small: 'h-5 w-5',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };
  
  const colorMap = {
    amber: 'border-amber-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
  };
  
  const spinnerSize = sizeMap[size] || sizeMap.medium;
  const spinnerColor = colorMap[color as keyof typeof colorMap] || colorMap.amber;
  
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${spinnerSize} border-2 ${spinnerColor} border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const sizeClass = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  }[size];

  return (
    <div className="flex justify-center items-center p-4">
      <div className={`${sizeClass} border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;
