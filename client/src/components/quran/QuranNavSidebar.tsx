import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SURAH_NAMES } from '../../lib/constants';
import { motion } from 'framer-motion';

interface QuranNavSidebarProps {
  currentPage: number;
  onPageSelect: (page: number) => void;
  onSurahSelect: (surah: number) => void;
  onJuzSelect: (juz: number) => void;
  onClose: () => void;
}

/**
 * مكون القائمة الجانبية للتنقل في المصحف
 * يعرض قائمة السور والأجزاء والإشارات المرجعية
 */
const QuranNavSidebar: React.FC<QuranNavSidebarProps> = ({
  currentPage,
  onPageSelect,
  onSurahSelect,
  onJuzSelect,
  onClose
}) => {
  const { bookmarks, lastRead, removeBookmark } = useApp();
  const [activeTab, setActiveTab] = useState<'surahs' | 'juz' | 'bookmarks'>('surahs');

  // تحديد العرض النشط
  const renderTabContent = () => {
    switch (activeTab) {
      case 'surahs':
        return renderSurahList();
      case 'juz':
        return renderJuzList();
      case 'bookmarks':
        return renderBookmarksList();
      default:
        return null;
    }
  };

  // عرض قائمة السور
  const renderSurahList = () => {
    return (
      <div className="surahs-list grid grid-cols-1 md:grid-cols-2 gap-2">
        {SURAH_NAMES.map((surah, index) => (
          <button
            key={index + 1}
            onClick={() => onSurahSelect(index + 1)}
            className="surah-item text-right py-2 px-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded hover:bg-amber-100 dark:hover:bg-amber-800/30 transition-colors flex justify-between items-center"
          >
            <span className="surah-number bg-amber-100 dark:bg-amber-800/50 text-amber-700 dark:text-amber-300 w-8 h-8 flex items-center justify-center rounded-full text-sm">
              {index + 1}
            </span>
            <span className="surah-name font-arabic text-lg">{surah}</span>
          </button>
        ))}
      </div>
    );
  };

  // عرض قائمة الأجزاء
  const renderJuzList = () => {
    return (
      <div className="juz-list grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Array.from({ length: 30 }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => onJuzSelect(index + 1)}
            className="juz-item text-center py-3 px-2 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
          >
            <span className="font-semibold">جزء {index + 1}</span>
          </button>
        ))}
      </div>
    );
  };

  // عرض قائمة الإشارات المرجعية
  const renderBookmarksList = () => {
    if (bookmarks.length === 0) {
      return (
        <div className="no-bookmarks text-center py-8">
          <div className="text-gray-500 dark:text-gray-400 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <p>لا توجد إشارات مرجعية حالياً</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bookmarks-list space-y-2">
        {bookmarks.map((bookmark, index) => (
          <div 
            key={index}
            className="bookmark-item p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex justify-between items-center"
          >
            <button
              onClick={() => onPageSelect(bookmark.pageNumber)}
              className="bookmark-info text-right flex-1"
            >
              <div className="text-amber-800 dark:text-amber-200 font-semibold">
                سورة {SURAH_NAMES[bookmark.surahNumber - 1]}، آية {bookmark.ayahNumber}
              </div>
              <div className="text-amber-600 dark:text-amber-400 text-sm">
                صفحة {bookmark.pageNumber}
              </div>
            </button>
            
            <button
              onClick={() => removeBookmark(index)}
              className="delete-bookmark p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
              title="حذف الإشارة المرجعية"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="quran-nav-sidebar h-full flex flex-col">
      {/* رأس القائمة */}
      <div className="sidebar-header flex justify-between items-center px-4 py-3 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">فهرس المصحف</h2>
        
        <button
          onClick={onClose}
          className="close-sidebar p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="إغلاق القائمة"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* قسم آخر قراءة */}
      {lastRead && (
        <div className="last-read-section p-4 border-b dark:border-gray-700">
          <div className="last-read-card bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
            <h3 className="text-md font-semibold text-amber-700 dark:text-amber-300 mb-2">آخر قراءة</h3>
            <button
              onClick={() => onPageSelect(lastRead.pageNumber)}
              className="w-full text-right"
            >
              <div className="bg-white dark:bg-gray-800 py-2 px-3 rounded shadow-sm hover:shadow transition-shadow">
                <div className="text-amber-800 dark:text-amber-200">
                  سورة {SURAH_NAMES[lastRead.surahNumber - 1]}، آية {lastRead.ayahNumber}
                </div>
                <div className="text-amber-600 dark:text-amber-400 text-sm">
                  صفحة {lastRead.pageNumber}
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
      
      {/* شريط التبويب */}
      <div className="tabs-container bg-gray-50 dark:bg-gray-800 p-2">
        <div className="flex border dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveTab('surahs')}
            className={`tab-btn flex-1 py-2 px-3 text-center ${
              activeTab === 'surahs'
                ? 'bg-amber-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            السور
          </button>
          <button
            onClick={() => setActiveTab('juz')}
            className={`tab-btn flex-1 py-2 px-3 text-center ${
              activeTab === 'juz'
                ? 'bg-amber-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            الأجزاء
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`tab-btn flex-1 py-2 px-3 text-center ${
              activeTab === 'bookmarks'
                ? 'bg-amber-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            الإشارات المرجعية
          </button>
        </div>
      </div>
      
      {/* محتوى التبويب النشط */}
      <div className="tab-content flex-1 overflow-y-auto p-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default QuranNavSidebar;