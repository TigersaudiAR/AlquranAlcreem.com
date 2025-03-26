import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import SurahList from '../components/quran/SurahList';
import JuzList from '../components/quran/JuzList';
import QuranReader from '../components/quran/QuranReader';
import QuranNavigation from '../components/quran/QuranNavigation';
import BookmarkAndShare from '../components/quran/BookmarkAndShare';
import AudioPlayer from '../components/quran/AudioPlayer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { useQuranData } from '../hooks/useQuranData';

export default function Quran() {
  const [viewMode, setViewMode] = useState<'surah' | 'juz' | 'page'>('surah');
  const { quranData, isLoading, error } = useQuranData();
  const [fontFamily, setFontFamily] = useState<string>('UthmanicHafs');
  const [fontSize, setFontSize] = useState<number>(24);
  
  // Get route parameters
  const [, params] = useRoute('/quran/surah/:number');
  const [, juzParams] = useRoute('/quran/juz/:number');
  const [, pageParams] = useRoute('/quran/page/:number');
  const [, navigate] = useLocation();
  
  // State for current viewing parameters
  const [currentSurah, setCurrentSurah] = useState<number | null>(null);
  const [currentJuz, setCurrentJuz] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'القرآن الكريم | مجمع الملك فهد لطباعة المصحف الشريف';
    
    // Check for route parameters and set the appropriate view mode
    if (params && params.number) {
      const surahNum = parseInt(params.number);
      setCurrentSurah(surahNum);
      setViewMode('page');
    } else if (juzParams && juzParams.number) {
      const juzNum = parseInt(juzParams.number);
      setCurrentJuz(juzNum);
      setViewMode('page');
    } else if (pageParams && pageParams.number) {
      const pageNum = parseInt(pageParams.number);
      setCurrentPage(pageNum);
      setViewMode('page');
    }
  }, [params, juzParams, pageParams]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !quranData) {
    return <ErrorDisplay message="حدث خطأ أثناء تحميل بيانات القرآن" />;
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 font-amiri">
            القرآن الكريم
          </h1>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => {
                setViewMode('surah');
                setCurrentSurah(null);
                setCurrentJuz(null);
                setCurrentPage(null);
                navigate('/quran');
              }}
              className={`px-3 py-1 rounded ${
                viewMode === 'surah'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              السور
            </button>
            <button
              onClick={() => {
                setViewMode('juz');
                setCurrentSurah(null);
                setCurrentJuz(null);
                setCurrentPage(null);
                navigate('/quran');
              }}
              className={`px-3 py-1 rounded ${
                viewMode === 'juz'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              الأجزاء
            </button>
            {viewMode === 'page' && (
              <button
                onClick={() => navigate('/quran')}
                className="px-3 py-1 rounded bg-primary-600 text-white"
              >
                العودة للفهرس
              </button>
            )}
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-2">
          <QuranNavigation />

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <label htmlFor="font-size" className="ml-2 text-sm">حجم الخط:</label>
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

            <div className="flex items-center">
              <label htmlFor="font-family" className="ml-2 text-sm">نوع الخط:</label>
              <select
                id="font-family"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded p-1 text-sm"
              >
                <option value="UthmanicHafs">خط الرسم العثماني (حفص)</option>
                <option value="UthmanTN1B">عثمان طه</option>
                <option value="Amiri Quran">أميري قرآن</option>
                <option value="Scheherazade New">شهرزاد</option>
              </select>
            </div>

            <BookmarkAndShare />
          </div>
        </div>

        <div className="p-4">
          {viewMode === 'surah' ? (
            <SurahList quranData={quranData} fontFamily={fontFamily} fontSize={fontSize} />
          ) : viewMode === 'juz' ? (
            <JuzList quranData={quranData} fontFamily={fontFamily} fontSize={fontSize} />
          ) : (
            <QuranReader 
              fontSize={fontSize}
              pageNumber={currentPage || 1}
              surahNumber={currentSurah || undefined}
              juzNumber={currentJuz || undefined}
              viewMode="page"
              reciter="ar.alafasy"
              translation="en.sahih"
              onPageChange={(page) => {
                setCurrentPage(page);
                navigate(`/quran/page/${page}`);
              }}
            />
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <AudioPlayer />
        </div>
      </div>
    </section>
  );
}