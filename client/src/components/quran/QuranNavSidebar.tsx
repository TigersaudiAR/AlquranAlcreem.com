import React from 'react';
import { Search, X, Book, Bookmark, ChevronLeft, Menu, Share2, Settings, Home, Info, List, Volume2, VolumeX } from 'lucide-react';
import { SURAH_NAMES } from '../../lib/constants';
import QuranBookmarks from './QuranBookmarks';
import { useApp } from '../../context/AppContext';

interface QuranNavSidebarProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredSurahs: any[];
  handlePageChange: (page: number) => void;
  setViewMode: (mode: 'surah' | 'juz' | 'page') => void;
  setDisplayMode: (mode: 'text' | 'image') => void;
  viewMode: 'surah' | 'juz' | 'page';
  displayMode: 'text' | 'image';
  recentlyVisited: {page: number, surah: string}[];
}

const QuranNavSidebar: React.FC<QuranNavSidebarProps> = ({
  showSidebar,
  setShowSidebar,
  searchQuery,
  setSearchQuery,
  filteredSurahs,
  handlePageChange,
  setViewMode,
  setDisplayMode,
  viewMode,
  displayMode,
  recentlyVisited
}) => {
  const { bookmarks } = useApp();
  const [activeTab, setActiveTab] = React.useState<'navigation' | 'bookmarks'>('navigation');
  
  if (!showSidebar) return null;
  
  return (
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
        
        {/* قائمة التبويبات */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('navigation')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'navigation' 
                ? 'text-amber-700 dark:text-amber-300 border-b-2 border-amber-500' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            التصفح
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'bookmarks' 
                ? 'text-amber-700 dark:text-amber-300 border-b-2 border-amber-500' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            الإشارات المرجعية {bookmarks.length > 0 && <span className="ml-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-full px-2 py-0.5 text-xs">{bookmarks.length}</span>}
          </button>
        </div>
        
        {activeTab === 'navigation' ? (
          <>
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
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">طريقة العرض</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setDisplayMode('image');
                    setViewMode('page');
                    setShowSidebar(false);
                  }}
                  className={`p-2 flex flex-col items-center rounded-md ${
                    displayMode === 'image' && viewMode === 'page'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Book className="h-5 w-5 mb-1" />
                  <span className="text-sm">المصحف</span>
                </button>
                
                <button
                  onClick={() => {
                    setDisplayMode('text');
                    setViewMode('page');
                    setShowSidebar(false);
                  }}
                  className={`p-2 flex flex-col items-center rounded-md ${
                    displayMode === 'text' && viewMode === 'page'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <List className="h-5 w-5 mb-1" />
                  <span className="text-sm">نص</span>
                </button>
                
                <button
                  onClick={() => {
                    setViewMode('surah');
                    setShowSidebar(false);
                  }}
                  className={`p-2 flex flex-col items-center rounded-md ${
                    viewMode === 'surah'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <List className="h-5 w-5 mb-1" />
                  <span className="text-sm">السور</span>
                </button>
                
                <button
                  onClick={() => {
                    setViewMode('juz');
                    setShowSidebar(false);
                  }}
                  className={`p-2 flex flex-col items-center rounded-md ${
                    viewMode === 'juz'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <List className="h-5 w-5 mb-1" />
                  <span className="text-sm">الأجزاء</span>
                </button>
              </div>
            </div>
            
            {/* الصفحات المزارة مؤخرًا */}
            {recentlyVisited && recentlyVisited.length > 0 && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">تمت زيارته مؤخرًا</h3>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentlyVisited.map((visit, index) => (
                    <div
                      key={index}
                      className="py-2 cursor-pointer hover:bg-amber-50 dark:hover:bg-gray-700"
                      onClick={() => {
                        handlePageChange(visit.page);
                        setShowSidebar(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-800 dark:text-amber-200 ml-3">
                          <Book className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{visit.surah}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">صفحة {visit.page}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-4">
            <QuranBookmarks />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuranNavSidebar;