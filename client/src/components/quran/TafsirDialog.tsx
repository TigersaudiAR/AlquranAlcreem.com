import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTafsir } from '../../lib/quran-api';
import { useTafsir } from '../../hooks/use-tafsir';
import { TAFSIR_SOURCES } from '../../lib/constants';

interface TafsirDialogProps {
  surahNumber: number;
  ayahNumber: number;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * مكون لعرض تفسير الآيات في نافذة منبثقة
 * يسمح باختيار مصادر تفسير مختلفة وعرض التفسير بطريقة مريحة
 */
const TafsirDialog: React.FC<TafsirDialogProps> = ({
  surahNumber,
  ayahNumber,
  isOpen,
  onClose
}) => {
  const { 
    tafsirSource, 
    setTafsirSource, 
    tafsirText, 
    isLoading, 
    error,
    fetchTafsir
  } = useTafsir({ defaultSource: 'ar-tafsir-al-jalalayn' });
  
  // معالج النقر خارج النافذة لإغلاقها
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // جلب التفسير عند تغيير السورة أو الآية
  useEffect(() => {
    if (isOpen && surahNumber && ayahNumber) {
      fetchTafsir(surahNumber, ayahNumber);
    }
  }, [isOpen, surahNumber, ayahNumber, tafsirSource, fetchTafsir]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClickOutside}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* رأس النافذة */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200" dir="rtl">
                تفسير سورة {surahNumber} آية {ayahNumber}
              </h2>
              
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* اختيار مصدر التفسير */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
                <span className="text-gray-700 dark:text-gray-300 self-center ml-2">مصدر التفسير:</span>
                
                <select
                  value={tafsirSource}
                  onChange={(e) => setTafsirSource(e.target.value)}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {TAFSIR_SOURCES.map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* محتوى التفسير */}
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500 dark:text-red-400">
                  <p>حدث خطأ أثناء تحميل التفسير. يرجى المحاولة مرة أخرى.</p>
                </div>
              ) : (
                <div className="tafsir-content text-right" dir="rtl">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
                    {tafsirText || 'لا يوجد تفسير متاح لهذه الآية في المصدر المحدد.'}
                  </p>
                </div>
              )}
            </div>
            
            {/* أزرار التنقل بين الآيات */}
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button
                onClick={() => {
                  if (ayahNumber > 1) {
                    fetchTafsir(surahNumber, ayahNumber - 1);
                  }
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
                disabled={ayahNumber <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>الآية السابقة</span>
              </button>
              
              <button
                onClick={() => {
                  // سنفترض مؤقتًا أن هناك 286 آية كحد أقصى (مثل سورة البقرة)
                  fetchTafsir(surahNumber, ayahNumber + 1);
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
              >
                <span>الآية التالية</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TafsirDialog;