import React, { useState, useEffect } from 'react';
import { getTafsir } from '../../lib/quran-api';
import { TAFSIR_SOURCES } from '../../lib/constants';

interface TafsirDialogProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  ayahNumber: number;
  ayahText: string;
}

interface TafsirResponse {
  tafsirId: string;
  tafsirName: string;
  tafsirText: string;
  ayahText: string;
  surahNumber: number;
  ayahNumber: number;
}

/**
 * مكون تفسير الآيات
 * يعرض تفسير الآية المحددة في نافذة منبثقة
 */
const TafsirDialog: React.FC<TafsirDialogProps> = ({
  isOpen,
  onClose,
  surahNumber,
  ayahNumber,
  ayahText
}) => {
  const [tafsirText, setTafsirText] = useState<string>('');
  const [tafsirSource, setTafsirSource] = useState<string>('ar-tafsir-al-jalalayn');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // تحميل التفسير عند فتح النافذة المنبثقة أو تغيير مصدر التفسير
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchTafsir = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getTafsir(surahNumber, ayahNumber, tafsirSource);
        
        if (data && data.tafsirText) {
          setTafsirText(data.tafsirText);
        } else {
          setError('لم يتم العثور على تفسير لهذه الآية.');
        }
      } catch (err) {
        console.error('خطأ في تحميل التفسير:', err);
        setError('حدث خطأ أثناء تحميل التفسير. يرجى المحاولة مرة أخرى.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTafsir();
  }, [isOpen, surahNumber, ayahNumber, tafsirSource]);
  
  // معالج تغيير مصدر التفسير
  const handleTafsirSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTafsirSource(e.target.value);
  };
  
  // إذا كانت النافذة مغلقة، لا تقم بعرض أي شيء
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-200">تفسير الآية</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md mb-4 text-right">
            <p className="text-lg font-arabic text-amber-900 dark:text-amber-200">{ayahText}</p>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              سورة {surahNumber}، آية {ayahNumber}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="tafsir-source" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              مصدر التفسير:
            </label>
            <select
              id="tafsir-source"
              value={tafsirSource}
              onChange={handleTafsirSourceChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {TAFSIR_SOURCES.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </select>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700 dark:border-amber-300"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 dark:text-red-400 text-center py-4">
              {error}
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none text-right">
              <div dangerouslySetInnerHTML={{ __html: tafsirText }}></div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:bg-amber-600 dark:hover:bg-amber-700"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default TafsirDialog;