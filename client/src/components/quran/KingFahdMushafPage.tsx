import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Share2, BookmarkPlus, Info } from 'lucide-react';
import { useHighlightAnimation } from '../../hooks/useHighlightAnimation';
import { useApp } from '../../context/AppContext';

interface KingFahdMushafPageProps {
  pageNumber: number;
  pageData: any[];
  onVerseClick?: (surahNumber: number, ayahNumber: number) => void;
  activeVerse?: { surah: number, verse: number } | null;
  fontSize?: number;
}

/**
 * مكون عرض صفحة المصحف الشريف بتنسيق مجمع الملك فهد
 * يعرض صفحة كاملة من المصحف مع الفواصل وعلامات الترقيم
 */
const KingFahdMushafPage: React.FC<KingFahdMushafPageProps> = ({
  pageNumber,
  pageData,
  onVerseClick,
  activeVerse,
  fontSize = 24
}) => {
  const { settings } = useApp();
  const pageRef = useRef<HTMLDivElement>(null);
  const [hoveredVerse, setHoveredVerse] = useState<{ surah: number, verse: number } | null>(null);
  const { highlightElement } = useHighlightAnimation();

  // تنظيم الآيات حسب السطور للعرض المناسب
  const organizeLinesByPage = () => {
    // جمع الآيات حسب السطور
    const lineMap: Record<number, any[]> = {};
    
    pageData.forEach(ayah => {
      // استخدام line_start للتنظيم
      const lineStart = ayah.line_start;
      const lineEnd = ayah.line_end;
      
      // إنشاء مصفوفة لكل سطر إذا لم تكن موجودة
      for (let i = lineStart; i <= lineEnd; i++) {
        if (!lineMap[i]) {
          lineMap[i] = [];
        }
        
        // إضافة الآية إلى السطر المناسب
        if (i === lineStart) {
          lineMap[i].push(ayah);
        }
      }
    });
    
    // تحويل الخريطة إلى مصفوفة مرتبة
    return Object.keys(lineMap)
      .map(Number)
      .sort((a, b) => a - b)
      .map(lineNum => ({
        lineNumber: lineNum,
        ayahs: lineMap[lineNum].sort((a: any, b: any) => a.aya_no - b.aya_no)
      }));
  };

  const lines = organizeLinesByPage();

  // عند النقر على آية
  const handleVerseClick = (surahNumber: number, ayahNumber: number) => {
    if (onVerseClick) {
      onVerseClick(surahNumber, ayahNumber);
    }
  };

  // تأثير اختيار وإبراز الآية
  useEffect(() => {
    if (activeVerse && pageRef.current && settings.highlightCurrentVerse) {
      const activeVerseElement = pageRef.current.querySelector(
        `[data-surah="${activeVerse.surah}"][data-verse="${activeVerse.verse}"]`
      ) as HTMLElement;

      if (activeVerseElement) {
        highlightElement(activeVerseElement, {
          duration: 2000,
          highlightColor: 'rgba(255, 193, 7, 0.2)',
          scrollBehavior: 'smooth'
        });
      }
    }
  }, [activeVerse, highlightElement, settings.highlightCurrentVerse]);

  // التحقق من خلو الصفحة
  if (!pageData || pageData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-amber-600 dark:text-amber-400 text-lg">لا توجد بيانات لهذه الصفحة</p>
      </div>
    );
  }

  // استخراج معلومات السورة للعنوان
  const firstAyah = pageData[0];
  const surahName = firstAyah?.sura_name_ar || '';

  return (
    <div 
      ref={pageRef}
      className="mushaf-page relative bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg shadow-md"
    >
      {/* عنوان الصفحة والسورة */}
      <div className="page-header mb-6 text-center">
        <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-200">
          {surahName}
        </h2>
        <div className="page-number text-sm text-amber-600 dark:text-amber-400">
          صفحة {pageNumber} من 604
        </div>
      </div>

      {/* عرض السطور والآيات */}
      <div className="lines-container space-y-6 text-right" dir="rtl">
        {lines.map(line => (
          <div key={line.lineNumber} className="line relative">
            <div 
              className="line-content"
              style={{ 
                fontSize: `${fontSize}px`,
                fontFamily: 'HafsSmart',
                lineHeight: 2.2
              }}
            >
              {line.ayahs.map((ayah: any) => (
                <span
                  key={`${ayah.sura_no}-${ayah.aya_no}`}
                  className={`verse-text inline cursor-pointer
                    ${(activeVerse?.surah === ayah.sura_no && activeVerse?.verse === ayah.aya_no)
                      ? 'text-amber-700 dark:text-amber-300 font-bold'
                      : 'text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400'
                    }
                  `}
                  data-surah={ayah.sura_no}
                  data-verse={ayah.aya_no}
                  onClick={() => handleVerseClick(ayah.sura_no, ayah.aya_no)}
                  onMouseEnter={() => setHoveredVerse({ surah: ayah.sura_no, verse: ayah.aya_no })}
                  onMouseLeave={() => setHoveredVerse(null)}
                >
                  {ayah.aya_text_emlaey + " "}
                  {hoveredVerse?.surah === ayah.sura_no && hoveredVerse?.verse === ayah.aya_no && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="verse-number inline-block mr-1 text-amber-500 dark:text-amber-400 text-sm align-super"
                    >
                      ﴿{ayah.aya_no}﴾
                    </motion.span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* شريط أدوات التفاعل مع الصفحة */}
      <div className="page-actions absolute bottom-4 left-4 flex items-center gap-2">
        <button 
          className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200"
          title="إضافة علامة مرجعية"
        >
          <BookmarkPlus size={18} />
        </button>
        <button 
          className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200"
          title="مشاركة الصفحة"
        >
          <Share2 size={18} />
        </button>
        <button 
          className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200"
          title="معلومات الصفحة"
        >
          <Info size={18} />
        </button>
      </div>
    </div>
  );
};

export default KingFahdMushafPage;