import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import SurahList from '../components/quran/SurahList';
import JuzList from '../components/quran/JuzList';
import QuranReader from '../components/quran/QuranReader';
import KingFahdMushaf from '../components/quran/KingFahdMushaf';
import AudioPlayer from '../components/quran/AudioPlayer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { useQuranData } from '../hooks/useQuranData';
import { Book, Bookmark, ChevronLeft, ChevronRight, Copy, Search, Settings, Share2 } from 'lucide-react';
import { SURAH_NAMES } from '../lib/constants';

export default function Quran() {
  const [viewMode, setViewMode] = useState<'surah' | 'juz' | 'page'>('page'); // تغيير القيمة الافتراضية إلى 'page'
  const [displayMode, setDisplayMode] = useState<'text' | 'image'>('image');
  const { quranData, isLoading, error } = useQuranData();
  const [fontFamily, setFontFamily] = useState<string>('HafsSmart');
  const [fontSize, setFontSize] = useState<number>(24);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get route parameters
  const [, params] = useRoute('/quran/surah/:number');
  const [, juzParams] = useRoute('/quran/juz/:number');
  const [, pageParams] = useRoute('/quran/page/:number');
  const [, navigate] = useLocation();
  
  // State for current viewing parameters
  const [currentSurah, setCurrentSurah] = useState<number | null>(null);
  const [currentJuz, setCurrentJuz] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // تعيين صفحة 1 كافتراضية
  const [recentlyVisited, setRecentlyVisited] = useState<{page: number, surah: string}[]>([]);

  useEffect(() => {
    document.title = 'القرآن الكريم | مجمع الملك فهد لطباعة المصحف الشريف';
    
    // Check for route parameters and set the appropriate view mode
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
  }, [params, juzParams, pageParams]);
  
  // حفظ الصفحات المزارة مؤخرًا
  useEffect(() => {
    // تنفيذ فقط عندما يتغير currentPage وهو أكبر من 0
    if (currentPage > 0) {
      // تخزين قيمة خارج التأثير لمنع إعادة التحميل المستمر
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
      
      // استخدام التخزين المحلي مباشرة للتحقق من وجود تكرار
      const existingVisitsJson = localStorage.getItem('quranRecentlyVisited');
      const existingVisits = existingVisitsJson ? JSON.parse(existingVisitsJson) : [];
      
      // فحص ما إذا كانت الصفحة الحالية موجودة بالفعل 
      const hasVisitedBefore = existingVisits.some((visit: {page: number}) => visit.page === currentPage);
      
      // تحديث فقط إذا لم نزر هذه الصفحة من قبل أو كانت أول مرة نقوم بالتحميل
      if (!hasVisitedBefore || existingVisits.length === 0) {
        const surahName = findSurahByPage();
        const newVisit = { page: currentPage, surah: surahName };
        
        // تحديث قائمة الزيارات الأخيرة
        if (shouldUpdate) {
          setRecentlyVisited(prev => {
            // تجنب التكرار
            const filtered = prev.filter(v => v.page !== currentPage);
            // إضافة الزيارة الجديدة في البداية وإبقاء آخر 5 زيارات فقط
            const updated = [newVisit, ...filtered].slice(0, 5);
            localStorage.setItem('quranRecentlyVisited', JSON.stringify(updated));
            return updated;
          });
        }
      } else if (existingVisits.length > 0 && recentlyVisited.length === 0) {
        // إذا كان لدينا زيارات مخزنة ولكن القائمة فارغة، فقط قم بتحميل البيانات المخزنة
        setRecentlyVisited(existingVisits);
      }
      
      // قم بالتنظيف عند إلغاء تركيب المكون
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
      ).slice(0, 5);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !quranData) {
    return <ErrorDisplay message="حدث خطأ أثناء تحميل بيانات القرآن" />;
  }

  return (
    <section className="container mx-auto px-4 py-6">
      {/* الهيدر الرئيسي مع شريط البحث */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Book className="h-8 w-8 ml-3 text-amber-600 dark:text-amber-400" />
            <h1 className="text-2xl font-bold text-amber-700 dark:text-amber-300 font-amiri">
              القرآن الكريم
            </h1>
          </div>
          
          <div className="flex flex-1 max-w-md mx-auto md:mx-0 relative">
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ابحث عن سورة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pr-10 pl-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:border-amber-500 focus:ring focus:ring-amber-200 dark:focus:ring-amber-700"
            />
            {searchQuery && filteredSurahs.length > 0 && (
              <div className="absolute top-full right-0 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                {filteredSurahs.map(surah => (
                  <div 
                    key={surah.number}
                    className="p-2 hover:bg-amber-50 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0 border-gray-100 dark:border-gray-700 flex justify-between"
                    onClick={() => {
                      if (surah.page) {
                        handlePageChange(surah.page);
                      } else {
                        navigate(`/quran/surah/${surah.number}`);
                      }
                      setSearchQuery('');
                    }}
                  >
                    <div className="flex items-center">
                      <span className="ml-2 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full w-6 h-6 inline-flex items-center justify-center text-xs">
                        {surah.number}
                      </span>
                      <span>{surah.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{surah.englishName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-amber-50 dark:hover:bg-gray-700"
              aria-label="الإعدادات"
            >
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-amber-50 dark:hover:bg-gray-700"
              aria-label="المفضلة"
            >
              <Bookmark className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-amber-50 dark:hover:bg-gray-700"
              aria-label="مشاركة"
            >
              <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
        
        {/* إعدادات العرض */}
        {showSettings && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">وضع العرض:</span>
              <div className="flex bg-gray-200 dark:bg-gray-700 rounded-md p-1">
                <button
                  onClick={() => setDisplayMode('image')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    displayMode === 'image'
                      ? 'bg-amber-600 text-white'
                      : 'bg-transparent text-gray-700 dark:text-gray-300'
                  }`}
                >
                  مصحف
                </button>
                <button
                  onClick={() => setDisplayMode('text')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    displayMode === 'text'
                      ? 'bg-amber-600 text-white'
                      : 'bg-transparent text-gray-700 dark:text-gray-300'
                  }`}
                >
                  نص
                </button>
              </div>
            </div>
            
            {displayMode === 'text' && (
              <>
                <div className="flex items-center gap-2">
                  <label htmlFor="font-size" className="text-sm font-medium">حجم الخط:</label>
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

                <div className="flex items-center gap-2">
                  <label htmlFor="font-family" className="text-sm font-medium">نوع الخط:</label>
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
              </>
            )}
            
            <div className="flex items-center gap-4 mr-auto">
              <button
                onClick={() => setViewMode('surah')}
                className={`px-3 py-1 rounded-md text-sm ${
                  viewMode === 'surah'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                فهرس السور
              </button>
              <button
                onClick={() => setViewMode('juz')}
                className={`px-3 py-1 rounded-md text-sm ${
                  viewMode === 'juz'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                فهرس الأجزاء
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* قسم الصفحات المزارة مؤخرًا */}
      {viewMode === 'page' && recentlyVisited.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-amber-700 dark:text-amber-400 mb-3">آخر ما قرأت</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentlyVisited.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => handlePageChange(item.page)}
                className="flex flex-col items-center bg-amber-50 dark:bg-gray-700 p-3 rounded-lg min-w-[100px] hover:bg-amber-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-lg font-bold text-amber-600 dark:text-amber-300">{item.page}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.surah}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          {viewMode === 'surah' ? (
            <SurahList quranData={quranData} fontFamily={fontFamily} fontSize={fontSize} />
          ) : viewMode === 'juz' ? (
            <JuzList quranData={quranData} fontFamily={fontFamily} fontSize={fontSize} />
          ) : displayMode === 'image' ? (
            <KingFahdMushaf
              pageNumber={currentPage}
              onPageChange={handlePageChange}
            />
          ) : (
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
          )}
        </div>

        {/* أزرار التنقل بين الصفحات */}
        {viewMode === 'page' && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button 
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-4 py-2 rounded-md bg-amber-50 dark:bg-gray-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
              <span>السابقة</span>
            </button>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const page = Number(formData.get('page'));
              if (page >= 1 && page <= 604) handlePageChange(page);
            }} className="flex items-center">
              <span className="ml-2 text-sm">صفحة</span>
              <input 
                type="number" 
                name="page"
                min="1" 
                max="604" 
                defaultValue={currentPage}
                className="mx-2 w-16 text-center border border-gray-300 dark:border-gray-600 rounded p-1"
              />
              <span className="ml-2 text-sm">من 604</span>
              <button type="submit" className="mr-2 px-3 py-1 rounded-md bg-amber-500 text-white text-sm">انتقال</button>
            </form>
            
            <button 
              onClick={() => currentPage < 604 && handlePageChange(currentPage + 1)}
              disabled={currentPage >= 604}
              className="flex items-center gap-1 px-4 py-2 rounded-md bg-amber-50 dark:bg-gray-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>التالية</span>
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        )}
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <AudioPlayer />
        </div>
      </div>
    </section>
  );
}