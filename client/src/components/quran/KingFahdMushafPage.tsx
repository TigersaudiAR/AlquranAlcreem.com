import React, { useState, useEffect, useCallback } from 'react';
import { getQuranPageUrl, checkQuranApiAvailability } from '@/lib/quran-api';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface KingFahdMushafPageProps {
  page: number;
  onPageLoad?: () => void;
  onError?: (error: any) => void;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * مكون صفحة المصحف - يعرض صفحة واحدة من المصحف الشريف.
 */
export function KingFahdMushafPage({
  page,
  onPageLoad,
  onError,
  className,
  onClick,
}: KingFahdMushafPageProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState<boolean>(true);
  
  const fallbackImagePath = `/images/quran_pages/page_${page}.png`;

  // التحقق من توفر واجهة برمجة التطبيقات
  useEffect(() => {
    const checkApi = async () => {
      const isAvailable = await checkQuranApiAvailability();
      setApiAvailable(isAvailable);
      setLoading(false);
    };
    
    checkApi();
  }, []);
  
  // التعامل مع تحميل الصورة
  const handleImageLoad = useCallback(() => {
    setLoading(false);
    if (onPageLoad) onPageLoad();
  }, [onPageLoad]);
  
  // التعامل مع حدوث خطأ
  const handleImageError = useCallback((e: any) => {
    console.error('Error loading Quran page:', e);
    setError('تعذر تحميل صفحة المصحف');
    setLoading(false);
    if (onError) onError(e);
  }, [onError]);

  // تحديد مصدر الصورة - من واجهة برمجة التطبيقات أو السقوط للصور المحلية
  const imageSource = apiAvailable 
    ? getQuranPageUrl(page)
    : fallbackImagePath;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center mushaf-page w-full max-w-xl mx-auto',
        className
      )}
      onClick={onClick}
    >
      {loading && (
        <Skeleton className="w-full min-h-[600px] aspect-[0.7/1] rounded-md" />
      )}
      
      {error && !loading && (
        <div className="text-center p-4 text-red-500 bg-red-100 rounded-md my-4 w-full">
          <p className="text-lg font-semibold">{error}</p>
          <p className="text-sm">يرجى التحقق من الاتصال بالإنترنت أو المحاولة مرة أخرى لاحقًا.</p>
        </div>
      )}

      {!error && (
        <img
          src={imageSource}
          alt={`صفحة القرآن رقم ${page}`}
          className={cn(
            'w-full h-auto object-contain mushaf-page-image',
            loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
}