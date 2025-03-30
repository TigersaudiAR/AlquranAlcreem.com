import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import KingFahdMushaf from '../components/quran/KingFahdMushaf';
import QuranNavSidebar from '../components/quran/QuranNavSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../hooks/use-toast';
import { useParams } from 'wouter';

/**
 * صفحة عرض القرآن الكريم بالنص والتلاوة
 * توفر واجهة بسيطة ومريحة لقراءة وسماع القرآن
 */
const QuranPage: React.FC = () => {
  const { settings, lastRead, bookmarks } = useApp();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(lastRead?.pageNumber || 1);
  const { toast } = useToast();

  // مراقبة وضع ملء الشاشة
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // تبديل وضع ملء الشاشة
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
      toast({
        title: "تنبيه",
        description: "تعذر تفعيل وضع ملء الشاشة. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  };

  // تغيير الصفحة الحالية
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // فتح وإغلاق القائمة الجانبية
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // التنقل إلى إشارة مرجعية
  const goToBookmark = (bookmark: { surahNumber: number; ayahNumber: number; pageNumber: number }) => {
    setCurrentPage(bookmark.pageNumber);
    setIsSidebarOpen(false);
  };

  return (
    <div className="quran-page-container min-h-screen bg-amber-50/50 dark:bg-gray-900">
      {/* شريط التنقل العلوي */}
      <AnimatePresence>
        {!isFullscreen && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="py-4 px-6 bg-white dark:bg-gray-800 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-amber-700 dark:text-amber-300">القرآن الكريم</h1>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
                  aria-label="فتح القائمة الجانبية"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
                  aria-label={isFullscreen ? "إنهاء وضع ملء الشاشة" : "تفعيل وضع ملء الشاشة"}
                >
                  {isFullscreen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* محتوى الصفحة الرئيسي */}
      <main className={`container mx-auto px-4 py-6 ${isFullscreen ? 'pt-0' : 'pt-4'}`}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* القائمة الجانبية */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3 }}
                className="lg:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-md h-[85vh] overflow-hidden"
              >
                <QuranNavSidebar 
                  currentPage={currentPage}
                  onPageSelect={(page: number) => {
                    setCurrentPage(page);
                    setIsSidebarOpen(false);
                  }}
                  onSurahSelect={(surah: number) => {
                    // تحديد الصفحة بناء على رقم السورة (يمكن استخدام API لتحديد الصفحة الدقيقة)
                    // هذا تنفيذ مبسط
                    const estimatedPage = Math.max(1, Math.min(604, Math.floor(surah * 5.3)));
                    setCurrentPage(estimatedPage);
                    setIsSidebarOpen(false);
                  }}
                  onJuzSelect={(juz: number) => {
                    // تحديد الصفحة بناء على رقم الجزء (يمكن استخدام API لتحديد الصفحة الدقيقة)
                    // تقدير بسيط: كل جزء يمثل حوالي 20 صفحة
                    const estimatedPage = Math.max(1, Math.min(604, (juz - 1) * 20 + 1));
                    setCurrentPage(estimatedPage);
                    setIsSidebarOpen(false);
                  }}
                  onClose={() => setIsSidebarOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* عرض المصحف */}
          <div className={`mushaf-container ${isSidebarOpen ? 'lg:w-3/4' : 'w-full'}`}>
            <KingFahdMushaf 
              initialPage={currentPage} 
              onNavigate={handlePageChange}
              onVerseSelect={(surahNumber, ayahNumber) => {
                // يمكن تنفيذ منطق إضافي هنا - مثلاً: تشغيل الصوت لهذه الآية
                console.log(`Verse selected: Surah ${surahNumber}, Ayah ${ayahNumber}`);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuranPage;