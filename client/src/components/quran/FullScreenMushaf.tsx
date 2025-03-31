import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { 
  BookmarkPlus, 
  Share2, 
  PlayCircle, 
  PauseCircle, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  Settings,
  X,
  Maximize,
  Minimize,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { APP_CONFIG, SURAH_NAMES } from '@/lib/constants';
import { useApp } from '@/context/AppContext';
import { useQuranAudioBasic } from '@/hooks/useQuranAudio';

import VersePopover from './VersePopover';
import QuranNavSidebar from './QuranNavSidebar';

interface FullScreenMushafProps {
  initialPage?: number;
  className?: string;
}

// النوع الخاص بالآية المحددة
interface SelectedVerse {
  surahNumber: number;
  verseNumber: number;
  pageNumber: number;
}

// مكون المصحف في وضع ملء الشاشة
const FullScreenMushaf: React.FC<FullScreenMushafProps> = ({ 
  initialPage = 1, 
  className 
}) => {
  const [, setLocation] = useLocation();
  const { bookmarks, addBookmark, settings, lastRead, updateLastRead } = useApp();
  
  // حالة الصفحة الحالية والصفحة المحددة
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // حالة الآية المحددة وتفاصيلها
  const [selectedVerse, setSelectedVerse] = useState<SelectedVerse | null>(null);
  const [currentVerse, setCurrentVerse] = useState<SelectedVerse | null>(null);
  
  // التحكم في عرض الأدوات
  const [showControls, setShowControls] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  
  // حالة تشغيل الصوت
  const { isPlaying, togglePlay, isLoading: audioLoading } = useQuranAudioBasic(settings.reciter);
  
  // مراجع للعناصر
  const mushafRef = useRef<HTMLDivElement>(null);
  
  // تحديث الصفحة بناءً على الرابط
  useEffect(() => {
    try {
      const pageParam = window.location.pathname.match(/\/page\/(\d+)/);
      if (pageParam && pageParam[1]) {
        const pageNumber = parseInt(pageParam[1], 10);
        if (pageNumber >= 1 && pageNumber <= APP_CONFIG.TOTAL_PAGES) {
          setCurrentPage(pageNumber);
        }
      }
    } catch (e) {
      console.error("Error parsing page number from URL", e);
    }
  }, []);
  
  // الانتقال إلى الصفحة التالية
  const goToNextPage = useCallback(() => {
    if (currentPage < APP_CONFIG.TOTAL_PAGES) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setLocation(`/page/${nextPage}`);
    }
  }, [currentPage, setLocation]);
  
  // الانتقال إلى الصفحة السابقة
  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      setLocation(`/page/${prevPage}`);
    }
  }, [currentPage, setLocation]);
  
  // معالجة تحديد آية
  const handleVerseSelect = useCallback((verseData: SelectedVerse) => {
    setSelectedVerse(verseData);
  }, []);
  
  // إضافة إشارة مرجعية
  const handleAddBookmark = useCallback(() => {
    if (currentPage) {
      // نفترض أن هناك سورة وآية للصفحة الحالية
      // في التطبيق الحقيقي، ستحصل على هذه المعلومات من بيانات المصحف
      addBookmark({
        surahNumber: 1, // يجب تحديث هذا بناءً على بيانات الصفحة الحالية
        ayahNumber: 1,  // يجب تحديث هذا بناءً على بيانات الصفحة الحالية
        pageNumber: currentPage
      });
    }
  }, [currentPage, addBookmark]);
  
  // مشاركة الآية الحالية
  const handleShare = useCallback(() => {
    // تنفيذ وظيفة المشاركة
    if (navigator.share && selectedVerse) {
      navigator.share({
        title: `${SURAH_NAMES.find(s => s.number === selectedVerse.surahNumber)?.name} - الآية ${selectedVerse.verseNumber}`,
        text: `قراءة القرآن الكريم - ${SURAH_NAMES.find(s => s.number === selectedVerse.surahNumber)?.name} - الآية ${selectedVerse.verseNumber}`,
        url: `${window.location.origin}/quran/${selectedVerse.surahNumber}/${selectedVerse.verseNumber}`
      });
    }
  }, [selectedVerse]);
  
  // تحديث آخر قراءة
  useEffect(() => {
    if (settings.autoSaveLastRead && currentPage) {
      updateLastRead({
        surahNumber: 1, // يجب تحديث هذا بناءً على بيانات الصفحة الحالية
        ayahNumber: 1,  // يجب تحديث هذا بناءً على بيانات الصفحة الحالية
        pageNumber: currentPage
      });
    }
  }, [currentPage, settings.autoSaveLastRead, updateLastRead]);
  
  // التبديل بين وضع ملء الشاشة والوضع العادي
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // دخول وضع ملء الشاشة
      if (mushafRef.current?.requestFullscreen) {
        mushafRef.current.requestFullscreen()
          .then(() => setIsFullScreen(true))
          .catch(err => console.error("خطأ في تفعيل وضع ملء الشاشة:", err));
      }
    } else {
      // الخروج من وضع ملء الشاشة
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullScreen(false))
          .catch(err => console.error("خطأ في الخروج من وضع ملء الشاشة:", err));
      }
    }
  };
  
  // استماع لتغيرات وضع ملء الشاشة
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);
  
  // التبديل بين إظهار وإخفاء أدوات التحكم
  const toggleControls = () => {
    // تحديث وقت آخر تفاعل
    setLastInteraction(Date.now());
    setShowControls(prev => !prev);
  };
  
  // إخفاء عناصر التحكم تلقائيًا بعد مرور فترة من الزمن
  useEffect(() => {
    if (!showControls) return; // لا نحتاج إلى المؤقت إذا كانت عناصر التحكم مخفية بالفعل
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 5000); // 5 ثوانٍ بعد آخر تفاعل
    
    return () => clearTimeout(timer);
  }, [showControls, lastInteraction]);
  
  return (
    <div 
      ref={mushafRef}
      className={cn(
        "quran-mushaf h-screen flex flex-col bg-[#f8f7f2] overflow-hidden relative",
        isFullScreen ? "fixed inset-0 z-50" : "",
        className
      )}
      onClick={toggleControls}
    >
      {/* شريط التنقل العلوي - يظهر فقط عند تفعيل أدوات التحكم */}
      {showControls && (
        <header className="mushaf-header bg-white shadow-sm p-4 transition-all">
          <div className="container mx-auto flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setIsNavbarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            
            <h1 className="text-xl font-bold text-center flex-1">
              {SURAH_NAMES.find(s => s.number === (selectedVerse?.surahNumber || 1))?.name || 'القرآن الكريم'} 
            </h1>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
                {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setLocation('/settings')}>
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
      )}
      
      {/* المحتوى الرئيسي - صفحة المصحف */}
      <main className="mushaf-content flex-1 overflow-auto relative">
        <div className="mushaf-page w-full h-full flex items-center justify-center">
          {/* هنا سيتم عرض صورة صفحة المصحف بدقة عالية */}
          <div className="quran-page islamic-pattern max-w-3xl mx-auto h-full flex items-center justify-center">
            <img 
              src={`/images/quran_pages/page_${currentPage}.png`} 
              alt={`صفحة ${currentPage} من المصحف الشريف`}
              className="max-h-full object-contain"
              onError={(e) => {
                // في حالة عدم وجود الصورة، نعرض نصًا بديلًا
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const placeholder = document.createElement('div');
                  placeholder.className = 'text-center p-10 font-quran text-2xl';
                  placeholder.innerText = `صفحة ${currentPage} من المصحف الشريف`;
                  parent.appendChild(placeholder);
                }
              }}
            />
          </div>
        </div>
        
        {/* الشريط الجانبي للتنقل بين السور */}
        <QuranNavSidebar 
          isOpen={isNavbarOpen}
          onClose={() => setIsNavbarOpen(false)}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            setLocation(`/page/${page}`);
            setIsNavbarOpen(false);
          }}
        />
        
        {/* ظهور التفسير عند اختيار آية */}
        {selectedVerse && (
          <VersePopover 
            surahNumber={selectedVerse.surahNumber}
            verseNumber={selectedVerse.verseNumber}
            onClose={() => setSelectedVerse(null)}
          />
        )}
      </main>
      
      {/* شريط التنقل السفلي - يظهر فقط عند تفعيل أدوات التحكم */}
      {showControls && (
        <footer className="mushaf-footer bg-white shadow-sm p-3 transition-all">
          <div className="container mx-auto flex items-center justify-between">
            <Button 
              variant="outline" 
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousPage();
              }}
              disabled={currentPage <= 1}
              className="bg-white/95 hover:bg-white shadow-sm"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={(e) => {
                e.stopPropagation();
                handleAddBookmark();
              }}
              className="bg-white/95 hover:bg-white shadow-sm">
                <BookmarkPlus className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="bg-white/95 hover:bg-white shadow-sm">
                <Share2 className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                disabled={audioLoading}
                className="bg-white/95 hover:bg-white shadow-sm"
              >
                {isPlaying ? (
                  <PauseCircle className="h-5 w-5" />
                ) : (
                  <PlayCircle className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                goToNextPage();
              }}
              disabled={currentPage >= APP_CONFIG.TOTAL_PAGES}
              className="bg-white/95 hover:bg-white shadow-sm"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-2">
            صفحة {currentPage} من {APP_CONFIG.TOTAL_PAGES}
          </div>
        </footer>
      )}
      
      {/* زر العودة للأعلى - يظهر عند النزول في الصفحة */}
      <div className="floating-button" onClick={(e) => {
        e.stopPropagation();
        document.querySelector('.mushaf-content')?.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }}>
        <ChevronRight className="h-6 w-6 rotate-90" />
      </div>
    </div>
  );
};

export default FullScreenMushaf;