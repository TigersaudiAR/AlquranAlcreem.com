import { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import QuranNavigation from '../components/quran/QuranNavigation';
import QuranReader from '../components/quran/QuranReader';
import BookmarkAndShare from '../components/quran/BookmarkAndShare';
import { RECITERS, LANGUAGES } from '../lib/constants';
import { useQuranData } from '../hooks/useQuranData';

const Quran = () => {
  const [viewMode, setViewMode] = useState<'page' | 'surah' | 'juz'>('page');
  const [pageNumber, setPageNumber] = useState(1);
  const [surahNumber, setSurahNumber] = useState<number | undefined>(undefined);
  const [juzNumber, setJuzNumber] = useState<number | undefined>(undefined);
  const [reciterId, setReciterId] = useState(RECITERS[0].id);
  const [translationId, setTranslationId] = useState(LANGUAGES[0].translation);
  const [fontSize, setFontSize] = useState(3); // 1-7 scale
  const { lastRead, updateLastRead } = useQuranData();
  const search = useSearch();
  
  // Parse URL search params
  useEffect(() => {
    const params = new URLSearchParams(search);
    const page = params.get('page');
    const surah = params.get('surah');
    const juz = params.get('juz');
    const view = params.get('view') as 'page' | 'surah' | 'juz' | null;
    
    if (page) {
      setPageNumber(parseInt(page));
    } else if (lastRead) {
      setPageNumber(lastRead.pageNumber);
    }
    
    if (surah) {
      setSurahNumber(parseInt(surah));
    }
    
    if (juz) {
      setJuzNumber(parseInt(juz));
    }
    
    if (view && ['page', 'surah', 'juz'].includes(view)) {
      setViewMode(view);
    }
  }, [search, lastRead]);
  
  const handlePageChange = (page: number) => {
    setPageNumber(page);
    
    // Update URL
    const params = new URLSearchParams(search);
    params.set('page', page.toString());
    
    if (viewMode !== 'page') {
      params.set('view', 'page');
      setViewMode('page');
    }
    
    window.history.pushState({}, '', `?${params.toString()}`);
  };
  
  const handleSearch = (query: string) => {
    if (!query) return;
    
    // In a real app, this would perform a search against the Quran API
    console.log(`Searching for: ${query}`);
    
    // For now, just show a message
    alert(`البحث عن: ${query}`);
  };
  
  return (
    <section className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">القرآن الكريم</h2>
        
        <QuranNavigation 
          viewMode={viewMode}
          setViewMode={setViewMode}
          reciter={reciterId}
          setReciter={setReciterId}
          translation={translationId}
          setTranslation={setTranslationId}
          fontSize={fontSize}
          setFontSize={setFontSize}
          onSearch={handleSearch}
        />
        
        <QuranReader 
          fontSize={fontSize}
          pageNumber={pageNumber}
          surahNumber={surahNumber}
          juzNumber={juzNumber}
          viewMode={viewMode}
          reciter={reciterId}
          translation={translationId}
          onPageChange={handlePageChange}
        />
        
        <BookmarkAndShare 
          pageNumber={pageNumber}
          surahNumber={surahNumber}
          ayahNumber={1} // This would be set based on the current visible ayah
        />
      </div>
    </section>
  );
};

export default Quran;
