import { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';

interface KingFahdMushafProps {
  pageNumber: number;
  onPageChange: (page: number) => void;
}

/**
 * مكون عرض المصحف الشريف من مطبعة الملك فهد للطباعة
 * يعرض صفحات المصحف كما هي دون أي تعديل أو إعادة كتابة
 */
export default function KingFahdMushaf({ pageNumber, onPageChange }: KingFahdMushafProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalPages = 604; // إجمالي عدد صفحات المصحف الشريف
  
  // قاعدة عنوان الصورة للصفحة من مطبعة الملك فهد
  const mushafBaseUrl = 'https://qurancomplex.gov.sa/wp-content/kfgqpc-quran/hafs';
  
  useEffect(() => {
    // تأخير تحميل قصير لإظهار حالة التحميل
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [pageNumber]);
  
  // تنسيق رقم الصفحة مع الأصفار القائدة للمطابقة مع تنسيق الملفات
  const formattedPageNumber = String(pageNumber).padStart(3, '0');
  
  // عنوان الصورة للصفحة الحالية
  const imageUrl = `${mushafBaseUrl}/hafs_page_${formattedPageNumber}.png`;
  
  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      onPageChange(pageNumber - 1);
    }
  };
  
  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      onPageChange(pageNumber + 1);
    }
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorDisplay message={error} />;
  }
  
  return (
    <div className="king-fahd-mushaf-container flex flex-col items-center">
      {/* أزرار التنقل بين الصفحات */}
      <div className="flex justify-between w-full mb-4 px-2">
        <button 
          onClick={handlePreviousPage}
          disabled={pageNumber <= 1}
          className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          الصفحة السابقة
        </button>
        
        <div className="flex items-center">
          <span className="text-lg font-amiri">صفحة {pageNumber} من {totalPages}</span>
        </div>
        
        <button 
          onClick={handleNextPage}
          disabled={pageNumber >= totalPages}
          className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          الصفحة التالية
        </button>
      </div>
      
      {/* عرض صفحة المصحف الشريف */}
      <div className="mushaf-page-container bg-amber-50 p-2 rounded-lg border border-amber-200 shadow-md max-w-3xl mx-auto">
        <div className="overflow-x-auto">
          <img 
            src={imageUrl} 
            alt={`صفحة ${pageNumber} من المصحف الشريف`}
            className="w-full h-auto"
            onError={() => setError("تعذر تحميل صفحة المصحف. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.")}
          />
        </div>
      </div>
      
      {/* معلومات إضافية عن الصفحة */}
      <div className="mt-4 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>مصحف المدينة المنورة للنشر الحاسوبي - مجمع الملك فهد لطباعة المصحف الشريف</p>
      </div>
    </div>
  );
}