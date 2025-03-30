import { useState, useCallback } from 'react';
import KingFahdMushaf from '../components/quran/KingFahdMushaf';
import QuranNavSidebar from '../components/quran/QuranNavSidebar';
import { APP_CONFIG } from '../lib/constants';

export default function Quran() {
  const [currentPage, setCurrentPage] = useState<number>(APP_CONFIG.DEFAULT_PAGE);
  const [currentSurah, setCurrentSurah] = useState<number>(APP_CONFIG.DEFAULT_SURAH);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  
  // معالج تغيير الصفحة
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  // معالج تغيير السورة
  const handleSurahChange = useCallback((surah: number) => {
    setCurrentSurah(surah);
  }, []);
  
  // فتح الشريط الجانبي
  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);
  
  // إغلاق الشريط الجانبي
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);
  
  // تحديد صفحة
  const handlePageSelect = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  // تحديد سورة
  const handleSurahSelect = useCallback((surahNumber: number) => {
    setCurrentSurah(surahNumber);
  }, []);
  
  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* عرض المصحف */}
      <KingFahdMushaf
        initialPage={currentPage}
        initialSurah={currentSurah}
        onPageChange={handlePageChange}
        onSurahChange={handleSurahChange}
      />
      
      {/* شريط التنقل الجانبي */}
      <QuranNavSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        currentPage={currentPage}
        currentSurah={currentSurah}
        onPageChange={handlePageSelect}
        onSurahSelect={handleSurahSelect}
      />
    </div>
  );
}