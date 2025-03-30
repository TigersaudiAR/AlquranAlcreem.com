import { useState, useEffect, useCallback } from 'react';
import { APP_CONFIG } from '../../lib/constants';
import { getPageImagePath } from '../../lib/utils';

interface MushafPageProps {
  pageNumber: number;
  onPageClick?: (event: React.MouseEvent) => void;
  onVerseClick?: (surahNumber: number, verseNumber: number, verseText: string, event: React.MouseEvent) => void;
  showControls?: boolean;
  highlightedVerse?: { surah: number; ayah: number } | null;
}

export default function KingFahdMushafPage({
  pageNumber = APP_CONFIG.DEFAULT_PAGE,
  onPageClick,
  onVerseClick,
  showControls = false,
  highlightedVerse = null,
}: MushafPageProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  
  // التحقق من صحة رقم الصفحة
  const validatedPageNumber = Math.max(1, Math.min(pageNumber, APP_CONFIG.TOTAL_PAGES));
  const pagePath = getPageImagePath(validatedPageNumber);
  
  // معالج تحميل الصورة
  const handleImageLoad = useCallback(() => {
    setLoading(false);
    setIsImageLoaded(true);
  }, []);
  
  // معالج خطأ تحميل الصورة
  const handleImageError = useCallback(() => {
    setLoading(false);
    setError('لم نتمكن من تحميل صورة الصفحة');
  }, []);
  
  // إعادة تعيين الحالة عند تغيير رقم الصفحة
  useEffect(() => {
    setLoading(true);
    setError(null);
    setIsImageLoaded(false);
  }, [pageNumber]);
  
  // معالج النقر على الصفحة
  const handleClick = useCallback((event: React.MouseEvent) => {
    if (onPageClick) {
      onPageClick(event);
    }
  }, [onPageClick]);
  
  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {loading && !isImageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="p-4 bg-destructive text-destructive-foreground rounded-md">
            {error}
          </div>
        </div>
      )}
      
      <div 
        className="quran-page max-w-full max-h-full cursor-pointer select-none"
        onClick={handleClick}
      >
        <img
          src={pagePath}
          alt={`صفحة ${validatedPageNumber} من المصحف الشريف`}
          className="max-w-full max-h-full object-contain"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      
      {showControls && isImageLoaded && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {/* يمكن إضافة أزرار التحكم هنا */}
        </div>
      )}
    </div>
  );
}