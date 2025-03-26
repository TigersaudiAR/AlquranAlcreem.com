import { useState, useEffect } from 'react';
import { useQuranAudio } from '../../hooks/useQuranAudio';
import AudioPlayer from './AudioPlayer';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';

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
  text: string;
  translation?: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
  juz: number;
  page: number;
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
  const { audioState, startRecitation, pauseRecitation, stopRecitation, isPlaying, progress, duration } = useQuranAudio(reciter);
  
  // Calculate font size class based on the fontSize prop
  const fontSizeClass = `text-${fontSize === 1 ? 'sm' : fontSize === 2 ? 'base' : fontSize === 3 ? 'lg' : fontSize === 4 ? 'xl' : fontSize === 5 ? '2xl' : fontSize === 6 ? '3xl' : '4xl'}`;
  
  useEffect(() => {
    const fetchQuranData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let endpoint = '';
        
        if (viewMode === 'page') {
          endpoint = `https://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`;
        } else if (viewMode === 'surah' && surahNumber) {
          endpoint = `https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`;
        } else if (viewMode === 'juz' && juzNumber) {
          endpoint = `https://api.alquran.cloud/v1/juz/${juzNumber}/quran-uthmani`;
        }
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`فشل في تحميل البيانات: ${response.status}`);
        }
        
        const data = await response.json();
        
        // If translation is requested
        let translationData = null;
        if (translation && translation !== 'ar.asad') {
          let translationEndpoint = '';
          
          if (viewMode === 'page') {
            translationEndpoint = `https://api.alquran.cloud/v1/page/${pageNumber}/${translation}`;
          } else if (viewMode === 'surah' && surahNumber) {
            translationEndpoint = `https://api.alquran.cloud/v1/surah/${surahNumber}/${translation}`;
          } else if (viewMode === 'juz' && juzNumber) {
            translationEndpoint = `https://api.alquran.cloud/v1/juz/${juzNumber}/${translation}`;
          }
          
          const translationResponse = await fetch(translationEndpoint);
          if (translationResponse.ok) {
            translationData = await translationResponse.json();
          }
        }
        
        let processedAyahs: AyahData[] = [];
        
        if (data.code === 200 && data.data && data.data.ayahs) {
          processedAyahs = data.data.ayahs.map((ayah: any, index: number) => {
            let translationText;
            if (translationData && translationData.data && translationData.data.ayahs) {
              translationText = translationData.data.ayahs[index]?.text;
            }
            
            return {
              number: ayah.numberInSurah,
              text: ayah.text,
              translation: translationText,
              surah: {
                number: ayah.surah.number,
                name: ayah.surah.name,
                englishName: ayah.surah.englishName,
              },
              juz: ayah.juz,
              page: ayah.page,
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
  
  const handleAudioPlay = () => {
    if (ayahs.length > 0) {
      // Create array of ayah IDs for the audio player
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
  
  // Group ayahs by Surah
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
  
  return (
    <>
      <div className="mushaf-frame">
        <div className="quran-page p-5 rounded-lg bg-quranBg dark:bg-quranDark arabic-text">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">الصفحة {pageNumber}</div>
            <div className="text-lg font-bold">
              {Object.values(ayahsBySurah).map(surah => surah.surahInfo.name).join(' - ')}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {ayahs.length > 0 ? `الجزء ${ayahs[0].juz}` : ''}
            </div>
          </div>
          
          {/* Render Surahs and their Ayahs */}
          {Object.values(ayahsBySurah).map((surah) => (
            <div key={surah.surahInfo.number} className="mb-6">
              {/* Show Bismillah if not Surah 1 (Al-Fatiha) or Surah 9 (At-Tawbah) */}
              {surah.surahInfo.number !== 1 && surah.surahInfo.number !== 9 && (
                <div className="text-center mb-6">
                  <span className="text-xl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                </div>
              )}
              
              {/* Ayahs */}
              <div className="space-y-4 text-right leading-loose">
                {surah.ayahs.map((ayah) => (
                  <div key={`${ayah.surah.number}-${ayah.number}`}>
                    <p className={fontSizeClass}>
                      <span>{ayah.text}</span>
                      <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-primary bg-opacity-20 text-primary text-sm ms-1">
                        {ayah.number}
                      </span>
                    </p>
                    {ayah.translation && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {ayah.translation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Audio controls */}
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
