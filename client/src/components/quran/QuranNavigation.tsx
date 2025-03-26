import { useState } from 'react';
import { RECITERS, LANGUAGES } from '../../lib/constants';

interface QuranNavigationProps {
  viewMode: 'page' | 'surah' | 'juz';
  setViewMode: (mode: 'page' | 'surah' | 'juz') => void;
  reciter: string;
  setReciter: (reciter: string) => void;
  translation: string;
  setTranslation: (translation: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  onSearch: (query: string) => void;
}

const QuranNavigation = ({
  viewMode,
  setViewMode,
  reciter,
  setReciter,
  translation,
  setTranslation,
  fontSize,
  setFontSize,
  onSearch
}: QuranNavigationProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-wrap gap-3 mb-3">
        <button 
          className={`py-2 px-4 rounded-lg ${viewMode === 'page' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
          onClick={() => setViewMode('page')}
        >
          صفحة
        </button>
        <button 
          className={`py-2 px-4 rounded-lg ${viewMode === 'surah' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
          onClick={() => setViewMode('surah')}
        >
          سورة
        </button>
        <button 
          className={`py-2 px-4 rounded-lg ${viewMode === 'juz' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
          onClick={() => setViewMode('juz')}
        >
          جزء
        </button>
      </div>
      
      <form onSubmit={handleSearch} className="flex items-center mb-4">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="ابحث في القرآن الكريم..." 
            className="w-full py-2 px-4 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring focus:ring-primary focus:ring-opacity-50 focus:border-primary dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute inset-y-0 left-0 pl-3 flex items-center"
          >
            <i className="fas fa-search text-gray-400"></i>
          </button>
        </div>
      </form>
      
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">القارئ:</span>
          <select 
            className="py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            value={reciter}
            onChange={(e) => setReciter(e.target.value)}
          >
            {RECITERS.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">الترجمة:</span>
          <select 
            className="py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.translation}>{lang.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">حجم الخط:</span>
          <div className="flex gap-1">
            <button 
              className="py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              onClick={() => setFontSize(Math.max(fontSize - 1, 1))}
            >
              <i className="fas fa-minus"></i>
            </button>
            <button 
              className="py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              onClick={() => setFontSize(Math.min(fontSize + 1, 7))}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuranNavigation;
