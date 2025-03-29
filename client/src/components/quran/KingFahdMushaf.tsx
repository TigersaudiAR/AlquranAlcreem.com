import React, { useState, useEffect, useRef } from 'react';
import { SURAH_NAMES } from '../../lib/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import { useToast } from '../../hooks/use-toast';
import { useApp } from '../../context/AppContext';
import TafsirDialog from './TafsirDialog';
import SelectionMenu from './SelectionMenu';
import { useSelection } from '../../hooks/use-selection';
import { copyQuranText, shareQuranPage } from '../../lib/quran-share';

interface KingFahdMushafProps {
  pageNumber: number;
  onPageChange: (page: number) => void;
  hideControls?: boolean;
}

/**
 * مكوّن عرض مصحف الملك فهد للطباعة
 * يعرض صفحات المصحف بالتصميم الرسمي مع إمكانية الانتقال بين الصفحات
 */
const KingFahdMushaf: React.FC<KingFahdMushafProps> = ({
  pageNumber,
  onPageChange,
  hideControls = false
}) => {
  const { toast } = useToast();
  const { addBookmark, updateLastRead, settings } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  
  // مكان العرض للتفسير والإشارات المرجعية
  const [showTafsir, setShowTafsir] = useState(false);
  const [currentAyah, setCurrentAyah] = useState<{
    surahNumber: number;
    ayahNumber: number;
    ayahText: string;
  } | null>(null);
  
  // قائمة تحديد النص
  const { 
    selectedText, 
    selectionMenuVisible, 
    selectionPosition, 
    setSelectionMenuVisible 
  } = useSelection();
  
  // تحميل صورة الصفحة المناسبة
  useEffect(() => {
    if (pageNumber < 1 || pageNumber > 604) {
      setError('رقم الصفحة غير صالح. يجب أن يكون بين 1 و 604.');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    // محاولة تحميل الصفحة من المصادر المختلفة
    const loadImage = async () => {
      const sources = [
        `/quran/hafs/${pageNumber.toString().padStart(3, '0')}.png`,
        `https://quran-images.qurancomplex.gov.sa/hafs/${pageNumber.toString().padStart(3, '0')}.png`,
        `https://www.islamicnet.com/islamic-library/assets/quran-images/page${pageNumber}.png`
      ];
      
      let loaded = false;
      
      for (const src of sources) {
        try {
          const img = new Image();
          img.src = src;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          
          setImageUrl(src);
          setImgWidth(img.naturalWidth);
          setImgHeight(img.naturalHeight);
          loaded = true;
          break;
        } catch (err) {
          console.error(`فشل تحميل الصورة من المصدر: ${src}`, err);
        }
      }
      
      if (!loaded) {
        setError('تعذر تحميل صفحة المصحف. يرجى التحقق من اتصالك بالإنترنت وحاول مرة أخرى.');
      }
      
      setIsLoading(false);
    };
    
    loadImage();
    
    // حفظ موضع القراءة الحالي إذا كان الخيار مفعلاً
    if (settings.autoSaveLastRead) {
      // البحث عن السورة المناسبة لهذه الصفحة
      let surahNumber = 1;
      for (let i = 0; i < SURAH_NAMES.length; i++) {
        if (i === SURAH_NAMES.length - 1 || 
            (SURAH_NAMES[i+1]?.page && SURAH_NAMES[i+1]?.page > pageNumber)) {
          surahNumber = SURAH_NAMES[i].number;
          break;
        }
      }
      
      updateLastRead({
        surahNumber,
        ayahNumber: 1, // لا يمكن تحديد رقم الآية بدقة هنا
        pageNumber
      });
    }
  }, [pageNumber, settings.autoSaveLastRead, updateLastRead]);
  
  // ضبط الحجم والتكبير بناءً على حجم النافذة
  useEffect(() => {
    if (!containerRef.current || !imgRef.current || imgWidth === 0 || imgHeight === 0) return;
    
    const updateSize = () => {
      const container = containerRef.current;
      if (!container) return;
      
      // حساب نسبة العرض المناسبة للشاشة
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      const widthRatio = containerWidth / imgWidth;
      const heightRatio = containerHeight / imgHeight;
      
      // استخدام النسبة الأصغر للتأكد من ظهور الصورة كاملة
      const ratio = Math.min(widthRatio, heightRatio) * 0.9;
      
      setCurrentZoom(ratio);
    };
    
    updateSize();
    
    const handleResize = () => {
      updateSize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [imgWidth, imgHeight]);
  
  // معالج التكبير والتصغير
  const handleZoom = (zoomIn: boolean) => {
    if (zoomIn) {
      setCurrentZoom(prev => Math.min(prev * 1.2, 3));
    } else {
      setCurrentZoom(prev => Math.max(prev * 0.8, 0.5));
    }
  };
  
  // معالجات السحب والتنقل
  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentZoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      containerRef.current.scrollLeft = scrollPosition.x - deltaX;
      containerRef.current.scrollTop = scrollPosition.y - deltaY;
    }
  };
  
  const handleMouseUp = () => {
    if (isDragging && containerRef.current) {
      setScrollPosition({
        x: containerRef.current.scrollLeft,
        y: containerRef.current.scrollTop
      });
      setIsDragging(false);
    }
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      handleZoom(e.deltaY < 0);
    }
  };
  
  // الانتقال إلى الصفحة السابقة/التالية باستخدام لوحة المفاتيح
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageUp') {
        if (pageNumber > 1) {
          onPageChange(pageNumber - 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageDown') {
        if (pageNumber < 604) {
          onPageChange(pageNumber + 1);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pageNumber, onPageChange]);
  
  // معالج إظهار تفسير الآية
  const handleShowTafsir = () => {
    // في الواقع نحتاج إلى معرفة رقم السورة والآية من النص المحدد
    // هنا نفترض أننا نحصل عليهما بطريقة ما
    
    // Determine the surah for this page
    let surahNumber = 1;
    for (let i = 0; i < SURAH_NAMES.length; i++) {
      if (i === SURAH_NAMES.length - 1 || 
          (SURAH_NAMES[i+1]?.page && SURAH_NAMES[i+1]?.page > pageNumber)) {
        surahNumber = SURAH_NAMES[i].number;
        break;
      }
    }
    
    setCurrentAyah({
      surahNumber,
      ayahNumber: 1, // يجب تحديد رقم الآية بدقة في التطبيق الحقيقي
      ayahText: selectedText
    });
    
    setShowTafsir(true);
    setSelectionMenuVisible(false);
  };
  
  // معالج إضافة إشارة مرجعية
  const handleBookmark = () => {
    // Determine the surah for this page
    let surahNumber = 1;
    for (let i = 0; i < SURAH_NAMES.length; i++) {
      if (i === SURAH_NAMES.length - 1 || 
          (SURAH_NAMES[i+1]?.page && SURAH_NAMES[i+1]?.page > pageNumber)) {
        surahNumber = SURAH_NAMES[i].number;
        break;
      }
    }
    
    addBookmark({
      surahNumber,
      ayahNumber: 1, // يجب تحديد رقم الآية بدقة في التطبيق الحقيقي
      pageNumber
    });
    
    toast({
      title: "تمت الإضافة",
      description: "تمت إضافة الإشارة المرجعية بنجاح",
    });
    
    setSelectionMenuVisible(false);
  };
  
  // معالج نسخ النص المحدد
  const handleCopy = async () => {
    // Determine the surah for this page
    let surahNumber = 1;
    let surahName = '';
    
    for (let i = 0; i < SURAH_NAMES.length; i++) {
      if (i === SURAH_NAMES.length - 1 || 
          (SURAH_NAMES[i+1]?.page && SURAH_NAMES[i+1]?.page > pageNumber)) {
        surahNumber = SURAH_NAMES[i].number;
        surahName = SURAH_NAMES[i].name;
        break;
      }
    }
    
    const success = await copyQuranText(selectedText, pageNumber, surahName);
    
    if (success) {
      toast({
        title: "تم النسخ",
        description: "تم نسخ النص المحدد إلى الحافظة",
      });
    } else {
      toast({
        title: "خطأ",
        description: "تعذر نسخ النص. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
    
    setSelectionMenuVisible(false);
  };
  
  // معالج مشاركة النص المحدد
  const handleShare = async () => {
    // Determine the surah for this page
    let surahNumber = 1;
    let surahName = '';
    
    for (let i = 0; i < SURAH_NAMES.length; i++) {
      if (i === SURAH_NAMES.length - 1 || 
          (SURAH_NAMES[i+1]?.page && SURAH_NAMES[i+1]?.page > pageNumber)) {
        surahNumber = SURAH_NAMES[i].number;
        surahName = SURAH_NAMES[i].name;
        break;
      }
    }
    
    const success = await shareQuranPage(pageNumber, surahName, selectedText);
    
    if (success) {
      toast({
        title: "تمت المشاركة",
        description: "تمت مشاركة النص المحدد بنجاح",
      });
    } else {
      toast({
        title: "تم نسخ الرابط",
        description: "تم نسخ رابط المشاركة إلى الحافظة",
      });
    }
    
    setSelectionMenuVisible(false);
  };
  
  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoadingSpinner />
      </div>
    );
  }
  
  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ErrorDisplay message={error} />
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-center overflow-auto relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* صورة المصحف */}
      <img
        ref={imgRef}
        src={imageUrl}
        alt={`صفحة ${pageNumber} من المصحف الشريف`}
        className="select-text"
        style={{
          width: imgWidth * currentZoom,
          height: imgHeight * currentZoom,
          cursor: isDragging ? 'grabbing' : currentZoom > 1 ? 'grab' : 'default',
          userSelect: 'text'
        }}
      />
      
      {/* قائمة تحديد النص */}
      <SelectionMenu
        visible={selectionMenuVisible}
        position={selectionPosition}
        onCopy={handleCopy}
        onShare={handleShare}
        onBookmark={handleBookmark}
        onView={handleShowTafsir}
      />
      
      {/* نافذة التفسير المنبثقة */}
      <TafsirDialog
        isOpen={showTafsir}
        onClose={() => setShowTafsir(false)}
        surahNumber={currentAyah?.surahNumber || 1}
        ayahNumber={currentAyah?.ayahNumber || 1}
        ayahText={currentAyah?.ayahText || ''}
      />
      
      {/* أزرار التكبير والتصغير */}
      {!hideControls && (
        <div className="absolute bottom-20 left-4 flex flex-col gap-2 z-10">
          <button
            onClick={() => handleZoom(true)}
            className="w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-md text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          <button
            onClick={() => handleZoom(false)}
            className="w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-md text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default KingFahdMushaf;