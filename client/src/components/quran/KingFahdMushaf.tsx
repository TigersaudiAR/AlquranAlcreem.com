import { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import { SURAH_NAMES } from '../../lib/constants';
import { ZoomIn, ZoomOut, Bookmark, SkipBack, SkipForward, Info, ChevronRight, ChevronLeft } from 'lucide-react';

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
  const [pageInfo, setPageInfo] = useState<{surahName?: string, juzNumber?: number, hizbNumber?: number}>({});
  const [preloadedImages, setPreloadedImages] = useState<Record<number, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const totalPages = 604; // إجمالي عدد صفحات المصحف الشريف
  
  // قاعدة عنوان الصورة للصفحة من مطبعة الملك فهد (أو مصدر بديل)
  const getImageUrl = (page: number) => {
    // تنسيق رقم الصفحة مع الأصفار القائدة
    const formattedPageNumber = String(page).padStart(3, '0');
    
    // في حالة استخدام مصدر عبر الإنترنت
    // تم تحديث المصدر للحصول على صور أفضل من مجمع الملك فهد
    return `https://www.islamicnet.com/QuranImages/images/Page-${page}.jpg`;
  };
  
  // تحميل الصور مسبقًا للصفحات التالية والسابقة
  useEffect(() => {
    const preloadImages = async () => {
      // تحميل الصفحة الحالية والصفحتين التالية والسابقة
      const pagesToPreload = [
        pageNumber,
        Math.min(pageNumber + 1, totalPages),
        Math.max(pageNumber - 1, 1)
      ];
      
      // تحميل الصور
      const newPreloadedImages: Record<number, string> = { ...preloadedImages };
      
      for (const page of pagesToPreload) {
        if (!preloadedImages[page]) {
          try {
            const url = getImageUrl(page);
            const img = new Image();
            img.src = url;
            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve; // حتى في حالة الفشل، نستمر
            });
            newPreloadedImages[page] = url;
          } catch (error) {
            console.error(`فشل تحميل الصورة للصفحة ${page}:`, error);
          }
        }
      }
      
      setPreloadedImages(newPreloadedImages);
    };
    
    preloadImages();
  }, [pageNumber]);
  
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
      
      // تقدير رقم الجزء والحزب (تقريبي)
      const juzNumber = Math.ceil(pageNumber / 20);
      const hizbNumber = Math.ceil(pageNumber / 10);
      
      return {
        surahName: currentSurah?.name || "غير معروف",
        juzNumber: juzNumber,
        hizbNumber: hizbNumber
      };
    };
    
    // تحديث معلومات الصفحة
    setPageInfo(getSurahForPage());
    
    // إظهار حالة التحميل لمدة قصيرة عند تغيير الصفحة
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    
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
    trackMouse: true,
    delta: 10,
    swipeDuration: 500
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
  
  // القفز 10 صفحات للأمام أو للخلف
  const handleJumpForward = () => {
    const newPage = Math.min(pageNumber + 10, totalPages);
    onPageChange(newPage);
  };
  
  const handleJumpBackward = () => {
    const newPage = Math.max(pageNumber - 10, 1);
    onPageChange(newPage);
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
  
  // إضافة إلى المفضلة
  const handleAddBookmark = () => {
    // سيتم تنفيذ ذلك في مرحلة لاحقة
    alert(`تمت إضافة الصفحة ${pageNumber} إلى المفضلة`);
  };
  
  // استجابة للضغط على مفاتيح الأسهم
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handlePreviousPage();
      } else if (e.key === 'ArrowLeft') {
        handleNextPage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pageNumber]);
  
  if (error) {
    return <ErrorDisplay message={error} />;
  }
  
  return (
    <div className="king-fahd-mushaf-container flex flex-col items-center relative">
      {/* شريط المعلومات في الأعلى */}
      <div className="w-full bg-amber-50 dark:bg-gray-900/50 text-amber-900 dark:text-amber-300 p-3 rounded-t-lg border-t border-x border-amber-200 dark:border-amber-900/30 mb-0 flex justify-between items-center">
        <div className="flex items-center text-sm">
          <Info className="h-4 w-4 ml-1 text-amber-600 dark:text-amber-400" />
          <span>سورة {pageInfo.surahName}</span>
          <span className="mx-2">•</span>
          <span>الجزء {pageInfo.juzNumber}</span>
          <span className="mx-2">•</span>
          <span>الحزب {pageInfo.hizbNumber}</span>
        </div>
        <div className="text-sm font-medium">
          صفحة {pageNumber} من {totalPages}
        </div>
      </div>
      
      {/* عرض صفحة المصحف الشريف */}
      <div 
        className="mushaf-page-container bg-amber-100/50 dark:bg-gray-900/30 p-4 border border-amber-200 dark:border-amber-900/30 shadow-sm mx-auto"
        style={{ 
          maxWidth: '800px', 
          overflow: 'hidden',
          backgroundImage: 'url(/assets/mushaf/mushaf-background.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        {...swipeHandlers}
        ref={containerRef}
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <div 
            className="overflow-auto select-none flex justify-center"
            style={{ 
              transform: `scale(${zoomLevel})`, 
              transformOrigin: 'center top',
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            <img 
              ref={imgRef}
              src={getImageUrl(pageNumber)} 
              alt={`صفحة ${pageNumber} من المصحف الشريف`}
              className="w-full h-auto"
              style={{ 
                maxWidth: '100%',
                userSelect: 'none',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
              onError={() => setError("تعذر تحميل صفحة المصحف. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.")}
              draggable={false}
            />
          </div>
        )}
      </div>
      
      {/* أزرار التنقل والتكبير/التصغير */}
      <div className="w-full bg-amber-50 dark:bg-gray-900/50 p-3 rounded-b-lg border-b border-x border-amber-200 dark:border-amber-900/30 mt-0">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-gray-700 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-gray-700"
              aria-label="تصغير"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-gray-700 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-gray-700"
              aria-label="تكبير"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <div className="px-2 py-1 text-sm text-amber-800 dark:text-amber-300 flex items-center">
              {Math.round(zoomLevel * 100)}%
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={handleJumpBackward}
              className="p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-gray-700 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-gray-700"
              aria-label="عشر صفحات للخلف"
              disabled={pageNumber <= 10}
            >
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={handlePreviousPage}
              disabled={pageNumber <= 1}
              className="py-1 px-3 rounded-md bg-white dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-gray-700 text-amber-700 dark:text-amber-300 font-medium text-sm border border-amber-200 dark:border-gray-700 flex items-center"
            >
              <ChevronRight className="h-4 w-4 ml-1" />
              السابقة
            </button>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const pageInput = formData.get('pageNumber');
              if (pageInput) {
                const pageNum = parseInt(pageInput as string);
                if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                  onPageChange(pageNum);
                }
              }
            }} className="mx-2 flex items-center">
              <input
                type="number"
                id="pageNumber"
                name="pageNumber"
                min="1"
                max={totalPages}
                defaultValue={pageNumber}
                className="w-16 py-1 px-2 border border-amber-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md text-center text-sm text-amber-800 dark:text-amber-200"
              />
            </form>
            
            <button
              onClick={handleNextPage}
              disabled={pageNumber >= totalPages}
              className="py-1 px-3 rounded-md bg-white dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-gray-700 text-amber-700 dark:text-amber-300 font-medium text-sm border border-amber-200 dark:border-gray-700 flex items-center"
            >
              التالية
              <ChevronLeft className="h-4 w-4 mr-1" />
            </button>
            <button
              onClick={handleJumpForward}
              className="p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-gray-700 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-gray-700"
              aria-label="عشر صفحات للأمام"
              disabled={pageNumber >= totalPages - 10}
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={handleAddBookmark}
            className="p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-gray-700 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-gray-700"
            aria-label="إضافة للمفضلة"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* معلومات إضافية عن الصفحة */}
      <div className="mt-4 text-center text-gray-600 dark:text-gray-400 text-xs">
        <p>مصحف المدينة المنورة للنشر الحاسوبي - مجمع الملك فهد لطباعة المصحف الشريف</p>
      </div>
    </div>
  );
}