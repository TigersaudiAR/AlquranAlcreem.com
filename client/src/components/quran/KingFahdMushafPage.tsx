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
        "quran-page relative mx-auto p-8 rounded-lg",
        "islamic-pattern bg-warmth font-quran",
        "border border-gold/20 shadow-decorative overflow-hidden",
        className
      )}
      dir="rtl"
    >
      {/* زخرفة الزوايا */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full text-gold">
          <path d="M100,0 C100,50 50,100 0,100 C50,100 100,50 100,0" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute top-0 left-0 w-16 h-16 opacity-30 transform scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-gold">
          <path d="M100,0 C100,50 50,100 0,100 C50,100 100,50 100,0" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16 opacity-30 transform scale-y-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-gold">
          <path d="M100,0 C100,50 50,100 0,100 C50,100 100,50 100,0" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-16 h-16 opacity-30 transform scale-x-[-1] scale-y-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-gold">
          <path d="M100,0 C100,50 50,100 0,100 C50,100 100,50 100,0" fill="currentColor" />
        </svg>
      </div>
      
      {/* ترويسة الصفحة */}
      <div className="page-header flex justify-between items-center mb-8 pb-3 border-b border-gold/30">
        <div className="page-number font-heading-arabic text-sm flex items-center">
          <div className="bg-gold/10 px-3 py-1 rounded-full border border-gold/20 text-navy/80">
            صفحة {pageNumber} من 604
          </div>
        </div>
        <div className="surah-name text-xl font-bold font-heading-arabic text-emerald-dark">
          {pageData && pageData.length > 0 && pageData[0].sura_name_ar}
        </div>
      </div>
      
      {/* محتوى الآيات */}
      <div className="page-content px-2 sm:px-6">
        {Object.keys(groupedByLine).map((lineNumber) => {
          const verses = groupedByLine[Number(lineNumber)];
          
          return (
            <div key={lineNumber} className="line flex flex-wrap justify-center my-5 text-center">
              {verses.map((verse: any) => {
                const isHighlighted = 
                  highlightedVerse && 
                  highlightedVerse.surahNumber === verse.sura_no && 
                  highlightedVerse.verseNumber === verse.aya_no;
                
                return (
                  <span 
                    key={`${verse.sura_no}-${verse.aya_no}-${lineNumber}`}
                    className={cn(
                      "quran-verse px-1 cursor-pointer text-right transition-all duration-300", 
                      {
                        "selected": isHighlighted,
                        "hover:bg-gold/5 hover:rounded": !isHighlighted
                      },
                      `font-size-${settings.fontSize || 24}`
                    )}
                    onClick={() => handleVerseClick(verse.sura_no, verse.aya_no)}
                    data-surah={verse.sura_no}
                    data-verse={verse.aya_no}
                    data-page={verse.page}
                  >
                    {verse.aya_text_emlaey}
                    <span className="verse-number mx-1">
                      {verse.aya_no}
                    </span>
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
      
      {/* تذييل الصفحة */}
      <div className="page-footer flex justify-between items-center mt-8 pt-3 border-t border-gold/30 text-xs text-gray-600">
        <div className="font-arabic">
          مصحف المدينة المنورة - مجمع الملك فهد لطباعة المصحف الشريف
        </div>
        <div className="flex items-center">
          <div className="bg-gold/10 px-3 py-1 rounded-full border border-gold/20 text-navy/80">
            جزء {pageData && pageData.length > 0 ? pageData[0].jozz : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KingFahdMushafPage;