import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { useApp } from '../../context/AppContext';

interface KingFahdMushafPageProps {
  pageNumber: number;
  onVerseSelect?: (surahNumber: number, verseNumber: number, pageNumber: number) => void;
  highlightedVerse?: { surahNumber: number; verseNumber: number };
  className?: string;
}

/**
 * مكون عرض صفحة من المصحف الشريف - إصدار مجمع الملك فهد
 */
const KingFahdMushafPage = ({
  pageNumber,
  onVerseSelect,
  highlightedVerse,
  className
}: KingFahdMushafPageProps) => {
  const { settings } = useApp();
  const [pageData, setPageData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // تحميل بيانات الصفحة من ملف JSON
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        
        console.log('بدء تحميل بيانات القرآن من:', `${window.location.origin}/assets/quran/hafs_smart_v8.json`);
        
        // جلب البيانات من ملف JSON في مجلد الأصول العامة
        // استخدام مسار مطلق لتجنب مشاكل التوجيه
        const response = await fetch(`${window.location.origin}/assets/quran/hafs_smart_v8.json`);
        
        if (!response.ok) {
          console.error('فشل في تحميل الملف:', response.status, response.statusText);
          throw new Error('فشل في تحميل بيانات المصحف');
        }
        
        console.log('تم تحميل البيانات بنجاح، جارٍ تحليل JSON...');
        const allData = await response.json();
        console.log('تم تحليل البيانات، عدد السجلات:', allData.length);
        
        // تصفية البيانات للحصول على آيات الصفحة المطلوبة فقط
        const filteredData = allData.filter((item: any) => item.page === pageNumber);
        
        setPageData(filteredData);
        setLoading(false);
      } catch (err) {
        console.error('خطأ في تحميل بيانات الصفحة:', err);
        setError('حدث خطأ أثناء تحميل بيانات الصفحة، يرجى المحاولة مرة أخرى');
        setLoading(false);
      }
    };

    fetchPageData();
  }, [pageNumber]);

  // التعامل مع النقر على الآية
  const handleVerseClick = (surahNumber: number, verseNumber: number) => {
    if (onVerseSelect) {
      onVerseSelect(surahNumber, verseNumber, pageNumber);
    }
  };

  if (loading) {
    return (
      <div className={cn("min-h-[600px] flex items-center justify-center", className)}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("min-h-[600px] flex items-center justify-center", className)}>
        <div className="text-center text-red-500">
          <div className="text-2xl mb-2">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // تقسيم الآيات حسب السطور للعرض بشكل صحيح
  const groupedByLine: Record<number, any[]> = {};
  
  if (pageData) {
    pageData.forEach((verse: any) => {
      for (let line = verse.line_start; line <= verse.line_end; line++) {
        if (!groupedByLine[line]) {
          groupedByLine[line] = [];
        }
        
        groupedByLine[line].push(verse);
      }
    });
  }

  // عرض الصفحة باستخدام بيانات الآيات المجمعة
  return (
    <div 
      className={cn(
        "quran-page relative bg-white max-w-4xl mx-auto p-8 rounded-lg shadow-md",
        "font-quran", // استخدام خط المصحف الخاص
        className
      )}
      dir="rtl"
    >
      <div className="page-header flex justify-between items-center mb-6 border-b pb-2">
        <div className="page-number text-sm">
          صفحة {pageNumber} من 604
        </div>
        <div className="surah-name text-lg font-bold">
          {pageData && pageData.length > 0 && pageData[0].sura_name_ar}
        </div>
      </div>
      
      <div className="page-content">
        {Object.keys(groupedByLine).map((lineNumber) => {
          const verses = groupedByLine[Number(lineNumber)];
          
          return (
            <div key={lineNumber} className="line flex justify-center my-4">
              {verses.map((verse: any) => {
                const isHighlighted = 
                  highlightedVerse && 
                  highlightedVerse.surahNumber === verse.sura_no && 
                  highlightedVerse.verseNumber === verse.aya_no;
                
                return (
                  <span 
                    key={`${verse.sura_no}-${verse.aya_no}-${lineNumber}`}
                    className={cn(
                      "verse px-1 cursor-pointer text-right", 
                      {
                        "bg-yellow-100 rounded": isHighlighted,
                        "hover:bg-gray-100": !isHighlighted
                      },
                      `font-size-${settings.fontSize || 20}`
                    )}
                    onClick={() => handleVerseClick(verse.sura_no, verse.aya_no)}
                    data-surah={verse.sura_no}
                    data-verse={verse.aya_no}
                    data-page={verse.page}
                  >
                    {verse.aya_text_emlaey}
                    <span className="verse-number inline-block mx-1 text-xs bg-gray-200 rounded-full w-5 h-5 leading-5 text-center">
                      {verse.aya_no}
                    </span>
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
      
      <div className="page-footer flex justify-between items-center mt-6 border-t pt-2 text-xs text-gray-500">
        <div>
          مصحف المدينة المنورة - مجمع الملك فهد لطباعة المصحف الشريف
        </div>
        <div>
          جزء {pageData && pageData.length > 0 ? pageData[0].jozz : ''}
        </div>
      </div>
    </div>
  );
};

export default KingFahdMushafPage;