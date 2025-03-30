import { useState, useCallback, useEffect } from 'react';
import { useTheme } from '../../components/theme-provider';
import { SURAH_NAMES, APP_CONFIG } from '../../lib/constants';
import { useToast } from '../../hooks/use-toast';
import KingFahdMushafPage from './KingFahdMushafPage';

// الصفحة الأولى لكل سورة
const SURAH_FIRST_PAGES: Record<number, number> = {
  1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 6: 128, 7: 151, 8: 177, 9: 187, 10: 208,
  11: 221, 12: 235, 13: 249, 14: 255, 15: 262, 16: 267, 17: 282, 18: 293, 19: 305, 20: 312,
  21: 322, 22: 332, 23: 342, 24: 350, 25: 359, 26: 367, 27: 377, 28: 385, 29: 396, 30: 404,
  31: 411, 32: 415, 33: 418, 34: 428, 35: 434, 36: 440, 37: 446, 38: 453, 39: 458, 40: 467,
  41: 477, 42: 483, 43: 489, 44: 496, 45: 499, 46: 502, 47: 507, 48: 511, 49: 515, 50: 518,
  51: 520, 52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537, 58: 542, 59: 545, 60: 549,
  61: 551, 62: 553, 63: 554, 64: 556, 65: 558, 66: 560, 67: 562, 68: 564, 69: 566, 70: 568,
  71: 570, 72: 572, 73: 574, 74: 575, 75: 577, 76: 578, 77: 580, 78: 582, 79: 583, 80: 585,
  81: 586, 82: 587, 83: 587, 84: 589, 85: 590, 86: 591, 87: 591, 88: 592, 89: 593, 90: 594,
  91: 595, 92: 595, 93: 596, 94: 596, 95: 597, 96: 597, 97: 598, 98: 598, 99: 599,
  100: 599, 101: 600, 102: 600, 103: 601, 104: 601, 105: 601, 106: 602, 107: 602,
  108: 602, 109: 603, 110: 603, 111: 603, 112: 604, 113: 604, 114: 604
};

interface KingFahdMushafProps {
  initialPage?: number;
  initialSurah?: number;
  onPageChange?: (page: number) => void;
  onSurahChange?: (surah: number) => void;
}

export default function KingFahdMushaf({
  initialPage = APP_CONFIG.DEFAULT_PAGE,
  initialSurah = APP_CONFIG.DEFAULT_SURAH,
  onPageChange,
  onSurahChange,
}: KingFahdMushafProps) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [currentSurah, setCurrentSurah] = useState<number>(initialSurah);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  // استخدام الثيم من سياق التطبيق
  let theme: 'light' | 'dark' = 'light';
  try {
    const themeContext = useTheme();
    theme = themeContext.theme as 'light' | 'dark';
  } catch (error) {
    console.warn("Could not get theme from context, using default light theme");
  }
  const { toast } = useToast();
  
  // تحديث صفحة البداية استنادًا إلى السورة المحددة
  useEffect(() => {
    if (initialSurah && SURAH_FIRST_PAGES[initialSurah]) {
      setCurrentPage(SURAH_FIRST_PAGES[initialSurah]);
    }
  }, [initialSurah]);
  
  // تحديث رقم السورة الحالية استنادًا إلى الصفحة الحالية
  useEffect(() => {
    // البحث عن السورة التي تبدأ في هذه الصفحة أو قبلها
    let foundSurah = 1;
    for (let i = 1; i <= 114; i++) {
      if (SURAH_FIRST_PAGES[i] <= currentPage) {
        foundSurah = i;
      } else {
        break;
      }
    }
    
    if (foundSurah !== currentSurah) {
      setCurrentSurah(foundSurah);
      if (onSurahChange) {
        onSurahChange(foundSurah);
      }
    }
    
    if (onPageChange) {
      onPageChange(currentPage);
    }
  }, [currentPage, currentSurah, onPageChange, onSurahChange]);
  
  // التنقل إلى الصفحة التالية
  const goToNextPage = useCallback(() => {
    if (currentPage < APP_CONFIG.TOTAL_PAGES) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [currentPage]);
  
  // التنقل إلى الصفحة السابقة
  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  }, [currentPage]);
  
  // التنقل إلى صفحة محددة
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= APP_CONFIG.TOTAL_PAGES) {
      setCurrentPage(page);
    }
  }, []);
  
  // التنقل إلى سورة محددة
  const goToSurah = useCallback((surahNumber: number) => {
    if (surahNumber >= 1 && surahNumber <= 114 && SURAH_FIRST_PAGES[surahNumber]) {
      setCurrentPage(SURAH_FIRST_PAGES[surahNumber]);
      setCurrentSurah(surahNumber);
      toast({
        title: `سورة ${SURAH_NAMES[surahNumber - 1].name}`,
        description: "تم الانتقال إلى بداية السورة",
        duration: 2000,
      });
    }
  }, [toast]);
  
  // التحكم في عرض أدوات التحكم
  const toggleControls = useCallback(() => {
    setShowControls(prev => !prev);
  }, []);
  
  // فتح الشريط الجانبي
  const openSidebar = useCallback(() => {
    setShowSidebar(true);
  }, []);
  
  // إغلاق الشريط الجانبي
  const closeSidebar = useCallback(() => {
    setShowSidebar(false);
  }, []);
  
  // معالج النقر على الصفحة
  const handlePageClick = useCallback(() => {
    toggleControls();
  }, [toggleControls]);
  
  // معالج النقر على الآية
  const handleVerseClick = useCallback((surahNumber: number, verseNumber: number, verseText: string, event: React.MouseEvent) => {
    // منع انتشار الحدث لتجنب تفعيل toggleControls
    event.stopPropagation();
    
    // هنا يمكن تنفيذ منطق عرض تفسير الآية أو تشغيل الصوت
    toast({
      title: `${SURAH_NAMES[surahNumber - 1].name} - الآية ${verseNumber}`,
      description: verseText.substring(0, 50) + (verseText.length > 50 ? '...' : ''),
      duration: 3000,
    });
  }, [toast]);
  
  return (
    <div className="relative w-full h-screen bg-background flex flex-col overflow-hidden">
      {/* شريط التنقل العلوي - يظهر فقط عند تفعيل أدوات التحكم */}
      {showControls && (
        <div className="absolute top-0 right-0 left-0 bg-background/90 backdrop-blur z-10 p-2 flex justify-between items-center transition-opacity duration-300">
          <button onClick={openSidebar} className="p-2 rounded-full hover:bg-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <div className="flex items-center">
            <span className="font-semibold">{SURAH_NAMES[currentSurah - 1].name}</span>
            <span className="mx-2">|</span>
            <span>الصفحة {currentPage}</span>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={goToPrevPage} 
              disabled={currentPage <= 1}
              className="p-2 rounded-full hover:bg-muted disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            
            <button 
              onClick={goToNextPage} 
              disabled={currentPage >= APP_CONFIG.TOTAL_PAGES}
              className="p-2 rounded-full hover:bg-muted disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* عرض صفحة المصحف */}
      <div className="flex-1 overflow-hidden" onClick={handlePageClick}>
        <KingFahdMushafPage 
          pageNumber={currentPage}
          onPageClick={handlePageClick}
          onVerseClick={handleVerseClick}
        />
      </div>
      
      {/* شريط الخيارات السفلي - يظهر فقط عند تفعيل أدوات التحكم */}
      {showControls && (
        <div className="absolute bottom-0 right-0 left-0 bg-background/90 backdrop-blur z-10 p-2 flex justify-center items-center space-x-4 transition-opacity duration-300">
          <button className="p-2 rounded-full hover:bg-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
            </svg>
          </button>
          
          <button className="p-2 rounded-full hover:bg-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          
          <button className="p-2 rounded-full hover:bg-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
          
          <button className="p-2 rounded-full hover:bg-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
          </button>
        </div>
      )}
      
      {/* شريط التنقل الجانبي */}
      {/* سيتم استبداله بمكون QuranNavSidebar */}
      {showSidebar && (
        <div className="absolute top-0 right-0 left-0 bottom-0 z-50 bg-background/60" onClick={closeSidebar}>
          <div 
            className="absolute top-0 right-0 bottom-0 w-64 bg-background shadow-lg overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold">القرآن الكريم</h2>
              <button onClick={closeSidebar} className="p-2 rounded-full hover:bg-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold mb-2">السور</h3>
              <div className="divide-y">
                {SURAH_NAMES.slice(0, 10).map((surah) => (
                  <button
                    key={surah.number}
                    className="w-full text-right py-2 hover:bg-muted"
                    onClick={() => {
                      goToSurah(surah.number);
                      closeSidebar();
                    }}
                  >
                    {surah.number}. {surah.name}
                  </button>
                ))}
                {SURAH_NAMES.length > 10 && (
                  <div className="py-2 text-center text-muted-foreground">
                    ... وغيرها من السور
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}