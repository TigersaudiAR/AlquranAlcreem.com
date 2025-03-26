import { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import { SURAH_NAMES } from '../../lib/constants';

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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pageInfo, setPageInfo] = useState<{surahName?: string, juzNumber?: number}>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const totalPages = 604; // إجمالي عدد صفحات المصحف الشريف
  
  // قاعدة عنوان الصورة للصفحة من مطبعة الملك فهد (أو مصدر بديل)
  // نستخدم مصدر بديل محلي أو عبر الإنترنت
  const getImageUrl = (page: number) => {
    // تنسيق رقم الصفحة مع الأصفار القائدة
    const formattedPageNumber = String(page).padStart(3, '0');
    
    // أولاً، نحاول استخدام النسخة المحلية إذا كانت متوفرة
    const localUrl = `/assets/mushaf/page_${formattedPageNumber}.png`;
    
    // في حالة عدم توفر النسخة المحلية، نستخدم مصدر عبر الإنترنت
    const remoteUrl = `https://www.islamicnet.com/QuranImages/images/Page-${page}.jpg`;
    
    // نعيد المصدر المناسب
    return remoteUrl;
  };
  
  // تحديد معلومات السورة والجزء للصفحة الحالية
  useEffect(() => {
    setIsLoading(true);
    
    // الحصول على معلومات السورة للصفحة الحالية
    const getSurahForPage = () => {
      // البحث عن السورة التي تبدأ في هذه الصفحة أو قبلها
      let currentSurah = SURAH_NAMES[0]; // نبدأ بسورة الفاتحة
      
      for (let i = 0; i < SURAH_NAMES.length; i++) {
        const surah = SURAH_NAMES[i];
        // إذا كانت السورة التالية تبدأ بعد الصفحة الحالية، فإن السورة الحالية هي الصحيحة
        if (i === SURAH_NAMES.length - 1 || 
            (SURAH_NAMES[i+1]?.page && SURAH_NAMES[i+1]?.page > pageNumber)) {
          currentSurah = surah;
          break;
        }
      }
      
      // تقدير رقم الجزء (تقريبي)
      const juzNumber = Math.ceil(pageNumber / 20);
      
      return {
        surahName: currentSurah?.name || "غير معروف",
        juzNumber: juzNumber
      };
    };
    
    // تحديث معلومات الصفحة
    setPageInfo(getSurahForPage());
    
    // إظهار حالة التحميل لمدة قصيرة عند تغيير الصفحة
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [pageNumber]);
  
  // التعامل مع سحب الصفحة يمينًا أو يسارًا (على الأجهزة اللمسية)
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (pageNumber > 1) {
        onPageChange(pageNumber - 1);
      }
    },
    onSwipedLeft: () => {
      if (pageNumber < totalPages) {
        onPageChange(pageNumber + 1);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: false
  });
  
  // التنقل بين الصفحات
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
  
  // التنقل إلى صفحة محددة
  const handleGoToPage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pageInput = formData.get('pageNumber');
    if (pageInput) {
      const pageNum = parseInt(pageInput as string);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        onPageChange(pageNum);
      }
    }
  };
  
  // التكبير والتصغير
  const handleZoomIn = () => {
    if (zoomLevel < 2) {
      setZoomLevel(prevZoom => prevZoom + 0.1);
    }
  };
  
  const handleZoomOut = () => {
    if (zoomLevel > 0.6) {
      setZoomLevel(prevZoom => prevZoom - 0.1);
    }
  };
  
  // استجابة للضغط على مفاتيح الأسهم
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        handlePreviousPage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pageNumber]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorDisplay message={error} />;
  }
  
  return (
    <div className="king-fahd-mushaf-container flex flex-col items-center">
      {/* أزرار التنقل بين الصفحات وأدوات التحكم */}
      <div className="flex justify-between w-full mb-4 px-2 flex-wrap gap-2">
        <button 
          onClick={handlePreviousPage}
          disabled={pageNumber <= 1}
          className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          الصفحة السابقة
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-lg font-amiri">صفحة {pageNumber} من {totalPages}</span>
          {pageInfo.surahName && (
            <span className="text-sm text-gray-600 dark:text-gray-400">سورة {pageInfo.surahName} - الجزء {pageInfo.juzNumber}</span>
          )}
        </div>
        
        <button 
          onClick={handleNextPage}
          disabled={pageNumber >= totalPages}
          className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          الصفحة التالية
        </button>
      </div>
      
      {/* عناصر التحكم الإضافية (التكبير/التصغير، الانتقال لصفحة محددة) */}
      <div className="flex justify-center w-full mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-2 rounded"
            aria-label="تصغير"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          
          <span className="text-sm">{Math.round(zoomLevel * 100)}%</span>
          
          <button
            onClick={handleZoomIn}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-2 rounded"
            aria-label="تكبير"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleGoToPage} className="flex items-center gap-2">
          <label htmlFor="pageNumber" className="text-sm">الانتقال إلى:</label>
          <input
            type="number"
            id="pageNumber"
            name="pageNumber"
            min="1"
            max={totalPages}
            defaultValue={pageNumber}
            className="w-16 py-1 px-2 border border-gray-300 dark:border-gray-600 rounded text-center"
          />
          <button
            type="submit"
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 rounded text-sm"
          >
            انتقال
          </button>
        </form>
      </div>
      
      {/* عرض صفحة المصحف الشريف */}
      <div 
        className="mushaf-page-container bg-amber-50 p-4 rounded-lg border border-amber-200 shadow-md mx-auto mushaf-frame"
        style={{ maxWidth: '800px', overflow: 'hidden' }}
        {...swipeHandlers}
        ref={containerRef}
      >
        <div 
          className="overflow-auto select-none"
          style={{ 
            transform: `scale(${zoomLevel})`, 
            transformOrigin: 'center top',
            transition: 'transform 0.2s ease-in-out'
          }}
        >
          <img 
            src={getImageUrl(pageNumber)} 
            alt={`صفحة ${pageNumber} من المصحف الشريف`}
            className="w-full h-auto"
            style={{ 
              maxWidth: '100%',
              userSelect: 'none',
            }}
            onError={() => setError("تعذر تحميل صفحة المصحف. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.")}
            draggable={false}
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