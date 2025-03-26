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
  hizbQuarter?: number;
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
    1: 'text-sm',
    2: 'text-base',
    3: 'text-lg', 
    4: 'text-xl',
    5: 'text-2xl',
    6: 'text-3xl',
    7: 'text-4xl',
  };
  const fontSizeClass = fontSizeMap[fontSize as keyof typeof fontSizeMap] || 'text-lg';
  
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
              hizbQuarter: ayah.hizbQuarter || null,
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
  
  // مجموعة متنوعة من الألوان للزخارف (ألوان الخط الإسلامي المصحفي)
  const decorColors = [
    'rgba(66, 133, 91, 0.7)',  // أخضر
    'rgba(153, 68, 68, 0.7)',  // أحمر
    'rgba(75, 92, 165, 0.7)',  // أزرق
    'rgba(191, 146, 42, 0.7)', // ذهبي
  ];
  
  return (
    <>
      <div className="kingfahd-mushaf mb-4 select-none">
        {/* شريط العنوان والتنقل بين الصفحات */}
        <div className="p-3 bg-white dark:bg-gray-800 border-b border-amber-200 dark:border-amber-900 shadow-sm mb-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <button 
              className="py-1 px-3 bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex items-center text-sm"
              onClick={() => handlePageTurn('prev')}
              disabled={pageNumber <= 1}
            >
              <i className="fas fa-chevron-right ml-1"></i>
              <span>السابقة</span>
            </button>
            
            <div className="text-center flex flex-col">
              <span className="text-base font-bold text-gray-700 dark:text-gray-200">
                {currentSurahInfo?.name || Object.values(ayahsBySurah).map(surah => surah.surahInfo.name).join(' - ')}
              </span>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>الصفحة {pageNumber} من {pagesTotal}</span>
                <span className="mx-2">|</span>
                <span>{ayahs.length > 0 ? `الجزء ${ayahs[0].juz}` : ''}</span>
              </div>
            </div>
            
            <button 
              className="py-1 px-3 bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex items-center text-sm"
              onClick={() => handlePageTurn('next')}
              disabled={pageNumber >= pagesTotal}
            >
              <span>التالية</span>
              <i className="fas fa-chevron-left mr-1"></i>
            </button>
          </div>
        </div>
        
        {/* صفحة المصحف */}
        <div 
          ref={quranContainerRef} 
          className={`${fontSizeClass} madina-mushaf overflow-y-auto max-h-[70vh] p-5 rounded-b-lg`}
        >
          {/* شريط رقم الصفحة */}
          <div className="page-header flex justify-center items-center mt-2 mb-6">
            <div className="page-number-badge">
              <span>{pageNumber}</span>
            </div>
          </div>
          
          {/* محتوى المصحف - السور والآيات */}
          <div className="quran-content">
            {Object.values(ayahsBySurah).map((surah) => (
              <div key={surah.surahInfo.number} className="surah-container mb-8">
                {/* رأس السورة وعنوانها إذا كانت بداية سورة */}
                {surah.ayahs[0].number === 1 && (
                  <div className="surah-header mb-6">
                    <div className="surah-title-ornament">
                      <div className="surah-title">
                        <h2>{surah.surahInfo.name}</h2>
                      </div>
                    </div>
                    
                    {/* البسملة - بداية كل سورة عدا التوبة */}
                    {surah.surahInfo.number !== 9 && (
                      <div className="bismillah">
                        <p>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* الآيات */}
                <div className="ayahs-container">
                  {surah.ayahs.map((ayah, index) => (
                    <span key={`${ayah.surah.number}-${ayah.number}`} className="ayah-text">
                      {/* نص الآية */}
                      {ayah.text}
                      
                      {/* رقم الآية - تنسيق مصحف الملك فهد */}
                      <span className="ayah-number">
                        {getArabicNumber(ayah.number)}
                      </span>
                      
                      {/* علامات الحزب والجزء */}
                      {ayah.hizbQuarter && ayah.hizbQuarter % 4 === 0 && (
                        <span className="hizb-marker" title={`حزب ${Math.ceil(ayah.hizbQuarter / 4)}`}>
                          ۞
                        </span>
                      )}
                      
                      {/* علامة السجدة إذا وجدت */}
                      {ayah.sajda && (
                        <span className="sajdah-marker" title="سجدة">
                          ۩
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* القسم السفلي - الترجمة إذا كانت متاحة */}
      {Object.values(ayahsBySurah).some(s => s.ayahs.some(a => a.translation)) && (
        <div className="translation-section bg-white dark:bg-gray-800 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300 border-b pb-1">الترجمة:</h3>
          {Object.values(ayahsBySurah).map(surah => (
            <div key={`trans-${surah.surahInfo.number}`}>
              {surah.ayahs.map((ayah) => (
                ayah.translation && (
                  <div key={`trans-${ayah.surah.number}-${ayah.number}`} className="mb-2 text-sm">
                    <span className="font-semibold ml-1 text-amber-600 dark:text-amber-400">{ayah.number} -</span>
                    <span className="text-gray-700 dark:text-gray-300">{ayah.translation}</span>
                  </div>
                )
              ))}
            </div>
          ))}
        </div>
      )}
      
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

// دالة لتحويل الأرقام الإنجليزية إلى أرقام عربية
function getArabicNumber(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(digit => {
    return arabicDigits[parseInt(digit)];
  }).join('');
}

export default QuranReader;
