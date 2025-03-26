import { useState, useEffect, useRef } from 'react';
import { useQuranAudio } from '../../hooks/useQuranAudio';
import AudioPlayer from './AudioPlayer';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import { SURAH_NAMES } from '../../lib/constants';

interface QuranReaderProps {
  fontSize: number;
  pageNumber: number;
  surahNumber?: number;
  juzNumber?: number;
  viewMode: 'page' | 'surah' | 'juz';
  reciter: string;
  translation: string;
  onPageChange: (page: number) => void;
}

interface AyahData {
  number: number;
  numberInQuran: number;
  text: string;
  translation?: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
  juz: number;
  page: number;
  sajda?: boolean;
}

const QuranReader = ({
  fontSize,
  pageNumber,
  surahNumber,
  juzNumber,
  viewMode,
  reciter,
  translation,
  onPageChange,
}: QuranReaderProps) => {
  const [ayahs, setAyahs] = useState<AyahData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagesTotal, setPagesTotal] = useState(604); // القرآن الكريم له 604 صفحة في المصحف العثماني
  const [currentSurah, setCurrentSurah] = useState<number | null>(null);
  const quranContainerRef = useRef<HTMLDivElement>(null);
  
  const { audioState, startRecitation, pauseRecitation, stopRecitation, isPlaying, progress, duration } = useQuranAudio(reciter);
  
  // تعيين حجم خط مناسب بناء على قيمة fontSize
  const fontSizeMap = {
    1: 'text-sm leading-loose',
    2: 'text-base leading-loose',
    3: 'text-lg leading-loose',
    4: 'text-xl leading-loose',
    5: 'text-2xl leading-loose',
    6: 'text-3xl leading-10',
    7: 'text-4xl leading-10',
  };
  const fontSizeClass = fontSizeMap[fontSize as keyof typeof fontSizeMap] || 'text-lg leading-loose';
  
  useEffect(() => {
    const fetchQuranData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let endpoint = '';
        
        if (viewMode === 'page') {
          endpoint = `/api/quran/page/${pageNumber}/quran-uthmani`;
        } else if (viewMode === 'surah' && surahNumber) {
          endpoint = `/api/quran/surah/${surahNumber}/quran-uthmani`;
          setCurrentSurah(surahNumber);
        } else if (viewMode === 'juz' && juzNumber) {
          endpoint = `/api/quran/juz/${juzNumber}/quran-uthmani`;
        }
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`فشل في تحميل البيانات: ${response.status}`);
        }
        
        const data = await response.json();
        
        // إذا طلب المستخدم ترجمة
        let translationData = null;
        if (translation && translation !== 'ar.asad') {
          let translationEndpoint = '';
          
          if (viewMode === 'page') {
            translationEndpoint = `/api/quran/page/${pageNumber}/${translation}`;
          } else if (viewMode === 'surah' && surahNumber) {
            translationEndpoint = `/api/quran/surah/${surahNumber}/${translation}`;
          } else if (viewMode === 'juz' && juzNumber) {
            translationEndpoint = `/api/quran/juz/${juzNumber}/${translation}`;
          }
          
          const translationResponse = await fetch(translationEndpoint);
          if (translationResponse.ok) {
            translationData = await translationResponse.json();
          }
        }
        
        let processedAyahs: AyahData[] = [];
        
        if (data.code === 200 && data.data && data.data.ayahs) {
          // تعيين السورة الحالية إذا كانت الصفحة تحتوي على آيات
          if (data.data.ayahs.length > 0 && viewMode === 'page') {
            setCurrentSurah(data.data.ayahs[0].surah.number);
          }
          
          processedAyahs = data.data.ayahs.map((ayah: any, index: number) => {
            let translationText;
            if (translationData && translationData.data && translationData.data.ayahs) {
              translationText = translationData.data.ayahs[index]?.text;
            }
            
            return {
              number: ayah.numberInSurah,
              numberInQuran: ayah.number,
              text: ayah.text,
              translation: translationText,
              surah: {
                number: ayah.surah.number,
                name: ayah.surah.name,
                englishName: ayah.surah.englishName,
              },
              juz: ayah.juz,
              page: ayah.page,
              sajda: ayah.sajda || false,
            };
          });
        }
        
        setAyahs(processedAyahs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuranData();
  }, [pageNumber, surahNumber, juzNumber, viewMode, translation]);
  
  const handlePageTurn = (direction: 'next' | 'prev') => {
    if (direction === 'next' && pageNumber < pagesTotal) {
      onPageChange(pageNumber + 1);
    } else if (direction === 'prev' && pageNumber > 1) {
      onPageChange(pageNumber - 1);
    }
    
    // عند تغيير الصفحة، نعود إلى أعلى المصحف
    if (quranContainerRef.current) {
      quranContainerRef.current.scrollTop = 0;
    }
  };
  
  const handleAudioPlay = () => {
    if (ayahs.length > 0) {
      // إنشاء مصفوفة من معرفات الآيات لمشغل الصوت
      const ayahIds = ayahs.map(ayah => `${ayah.surah.number}:${ayah.number}`);
      startRecitation(ayahIds);
    }
  };
  
  if (isLoading) {
    return <LoadingSpinner text="جار تحميل القرآن الكريم..." />;
  }
  
  if (error) {
    return <ErrorDisplay error={error} onRetry={() => onPageChange(pageNumber)} />;
  }
  
  // تجميع الآيات حسب السورة
  const ayahsBySurah = ayahs.reduce((acc, ayah) => {
    if (!acc[ayah.surah.number]) {
      acc[ayah.surah.number] = {
        surahInfo: {
          number: ayah.surah.number,
          name: ayah.surah.name,
          englishName: ayah.surah.englishName,
        },
        ayahs: []
      };
    }
    acc[ayah.surah.number].ayahs.push(ayah);
    return acc;
  }, {} as { [key: number]: { surahInfo: { number: number, name: string, englishName: string }, ayahs: AyahData[] } });
  
  // معلومات عن السورة الحالية (للعرض في رأس الصفحة)
  const currentSurahInfo = currentSurah ? SURAH_NAMES.find(s => s.number === currentSurah) : null;
  
  return (
    <>
      <div className="mushaf-frame mb-4">
        <div ref={quranContainerRef} className="quran-page p-5 rounded-lg bg-quranBg dark:bg-quranDark arabic-text overflow-y-auto max-h-[70vh]">
          {/* رأس الصفحة */}
          <div className="flex justify-between items-center mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 sticky top-0 bg-quranBg dark:bg-quranDark z-10">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              الصفحة {pageNumber} من {pagesTotal}
            </div>
            <div className="text-lg font-bold text-center">
              {currentSurahInfo?.name || Object.values(ayahsBySurah).map(surah => surah.surahInfo.name).join(' - ')}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {ayahs.length > 0 ? `الجزء ${ayahs[0].juz}` : ''}
            </div>
          </div>
          
          {/* عرض السور وآياتها */}
          {Object.values(ayahsBySurah).map((surah) => (
            <div key={surah.surahInfo.number} className="mb-6">
              {/* عرض رأس السورة */}
              <div className="border-double border-b-4 border-primary/30 dark:border-primary/40 text-center py-3 mb-6">
                <h2 className="text-2xl font-bold mb-1">{surah.surahInfo.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{surah.surahInfo.englishName}</p>
              </div>
              
              {/* عرض البسملة إذا كانت ليست سورة الفاتحة أو سورة التوبة */}
              {surah.surahInfo.number !== 1 && surah.surahInfo.number !== 9 && (
                <div className="text-center mb-6">
                  <span className="text-xl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                </div>
              )}
              
              {/* الآيات */}
              <div className={`text-right ${fontSizeClass}`}>
                <p className="mb-6 quran-text">
                  {surah.ayahs.map((ayah) => (
                    <span key={`${ayah.surah.number}-${ayah.number}`} className="ayah-container">
                      <span className="ayah-text">{ayah.text}</span>
                      <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-primary bg-opacity-20 text-primary text-xs ms-1">
                        {ayah.number}
                      </span>
                      {ayah.sajda && (
                        <span className="inline-flex justify-center items-center px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs rounded-md mx-1">
                          سجدة
                        </span>
                      )}
                    </span>
                  ))}
                </p>
                
                {/* الترجمة إذا كانت متاحة */}
                {surah.ayahs.some(ayah => ayah.translation) && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-semibold mb-2">الترجمة:</h3>
                    {surah.ayahs.map((ayah) => (
                      ayah.translation && (
                        <div key={`trans-${ayah.surah.number}-${ayah.number}`} className="mb-2 text-sm">
                          <span className="font-semibold ml-1">{ayah.number}.</span>
                          <span className="text-gray-700 dark:text-gray-300">{ayah.translation}</span>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* التنقل بين الصفحات */}
      <div className="flex justify-between items-center mb-6">
        <button 
          className="py-2 px-4 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageTurn('prev')}
          disabled={pageNumber <= 1}
        >
          الصفحة السابقة
        </button>
        
        <div className="text-center">
          <span className="text-gray-700 dark:text-gray-300">الصفحة {pageNumber} من {pagesTotal}</span>
        </div>
        
        <button 
          className="py-2 px-4 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageTurn('next')}
          disabled={pageNumber >= pagesTotal}
        >
          الصفحة التالية
        </button>
      </div>
      
      {/* ضوابط الصوت */}
      <AudioPlayer 
        isPlaying={isPlaying}
        progress={progress}
        duration={duration}
        onPlay={handleAudioPlay}
        onPause={pauseRecitation}
        onStop={stopRecitation}
      />
    </>
  );
};

export default QuranReader;
