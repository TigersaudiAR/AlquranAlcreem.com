import React, { useEffect, useState, useRef } from 'react';
import { getPage, getAudioUrl } from '../../lib/quran-api';
import { useApp } from '../../context/AppContext';
import HighlightedVerse from './HighlightedVerse';
import { useToast } from '../../hooks/use-toast';
import { useQuranAudio } from '../../hooks/useQuranAudio';
import { motion, AnimatePresence } from 'framer-motion';

interface KingFahdMushafProps {
  initialPage?: number;
  showControls?: boolean;
  onPageChange?: (page: number) => void;
}

/**
 * مكون عرض المصحف الشريف بتنسيق مصحف الملك فهد
 * يقوم بعرض صفحات المصحف مع دعم التلاوة والتمييز
 */
const KingFahdMushaf: React.FC<KingFahdMushafProps> = ({
  initialPage = 1,
  showControls = true,
  onPageChange,
}) => {
  const { settings, updateLastRead } = useApp();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVerse, setActiveVerse] = useState<{surah: number, verse: number} | null>(null);
  const [translations, setTranslations] = useState<any>(null);
  const [isControlsVisible, setIsControlsVisible] = useState(showControls);
  const { toast } = useToast();
  const pageRef = useRef<HTMLDivElement>(null);
  const mouseMoveTimeout = useRef<number | null>(null);

  // استخدام خطاف التلاوة للتحكم في الصوت
  const { 
    play, 
    pause, 
    isPlaying, 
    currentVerse,
    setAudioSrc,
    currentAudioElement,
    playNextVerse
  } = useQuranAudio(settings.reciter);

  // جلب بيانات الصفحة عند تغيير رقم الصفحة
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        setError(null);

        // جلب نص الصفحة من القرآن
        const data = await getPage(currentPage);
        setPageData(data);

        // جلب الترجمة إذا كانت مفعلة في الإعدادات
        if (settings.showTranslation && settings.translation) {
          // هنا يمكن إضافة استدعاء لجلب الترجمة وتخزينها في حالة translations
          // لتبسيط المثال، نستخدم كائن فارغ
          setTranslations({});
        }

        // تحديث آخر موقع قراءة
        if (settings.autoSaveLastRead) {
          const firstAyah = data.data.ayahs[0];
          updateLastRead({
            surahNumber: firstAyah.surah.number,
            ayahNumber: firstAyah.numberInSurah,
            pageNumber: currentPage
          });
        }

      } catch (err) {
        console.error("Error fetching page data:", err);
        setError("حدث خطأ أثناء تحميل صفحة المصحف. الرجاء المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();

    // استدعاء دالة التغيير إذا كانت موجودة
    if (onPageChange) {
      onPageChange(currentPage);
    }
  }, [currentPage, settings.showTranslation, settings.translation, settings.autoSaveLastRead, updateLastRead, onPageChange]);

  // التحكم في ظهور واختفاء عناصر التحكم عند تحريك الماوس
  useEffect(() => {
    const handleMouseMove = () => {
      setIsControlsVisible(true);

      if (mouseMoveTimeout.current) {
        window.clearTimeout(mouseMoveTimeout.current);
      }

      mouseMoveTimeout.current = window.setTimeout(() => {
        setIsControlsVisible(false);
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseMoveTimeout.current) {
        window.clearTimeout(mouseMoveTimeout.current);
      }
    };
  }, []);

  // الانتقال إلى الصفحة التالية
  const goToNextPage = () => {
    if (currentPage < 604) {
      setCurrentPage(prev => prev + 1);
      setActiveVerse(null);
    } else {
      toast({
        title: "تنبيه",
        description: "أنت في آخر صفحة من المصحف",
        variant: "default"
      });
    }
  };

  // الانتقال إلى الصفحة السابقة
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setActiveVerse(null);
    } else {
      toast({
        title: "تنبيه",
        description: "أنت في أول صفحة من المصحف",
        variant: "default"
      });
    }
  };

  // تشغيل تلاوة الآية
  const handleVersePlay = (surahNumber: number, verseNumber: number) => {
    const audioUrl = getAudioUrl(surahNumber, verseNumber, settings.reciter);
    setAudioSrc(audioUrl, surahNumber, verseNumber);
    setActiveVerse({ surah: surahNumber, verse: verseNumber });
    play();

    // تتبع الآية التالية لتشغيلها بعد انتهاء الحالية
    if (pageData && pageData.data.ayahs) {
      const ayahs = pageData.data.ayahs;
      const currentIndex = ayahs.findIndex(
        (ayah: any) => ayah.surah.number === surahNumber && ayah.numberInSurah === verseNumber
      );

      if (currentIndex < ayahs.length - 1) {
        const nextAyah = ayahs[currentIndex + 1];
        const nextAudioUrl = getAudioUrl(
          nextAyah.surah.number,
          nextAyah.numberInSurah,
          settings.reciter
        );

        // إضافة معالج انتهاء الصوت الحالي
        if (currentAudioElement) {
          currentAudioElement.onended = () => {
            if (settings.autoPlayAudio) {
              playNextVerse();
              setActiveVerse({ 
                surah: nextAyah.surah.number, 
                verse: nextAyah.numberInSurah 
              });
            }
          };
        }
      } else if (settings.autoPlayAudio && currentPage < 604) {
        // إذا كانت آخر آية في الصفحة، انتقل إلى الصفحة التالية
        if (currentAudioElement) {
          currentAudioElement.onended = () => {
            goToNextPage();
          };
        }
      }
    }
  };

  // إيقاف التلاوة
  const handlePausePlayback = () => {
    pause();
  };

  // عند النقر على الآية
  const handleVerseClick = (surahNumber: number, verseNumber: number) => {
    setActiveVerse({ surah: surahNumber, verse: verseNumber });

    // تشغيل التلاوة تلقائيًا إذا كان الإعداد مفعلاً
    if (settings.autoPlayAudio) {
      handleVersePlay(surahNumber, verseNumber);
    }
  };

  // تأثيرات الانتقال بين الصفحات
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 50
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.2
      }
    }
  };

  // عرض رسالة التحميل
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-amber-200 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-amber-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-lg font-medium text-amber-600 dark:text-amber-400">جارِ تحميل الصفحة...</p>
        </div>
      </div>
    );
  }

  // عرض رسالة الخطأ
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 max-w-lg text-center">
          <div className="text-red-500 dark:text-red-400 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">خطأ في التحميل</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={() => setCurrentPage(currentPage)} 
            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={pageRef}
      className="quran-mushaf-container relative bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg shadow-md"
    >
      {/* عنوان الصفحة والسورة */}
      <div className="page-header mb-6 text-center">
        <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-200">
          {pageData?.data?.ayahs[0]?.surah?.name || "سورة القرآن"}
        </h2>
        <div className="page-number text-sm text-amber-600 dark:text-amber-400">
          صفحة {currentPage} من 604
        </div>
      </div>

      {/* عرض الآيات */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="verses-container my-4 space-y-4"
          dir="rtl"
        >
          {pageData?.data?.ayahs.map((ayah: any) => (
            <HighlightedVerse
              key={`${ayah.surah.number}-${ayah.numberInSurah}`}
              verseText={ayah.text}
              verseNumber={ayah.numberInSurah}
              surahNumber={ayah.surah.number}
              isActive={
                activeVerse?.surah === ayah.surah.number && 
                activeVerse?.verse === ayah.numberInSurah
              }
              isPlaying={
                isPlaying && 
                currentVerse?.surah === ayah.surah.number && 
                currentVerse?.verse === ayah.numberInSurah
              }
              onClick={() => handleVerseClick(ayah.surah.number, ayah.numberInSurah)}
              fontSize={settings.fontSize}
              withAnimation={settings.highlightCurrentVerse}
              translation={
                settings.showTranslation && translations ? 
                translations[`${ayah.surah.number}:${ayah.numberInSurah}`] : 
                undefined
              }
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* عناصر التحكم */}
      <AnimatePresence>
        {isControlsVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="controls-container fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg z-10"
          >
            <button 
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
              className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="الصفحة السابقة"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {isPlaying ? (
              <button 
                onClick={handlePausePlayback}
                className="p-3 rounded-full bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                title="إيقاف التلاوة"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            ) : activeVerse && (
              <button 
                onClick={() => handleVersePlay(activeVerse.surah, activeVerse.verse)}
                className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                title="تشغيل التلاوة"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}

            <button 
              onClick={goToNextPage}
              disabled={currentPage >= 604}
              className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="الصفحة التالية"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="page-input-container flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={604}
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="w-16 p-2 text-center rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">/ 604</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KingFahdMushaf;