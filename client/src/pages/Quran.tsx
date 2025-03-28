import { useEffect, useState, useRef } from 'react';
import { useRoute, useLocation } from 'wouter';
import SurahList from '../components/quran/SurahList';
import JuzList from '../components/quran/JuzList';
import QuranReader from '../components/quran/QuranReader';
import KingFahdMushaf from '../components/quran/KingFahdMushaf';
import AudioPlayer from '../components/quran/AudioPlayer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { useQuranData } from '../hooks/useQuranData';
import { Book, Bookmark, ChevronLeft, ChevronRight, Menu, Search, Settings, Share2, X, Home, Info, List, Volume2, VolumeX } from 'lucide-react';
import { SURAH_NAMES } from '../lib/constants';

export default function Quran() {
  const [viewMode, setViewMode] = useState<'surah' | 'juz' | 'page'>('page');
  const [displayMode, setDisplayMode] = useState<'text' | 'image'>('image');
  const { quranData, isLoading, error } = useQuranData();
  const [fontFamily, setFontFamily] = useState<string>('HafsSmart');
  const [fontSize, setFontSize] = useState<number>(24);
  const [showControls, setShowControls] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get route parameters
  const [, params] = useRoute('/quran/surah/:number');
  const [, juzParams] = useRoute('/quran/juz/:number');
  const [, pageParams] = useRoute('/quran/page/:number');
  const [, navigate] = useLocation();
  
  // State for current viewing parameters
  const [currentSurah, setCurrentSurah] = useState<number | null>(null);
  const [currentJuz, setCurrentJuz] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recentlyVisited, setRecentlyVisited] = useState<{page: number, surah: string}[]>([]);

  // حالة ملء الشاشة
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // تطبيق وضع ملء الشاشة
  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };
  
  // الخروج من وضع ملء الشاشة
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    document.title = 'القرآن الكريم';
    
    // التعامل مع معلمات العنوان لتحديد الصفحة والعرض المناسب
    if (params && params.number) {
      const surahNum = parseInt(params.number);
      setCurrentSurah(surahNum);
      
      // تحديد رقم الصفحة بناءً على السورة المختارة
      const selectedSurah = SURAH_NAMES.find(s => s.number === surahNum);
      if (selectedSurah && selectedSurah.page) {
        setCurrentPage(selectedSurah.page);
      }
      
      setViewMode('page');
    } else if (juzParams && juzParams.number) {
      const juzNum = parseInt(juzParams.number);
      setCurrentJuz(juzNum);
      
      // تحديد رقم الصفحة بناءً على الجزء
      const juzStartPage = (juzNum - 1) * 20 + 1;
      setCurrentPage(juzStartPage);
      
      setViewMode('page');
    } else if (pageParams && pageParams.number) {
      const pageNum = parseInt(pageParams.number);
      setCurrentPage(pageNum);
      setViewMode('page');
    } else {
      // افتراضي - عرض الصفحة الأولى من المصحف
      setCurrentPage(1);
      setViewMode('page');
    }
    
    // استرجاع الصفحات التي تمت زيارتها مؤخرًا
    const savedVisited = localStorage.getItem('quranRecentlyVisited');
    if (savedVisited) {
      setRecentlyVisited(JSON.parse(savedVisited));
    }
    
    // إضافة مستمع للضغط على الشاشة لإظهار/إخفاء أدوات التحكم
    const handleClickOutside = (event: MouseEvent) => {
      // تجاهل النقر داخل عناصر التحكم
      if (
        containerRef.current && 
        event.target && 
        containerRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      
      // تبديل حالة إظهار أدوات التحكم عند النقر على المصحف
      setShowControls(prev => !prev);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [params, juzParams, pageParams]);
  
  // حفظ الصفحات المزارة مؤخرًا
  useEffect(() => {
    if (currentPage > 0) {
      let shouldUpdate = true;
      
      const findSurahByPage = () => {
        for (let i = 0; i < SURAH_NAMES.length; i++) {
          if (i === SURAH_NAMES.length - 1 || 
              (SURAH_NAMES[i+1]?.page && SURAH_NAMES[i+1]?.page > currentPage)) {
            return SURAH_NAMES[i].name;
          }
        }
        return 'الفاتحة';
      };
      
      const existingVisitsJson = localStorage.getItem('quranRecentlyVisited');
      const existingVisits = existingVisitsJson ? JSON.parse(existingVisitsJson) : [];
      
      const hasVisitedBefore = existingVisits.some((visit: {page: number}) => visit.page === currentPage);
      
      if (!hasVisitedBefore || existingVisits.length === 0) {
        const surahName = findSurahByPage();
        const newVisit = { page: currentPage, surah: surahName };
        
        if (shouldUpdate) {
          setRecentlyVisited(prev => {
            const filtered = prev.filter(v => v.page !== currentPage);
            const updated = [newVisit, ...filtered].slice(0, 5);
            localStorage.setItem('quranRecentlyVisited', JSON.stringify(updated));
            return updated;
          });
        }
      } else if (existingVisits.length > 0 && recentlyVisited.length === 0) {
        setRecentlyVisited(existingVisits);
      }
      
      return () => {
        shouldUpdate = false;
      };
    }
  }, [currentPage, SURAH_NAMES.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigate(`/quran/page/${page}`);
  };
  
  const filteredSurahs = !searchQuery 
    ? [] 
    : SURAH_NAMES.filter(surah => 
        surah.name.includes(searchQuery) || 
        surah.englishName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(surah.number).includes(searchQuery)
      ).slice(0, 10);

  const toggleAudio = () => {
    setAudioOn(!audioOn);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !quranData) {
    return <ErrorDisplay message="حدث خطأ أثناء تحميل بيانات القرآن" />;
  }

  return (
    <section className="w-full h-screen flex flex-col bg-amber-50 dark:bg-gray-900 overflow-hidden">
      {/* صفحة المصحف الرئيسية - تملأ الشاشة بالكامل */}
      <div className="relative w-full h-full flex-grow flex flex-col items-center justify-center overflow-hidden">
        {viewMode === 'page' && displayMode === 'image' ? (
          <div className="w-full h-full flex-grow">
            <KingFahdMushaf
              pageNumber={currentPage}
              onPageChange={handlePageChange}
              hideControls={!showControls}
            />
          </div>
        ) : viewMode === 'surah' ? (
          <div className="w-full h-full p-4 overflow-auto bg-white dark:bg-gray-800">
            <SurahList quranData={quranData} fontFamily={fontFamily} fontSize={fontSize} />
          </div>
        ) : viewMode === 'juz' ? (
          <div className="w-full h-full p-4 overflow-auto bg-white dark:bg-gray-800">
            <JuzList quranData={quranData} fontFamily={fontFamily} fontSize={fontSize} />
          </div>
        ) : (
          <div className="w-full h-full overflow-auto">
            <QuranReader 
              fontSize={fontSize}
              pageNumber={currentPage}
              surahNumber={currentSurah || undefined}
              juzNumber={currentJuz || undefined}
              viewMode="page"
              reciter="ar.alafasy"
              translation="en.sahih"
              onPageChange={handlePageChange}
            />
          </div>
        )}
        
        {/* شريط التحكم العلوي - يظهر فقط عند النقر على الشاشة */}
        {showControls && (
          <div 
            ref={containerRef}
            className="absolute top-0 right-0 left-0 bg-black/30 backdrop-blur-sm text-white p-3 flex justify-between items-center transition-opacity duration-300"
          >
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 rounded-full hover:bg-white/20"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex-1 text-center">
              <h1 className="text-lg font-amiri">القرآن الكريم</h1>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={toggleAudio}
                className="p-2 rounded-full hover:bg-white/20"
              >
                {audioOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </button>
              
              <button
                onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                className="p-2 rounded-full hover:bg-white/20"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  {isFullscreen ? (
                    <>
                      <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                      <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                      <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                      <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
                    </>
                  ) : (
                    <>
                      <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                      <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                      <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                      <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* شريط التحكم السفلي - يظهر فقط عند النقر على الشاشة */}
        {showControls && viewMode === 'page' && (
          <div className="absolute bottom-0 right-0 left-0 bg-black/30 backdrop-blur-sm text-white p-3 flex justify-between items-center transition-opacity duration-300">
            <button 
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronRight className="h-6 w-6" />
              <span className="mr-1 text-sm">السابقة</span>
            </button>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <span className="text-sm">صفحة</span>
                <div className="relative mx-2">
                  <input 
                    type="number" 
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= 604) handlePageChange(page);
                    }}
                    min="1" 
                    max="604" 
                    className="w-14 text-center bg-transparent border border-white/30 rounded p-1 text-white"
                  />
                </div>
                <span className="text-sm">من 604</span>
              </div>
              <p className="text-xs mt-1 opacity-80">سورة {SURAH_NAMES.find(s => s.page && s.page <= currentPage && (!SURAH_NAMES[s.number] || SURAH_NAMES[s.number].page > currentPage))?.name || 'الفاتحة'}</p>
            </div>
            
            <button 
              onClick={() => currentPage < 604 && handlePageChange(currentPage + 1)}
              disabled={currentPage >= 604}
              className="p-2 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <span className="ml-1 text-sm">التالية</span>
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
      
      {/* القائمة الجانبية - تظهر عند الضغط على زر القائمة */}
      {showSidebar && (
        <div className="absolute inset-0 z-50 flex">
          {/* خلفية شفافة عند فتح القائمة الجانبية */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSidebar(false)}
          ></div>
          
          {/* القائمة الجانبية */}
          <div className="relative w-80 h-full bg-white dark:bg-gray-800 overflow-y-auto shadow-lg">
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300 font-amiri">القرآن الكريم</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            {/* جزء البحث */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ابحث عن سورة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pr-9 pl-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-sm"
                />
              </div>
              
              {searchQuery && filteredSurahs.length > 0 && (
                <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm max-h-60 overflow-y-auto">
                  {filteredSurahs.map(surah => (
                    <div 
                      key={surah.number}
                      className="p-2 hover:bg-amber-50 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                      onClick={() => {
                        if (surah.page) {
                          handlePageChange(surah.page);
                          setShowSidebar(false);
                          setSearchQuery('');
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="ml-2 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full w-6 h-6 inline-flex items-center justify-center text-xs">
                            {surah.number}
                          </span>
                          <span>{surah.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{surah.englishName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* خيارات العرض والتنقل */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">طريقة العرض</h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setViewMode('page');
                    setDisplayMode('image');
                    setShowSidebar(false);
                  }}
                  className="flex items-center p-2 rounded-md hover:bg-amber-50 dark:hover:bg-gray-700"
                >
                  <Book className="w-5 h-5 ml-2 text-amber-600 dark:text-amber-400" />
                  <span>مصحف المدينة</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode('page');
                    setDisplayMode('text');
                    setShowSidebar(false);
                  }}
                  className="flex items-center p-2 rounded-md hover:bg-amber-50 dark:hover:bg-gray-700"
                >
                  <Info className="w-5 h-5 ml-2 text-amber-600 dark:text-amber-400" />
                  <span>نص القرآن</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode('surah');
                    setShowSidebar(false);
                  }}
                  className="flex items-center p-2 rounded-md hover:bg-amber-50 dark:hover:bg-gray-700"
                >
                  <List className="w-5 h-5 ml-2 text-amber-600 dark:text-amber-400" />
                  <span>فهرس السور</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode('juz');
                    setShowSidebar(false);
                  }}
                  className="flex items-center p-2 rounded-md hover:bg-amber-50 dark:hover:bg-gray-700"
                >
                  <List className="w-5 h-5 ml-2 text-amber-600 dark:text-amber-400" />
                  <span>فهرس الأجزاء</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/');
                    setShowSidebar(false);
                  }}
                  className="flex items-center p-2 rounded-md hover:bg-amber-50 dark:hover:bg-gray-700"
                >
                  <Home className="w-5 h-5 ml-2 text-amber-600 dark:text-amber-400" />
                  <span>الصفحة الرئيسية</span>
                </button>
              </div>
            </div>
            
            {/* قائمة آخر قراءة */}
            {recentlyVisited.length > 0 && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">آخر ما قرأت</h3>
                <div className="flex flex-col gap-2">
                  {recentlyVisited.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        handlePageChange(item.page);
                        setShowSidebar(false);
                      }}
                      className="flex justify-between items-center p-2 rounded-md hover:bg-amber-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <Bookmark className="w-4 h-4 ml-2 text-amber-600 dark:text-amber-400" />
                        <span>{item.surah}</span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">صفحة {item.page}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* إعدادات العرض */}
            {viewMode === 'page' && displayMode === 'text' && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">إعدادات العرض</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="font-size" className="text-sm">حجم الخط:</label>
                    <select
                      id="font-size"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="border border-gray-300 dark:border-gray-600 rounded p-1 text-sm"
                    >
                      {[18, 20, 22, 24, 26, 28, 30, 32].map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="font-family" className="text-sm">نوع الخط:</label>
                    <select
                      id="font-family"
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded p-1 text-sm"
                    >
                      <option value="HafsSmart">خط حفص سمارت</option>
                      <option value="UthmanicHafs">خط الرسم العثماني (حفص)</option>
                      <option value="UthmanTN1B">عثمان طه</option>
                      <option value="Amiri Quran">أميري قرآن</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {/* معلومات إضافية */}
            <div className="p-4 text-xs text-center text-gray-500 dark:text-gray-400">
              <p>القرآن الكريم - مجمع الملك فهد لطباعة المصحف الشريف</p>
            </div>
          </div>
        </div>
      )}
      
      {/* مشغل الصوت - يظهر فقط عند تفعيل الصوت */}
      {audioOn && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-2 shadow-lg border-t border-gray-200 dark:border-gray-700 z-20">
          <AudioPlayer />
        </div>
      )}
    </section>
  );
}