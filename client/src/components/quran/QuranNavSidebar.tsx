import React, { useState } from 'react';
import { X, Search, BookmarkIcon, Clock, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG, SURAH_NAMES } from '../../lib/constants';

interface QuranNavSidebarProps {
  currentPage: number;
  onPageSelect: (page: number) => void;
  onSurahSelect: (surahNumber: number) => void;
  onJuzSelect: (juzNumber: number) => void;
  onClose: () => void;
}

/**
 * شريط التنقل الجانبي للقرآن الكريم
 * يتيح التنقل بين السور والأجزاء والعلامات المرجعية
 */
const QuranNavSidebar: React.FC<QuranNavSidebarProps> = ({
  currentPage,
  onPageSelect,
  onSurahSelect,
  onJuzSelect,
  onClose
}) => {
  const { lastRead, bookmarks } = useApp();
  const [activeTab, setActiveTab] = useState<'surahs' | 'juz' | 'bookmarks' | 'history'>('surahs');
  const [searchQuery, setSearchQuery] = useState('');

  // تصفية السور بناءً على البحث
  const filteredSurahs = SURAH_NAMES.filter(surah => 
    surah.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (surah.indexOf('سورة ') === 0 && surah.slice(5).includes(searchQuery))
  );

  return (
    <div className="h-full flex flex-col">
      {/* رأس شريط التنقل */}
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300">فهرس المصحف</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          aria-label="إغلاق"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* شريط البحث */}
      <div className="px-4 py-3 border-b dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full p-2 pl-10 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="بحث في القرآن الكريم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* علامات التبويب */}
      <div className="flex border-b dark:border-gray-700">
        <button
          className={`flex-1 py-2 text-center ${activeTab === 'surahs' ? 'text-amber-600 border-b-2 border-amber-500 font-medium' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('surahs')}
        >
          السور
        </button>
        <button
          className={`flex-1 py-2 text-center ${activeTab === 'juz' ? 'text-amber-600 border-b-2 border-amber-500 font-medium' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('juz')}
        >
          الأجزاء
        </button>
        <button
          className={`flex-1 py-2 text-center ${activeTab === 'bookmarks' ? 'text-amber-600 border-b-2 border-amber-500 font-medium' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          <BookmarkIcon size={16} className="inline-block mr-1" />
        </button>
        <button
          className={`flex-1 py-2 text-center ${activeTab === 'history' ? 'text-amber-600 border-b-2 border-amber-500 font-medium' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={16} className="inline-block mr-1" />
        </button>
      </div>
      
      {/* محتوى التبويب النشط */}
      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === 'surahs' && (
          <div className="grid grid-cols-2 gap-2 p-2">
            {filteredSurahs.map((surahName, index) => (
              <button
                key={index}
                className="text-right p-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-gray-700 dark:text-gray-300"
                onClick={() => onSurahSelect(index + 1)}
              >
                <span className="inline-block w-6 h-6 text-xs text-center leading-6 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-full ml-2">
                  {index + 1}
                </span>
                {surahName}
              </button>
            ))}
          </div>
        )}
        
        {activeTab === 'juz' && (
          <div className="grid grid-cols-3 gap-2 p-2">
            {Array.from({ length: 30 }, (_, i) => (
              <button
                key={i}
                className="p-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-gray-700 dark:text-gray-300 text-center"
                onClick={() => onJuzSelect(i + 1)}
              >
                الجزء {i + 1}
              </button>
            ))}
          </div>
        )}
        
        {activeTab === 'bookmarks' && (
          <div className="space-y-2 p-2">
            {bookmarks && bookmarks.length > 0 ? (
              bookmarks.map((bookmark, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer"
                  onClick={() => onPageSelect(bookmark.pageNumber)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-amber-600 dark:text-amber-400 font-medium">
                        {SURAH_NAMES[bookmark.surahNumber - 1]} - الآية {bookmark.ayahNumber}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        صفحة {bookmark.pageNumber}
                      </div>
                    </div>
                    <BookmarkIcon size={16} className="text-amber-500" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                لم تقم بإضافة أي علامات مرجعية بعد
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="p-2">
            {lastRead ? (
              <div
                className="p-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer"
                onClick={() => onPageSelect(lastRead.pageNumber)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-amber-600 dark:text-amber-400 font-medium">
                      آخر قراءة: {SURAH_NAMES[lastRead.surahNumber - 1]} - الآية {lastRead.ayahNumber}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      صفحة {lastRead.pageNumber}
                    </div>
                  </div>
                  <MapPin size={16} className="text-amber-500" />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                لم يتم تسجيل موضع قراءة سابق
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* زر الصفحة الحالية */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">الصفحة الحالية: </span>
          <span className="font-medium text-amber-600 dark:text-amber-400">{currentPage} من 604</span>
        </div>
      </div>
    </div>
  );
};

export default QuranNavSidebar;