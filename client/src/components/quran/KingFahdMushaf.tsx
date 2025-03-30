import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Settings, Search, Menu, ArrowUpDown, Bookmark } from 'lucide-react';
import KingFahdMushafPage from './KingFahdMushafPage';
import { useApp } from '../../context/AppContext';
import { useSwipeable } from 'react-swipeable';

interface KingFahdMushafProps {
  initialPage?: number;
  onNavigate?: (pageNumber: number) => void;
  onVerseSelect?: (surahNumber: number, ayahNumber: number) => void;
}

/**
 * مكون المصحف الشريف بتنسيق مجمع الملك فهد
 * يعرض صفحات المصحف ويتيح التنقل بينها
 */
const KingFahdMushaf: React.FC<KingFahdMushafProps> = ({
  initialPage = 1,
  onNavigate,
  onVerseSelect
}) => {
  const { settings, lastRead, updateLastRead } = useApp();
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [pageData, setPageData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [activeVerse, setActiveVerse] = useState<{ surah: number, verse: number } | null>(null);
  const [inputPage, setInputPage] = useState('');
  const [showNavigation, setShowNavigation] = useState(false);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // تحميل بيانات الصفحة
  // استخدام مرجع لتخزين بيانات القرآن الكاملة وتخزينها بين عمليات التحميل
  const quranDataRef = useRef<any[]>([]);
  
  // تحميل بيانات الصفحة من بيانات مخزنة مؤقتًا أو من الخادم
  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        // إذا كانت البيانات مخزنة مؤقتًا بالفعل، استخدمها
        if (quranDataRef.current.length > 0) {
          console.log('استخدام البيانات المخزنة مؤقتًا، صفحة:', pageNumber);
          const filteredData = quranDataRef.current.filter((ayah: any) => ayah.page === pageNumber);
          setPageData(filteredData);
          
          // تحديث آخر قراءة إذا كان الإعداد مفعلاً
          if (settings.autoSaveLastRead && filteredData.length > 0) {
            const firstAyah = filteredData[0];
            updateLastRead({
              surahNumber: firstAyah.sura_no,
              ayahNumber: firstAyah.aya_no,
              pageNumber: pageNumber
            });
          }
          
          setLoading(false);
          return;
        }
        
        // تحميل البيانات من الخادم
        console.log('جاري تحميل بيانات القرآن من المسار:', '/assets/quran/hafs_smart_v8.json');
        
        // محاولة تحميل البيانات من المسار الصحيح
        let response;
        let allData;
        
        // جرب المسار الأساسي أولاً
        try {
          response = await fetch(`/assets/quran/hafs_smart_v8.json`);
          if (response.ok) {
            allData = await response.json();
          }
        } catch (e) {
          console.error('خطأ في تحميل البيانات من المسار الأساسي:', e);
        }
        
        // جرب مسارًا بديلاً إذا فشل المسار الأساسي
        if (!allData) {
          try {
            console.log('محاولة استخدام مسار بديل للبيانات');
            response = await fetch(`/public/assets/quran/hafs_smart_v8.json`);
            if (response.ok) {
              allData = await response.json();
            }
          } catch (e) {
            console.error('خطأ في تحميل البيانات من المسار البديل الأول:', e);
          }
        }
        
        // جرب مسارًا ثالثًا إذا فشلت المحاولات السابقة
        if (!allData) {
          try {
            console.log('محاولة استخدام مسار بديل ثاني للبيانات');
            response = await fetch(`/quran/hafs_smart_v8.json`);
            if (response.ok) {
              allData = await response.json();
            }
          } catch (e) {
            console.error('خطأ في تحميل البيانات من المسار البديل الثاني:', e);
          }
        }
        
        // إذا تم الحصول على البيانات
        if (allData && allData.length > 0) {
          console.log('تم استلام البيانات بنجاح، عدد الآيات الكلي:', allData.length);
          
          // حفظ البيانات في المرجع للاستخدام لاحقًا
          quranDataRef.current = allData;
          
          // تصفية البيانات لصفحة محددة
          const filteredData = allData.filter((ayah: any) => ayah.page === pageNumber);
          console.log(`تم تصفية البيانات للصفحة ${pageNumber}، عدد الآيات في الصفحة:`, filteredData.length);
          
          setPageData(filteredData);
          
          // تحديث آخر قراءة إذا كان الإعداد مفعلاً
          if (settings.autoSaveLastRead && filteredData.length > 0) {
            const firstAyah = filteredData[0];
            console.log('تحديث آخر قراءة:', {
              surahNumber: firstAyah.sura_no,
              ayahNumber: firstAyah.aya_no,
              pageNumber: pageNumber
            });
            
            updateLastRead({
              surahNumber: firstAyah.sura_no,
              ayahNumber: firstAyah.aya_no,
              pageNumber: pageNumber
            });
          }
        } else {
          console.error('لم يتم العثور على بيانات القرآن من أي مسار');
          setPageData([]);
        }
      } catch (error) {
        console.error('خطأ في تحميل بيانات الصفحة:', error);
        setPageData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPageData();
  }, [pageNumber, settings.autoSaveLastRead, updateLastRead]);
  
  // التعامل مع النقر على الآية
  const handleVerseClick = (surahNumber: number, ayahNumber: number) => {
    setActiveVerse({ surah: surahNumber, verse: ayahNumber });
    
    if (onVerseSelect) {
      onVerseSelect(surahNumber, ayahNumber);
    }
  };
  
  // التنقل للصفحة التالية
  const goToNextPage = () => {
    if (pageNumber < 604) {
      setPageNumber(prev => {
        const newPage = prev + 1;
        if (onNavigate) onNavigate(newPage);
        return newPage;
      });
    }
  };
  
  // التنقل للصفحة السابقة
  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(prev => {
        const newPage = prev - 1;
        if (onNavigate) onNavigate(newPage);
        return newPage;
      });
    }
  };
  
  // الانتقال إلى صفحة محددة
  const goToPage = (page: number) => {
    if (page >= 1 && page <= 604) {
      setPageNumber(page);
      if (onNavigate) onNavigate(page);
    }
  };
  
  // إعداد إخفاء أزرار التحكم بعد فترة من عدم التفاعل
  useEffect(() => {
    if (showControls && controlsTimerRef.current === null) {
      controlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
        controlsTimerRef.current = null;
      }, 3000);
    }
    
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
        controlsTimerRef.current = null;
      }
    };
  }, [showControls]);
  
  // إعداد التمرير بالسحب للجوال
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNextPage(),
    onSwipedRight: () => goToPrevPage(),
    onTap: () => setShowControls(prev => !prev),
    trackMouse: true
  });
  
  // معالجة تغيير إدخال رقم الصفحة
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // السماح فقط بالأرقام
    if (/^\d*$/.test(value)) {
      setInputPage(value);
    }
  };
  
  // معالجة الانتقال إلى الصفحة المدخلة
  const handleGoToInputPage = () => {
    const pageNum = parseInt(inputPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= 604) {
      goToPage(pageNum);
      setShowNavigation(false);
    }
  };
  
  // معالجة النقر داخل المصحف
  const handleMushafClick = () => {
    setShowControls(prev => !prev);
  };

  return (
    <div 
      className="king-fahd-mushaf relative h-full overflow-hidden"
      {...swipeHandlers}
    >
      {/* صفحة المصحف الحالية */}
      <div onClick={handleMushafClick} className="page-container min-h-[80vh]">
        {loading ? (
          <div className="flex items-center justify-center h-[70vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <KingFahdMushafPage
            pageNumber={pageNumber}
            pageData={pageData}
            onVerseClick={handleVerseClick}
            activeVerse={activeVerse}
            fontSize={settings.fontSize}
          />
        )}
      </div>
      
      {/* أزرار التنقل */}
      <AnimatePresence>
        {showControls && (
          <>
            {/* زر الصفحة السابقة */}
            <motion.button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg text-amber-600 dark:text-amber-400"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft size={24} />
            </motion.button>
            
            {/* زر الصفحة التالية */}
            <motion.button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg text-amber-600 dark:text-amber-400"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={goToNextPage}
              disabled={pageNumber >= 604}
            >
              <ChevronRight size={24} />
            </motion.button>
            
            {/* شريط الأدوات العلوي */}
            <motion.div
              className="absolute top-4 right-4 left-4 flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg text-amber-600 dark:text-amber-400"
                  onClick={() => setShowNavigation(prev => !prev)}
                >
                  <Menu size={20} />
                </button>
                <button
                  className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg text-amber-600 dark:text-amber-400"
                >
                  <Search size={20} />
                </button>
              </div>
              
              <div className="page-info text-center p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg text-amber-600 dark:text-amber-400">
                <span>{pageNumber} / 604</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg text-amber-600 dark:text-amber-400"
                >
                  <Bookmark size={20} />
                </button>
                <button
                  className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg text-amber-600 dark:text-amber-400"
                >
                  <Settings size={20} />
                </button>
              </div>
            </motion.div>
            
            {/* قائمة التنقل */}
            <AnimatePresence>
              {showNavigation && (
                <motion.div
                  className="navigation-panel absolute top-16 left-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 justify-between">
                      <label className="text-amber-600 dark:text-amber-400">الصفحة:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={inputPage}
                          onChange={handleInputChange}
                          className="w-16 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                          placeholder={String(pageNumber)}
                        />
                        <button
                          className="px-3 py-2 bg-amber-500 text-white rounded-lg"
                          onClick={handleGoToInputPage}
                        >
                          انتقال
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 justify-between">
                      <label className="text-amber-600 dark:text-amber-400">الجزء:</label>
                      <div className="flex items-center gap-2">
                        <select
                          className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                          onChange={(e) => {
                            // تنفيذ المنطق للانتقال إلى الجزء
                          }}
                        >
                          {Array.from({ length: 30 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <button className="p-2 rounded-full bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300">
                          <ArrowUpDown size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 justify-between">
                      <label className="text-amber-600 dark:text-amber-400">السورة:</label>
                      <div className="flex items-center gap-2">
                        <select
                          className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                          onChange={(e) => {
                            // تنفيذ المنطق للانتقال إلى السورة
                          }}
                        >
                          {/* ستتم إضافة قائمة السور لاحقاً */}
                          <option value="1">الفاتحة</option>
                          <option value="2">البقرة</option>
                          <option value="3">آل عمران</option>
                          {/* ... المزيد من السور */}
                        </select>
                        <button className="p-2 rounded-full bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300">
                          <ArrowUpDown size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KingFahdMushaf;