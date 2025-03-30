import React from 'react';

interface ErrorDisplayProps {
  message: string;
  retry?: () => void;
}

/**
 * مكوّن عرض أخطاء التطبيق
 * يستخدم لعرض رسائل الخطأ بطريقة منسقة مع إمكانية وجود زر إعادة المحاولة
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, retry }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex flex-col items-center justify-center text-center">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-red-500 dark:text-red-400 mb-3"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p className="text-red-700 dark:text-red-300 mb-3">{message}</p>
      
      {retry && (
        <button 
          onClick={retry}
          className="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg my-4">
      <h3 className="text-lg font-bold mb-2">خطأ</h3>
      <p>{message}</p>
    </div>
  );
};

export default ErrorDisplay;
