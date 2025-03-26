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
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorDisplay message={error || "حدث خطأ أثناء تحميل البيانات"} />;
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
        
        {/* صفحة المصحف - تنسيق مصحف الملك فهد (مع دعم الوضع المظلم) */}
        <div 
          ref={quranContainerRef} 
          className={`${fontSizeClass} madina-mushaf overflow-y-auto max-h-[70vh] p-5 rounded-b-lg dark:bg-gray-900 dark:border-gray-700 dark:text-amber-50`}
          style={{
            position: 'relative',
            fontFamily: 'HafsSmart, Hafs, UthmanicHafs, Amiri Quran, serif',
            backgroundColor: '#FEFAEE',
            backgroundImage: "url('/assets/mushaf/mushaf-background.svg')",
            backgroundSize: 'cover',
            borderRadius: '15px',
            border: '1px solid #E6DFC8',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            color: '#3A3A3A'
          }}
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
                {/* رأس السورة وعنوانها إذا كانت بداية سورة - تنسيق مصحف الملك فهد */}
                {surah.ayahs[0].number === 1 && (
                  <div className="surah-header mb-6">
                    <div className="surah-decoration relative">
                      <div className="ornament-container relative text-center py-3 my-2">
                        <div className="surah-ornament" style={{
                          background: 'linear-gradient(135deg, #f6edd1 0%, #f0e2b6 100%)',
                          border: '2px solid #d4c896',
                          borderRadius: '15px',
                          padding: '10px 15px 5px',
                          position: 'relative',
                          margin: '0 auto',
                          width: '85%',
                          boxShadow: '0 3px 5px rgba(0,0,0,0.05)'
                        }}>
                          <div className="surah-title" style={{
                            fontFamily: 'HafsSmart, Hafs, UthmanicHafs, serif',
                            fontSize: '1.7em',
                            fontWeight: 'bold',
                            color: '#6a442c',
                            textAlign: 'center',
                            margin: '0',
                            padding: '5px 0',
                            textShadow: '1px 1px 1px rgba(255,255,255,0.7)'
                          }}>
                            {surah.surahInfo.name}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* البسملة - بداية كل سورة عدا التوبة - تنسيق مصحف الملك فهد */}
                    {surah.surahInfo.number !== 9 && surah.ayahs[0].number === 1 && (
                      <div className="bismillah text-center mt-3 py-4 relative">
                        <div className="bismillah-line before-line absolute w-40 h-px bg-amber-700 opacity-30 top-1/2 right-0"></div>
                        <div className="bismillah-line after-line absolute w-40 h-px bg-amber-700 opacity-30 top-1/2 left-0"></div>
                        
                        <p style={{
                          fontWeight: 600, 
                          fontSize: '1.45em', 
                          lineHeight: '2.2', 
                          fontFamily: 'HafsSmart, Hafs, UthmanicHafs, serif',
                          color: '#705C3B',
                          letterSpacing: '0.02em',
                          display: 'inline-block',
                          padding: '0 15px',
                          position: 'relative'
                        }}>
                          ﴿ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴾
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* الآيات - تطبيق محاذاة المصحف الشريف */}
                <div className="ayahs-container p-2 madina-mushaf" style={{
                  fontFamily: 'HafsSmart, Hafs, UthmanicHafs, Amiri Quran, serif', 
                  lineHeight: '2.7',
                  direction: 'rtl',
                  textAlign: 'justify',
                  textAlignLast: 'center',
                  textJustify: 'inter-word',
                  wordSpacing: '0.1em',
                  fontSize: '1.2em'
                }}>
                  {surah.ayahs.map((ayah, index) => (
                    <span 
                      key={`${ayah.surah.number}-${ayah.number}`} 
                      className="ayah-text inline-block"
                      style={{
                        wordSpacing: '0.12em',
                        letterSpacing: '-0.015em',
                        fontFamily: 'HafsSmart, Hafs, UthmanicHafs, serif',
                        padding: '0 1px'
                      }}
                    >
                      {/* نص الآية */}
                      {ayah.text} 
                      
                      {/* رقم الآية - تنسيق مصحف الملك فهد */}
                      <span 
                        className="ayah-number inline-flex mx-[1px] align-middle" 
                        style={{
                          color: '#863d00',
                          fontFamily: 'HafsSmart, Amiri Quran, Hafs, serif',
                          fontSize: '0.85em',
                          fontWeight: 500,
                          position: 'relative',
                          top: '-0.15em',
                          margin: '0 0.05em'
                        }}
                      >
                        ﴿{getArabicNumber(ayah.number)}﴾
                      </span>
                      {' '}
                      
                      {/* علامات الحزب والجزء */}
                      {ayah.hizbQuarter && ayah.hizbQuarter % 4 === 0 && (
                        <span 
                          className="hizb-marker inline-block mx-1 align-middle"
                          title={`حزب ${Math.ceil(ayah.hizbQuarter / 4)}`}
                          style={{
                            color: '#04a',
                            fontSize: '1.2em',
                            fontWeight: 'bold'
                          }}
                        >
                          ۞
                        </span>
                      )}
                      
                      {/* علامة السجدة إذا وجدت */}
                      {ayah.sajda && (
                        <span 
                          className="sajdah-marker inline-block mx-1 align-middle" 
                          title="سجدة"
                          style={{
                            color: '#a40',
                            fontSize: '1.2em',
                            fontWeight: 'bold'
                          }}
                        >
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
