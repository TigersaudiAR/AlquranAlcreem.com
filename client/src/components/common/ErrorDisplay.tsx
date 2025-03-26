import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  retryText?: string;
}

const ErrorDisplay = ({ error, onRetry, retryText = "إعادة المحاولة" }: ErrorDisplayProps) => (
  <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
    <div className="text-red-500 dark:text-red-400 mb-2">
      <AlertCircle size={40} />
    </div>
    <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">حدث خطأ</h3>
    <p className="text-sm text-red-600 dark:text-red-400 text-center mb-4">{error}</p>
    
    {onRetry && (
      <Button 
        variant="default" 
        onClick={onRetry}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        {retryText}
      </Button>
    )}
  </div>
);

export default ErrorDisplay;