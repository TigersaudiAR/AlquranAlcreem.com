import { useState, useCallback } from 'react';
import { SURAH_NAMES, APP_CONFIG } from '../../lib/constants';
import { toArabicNumbers } from '../../lib/utils';

interface QuranNavSidebarProps {
  currentPage: number;
  currentSurah?: number;
  onPageChange: (page: number) => void;
  onSurahSelect: (surahNumber: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuranNavSidebar({
  currentPage,
  currentSurah,
  onPageChange,
  onSurahSelect,
  isOpen,
  onClose
}: QuranNavSidebarProps) {
  const [activeTab, setActiveTab] = useState<'surahs' | 'pages' | 'bookmarks'>('surahs');
  const [searchQuery, setSearchQuery] = useState('');
  
  // معالجة تحديد الصفحة
  const handlePageSelect = useCallback((page: number) => {
    onPageChange(page);
    onClose();
  }, [onPageChange, onClose]);
  
  // معالجة تحديد السورة
  const handleSurahSelect = useCallback((surahNumber: number) => {
    onSurahSelect(surahNumber);
    onClose();
  }, [onSurahSelect, onClose]);
  
  // تصفية السور بناءً على البحث
  const filteredSurahs = searchQuery 
    ? SURAH_NAMES.filter(surah => 
        surah.name.includes(searchQuery) || 
        surah.transliteration.includes(searchQuery.toLowerCase())
      )
    : SURAH_NAMES;
  
  // إنشاء قائمة بالصفحات
  const pages = Array.from({ length: APP_CONFIG.TOTAL_PAGES }, (_, i) => i + 1);
  
  // تصفية الصفحات بناءً على البحث
  const filteredPages = searchQuery 
    ? pages.filter(page => page.toString().includes(searchQuery))
    : pages;
  
  // رسم الشريط الجانبي
  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-background border-e transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out overflow-hidden z-50`}>
      <div className="h-full flex flex-col">
        {/* رأس الشريط الجانبي */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">القرآن الكريم</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* تبويبات التنقل */}
        <div className="flex border-b">
          <button 
            className={`flex-1 py-2 text-center ${activeTab === 'surahs' ? 'border-b-2 border-primary font-bold' : ''}`}
            onClick={() => setActiveTab('surahs')}
          >
            السور
          </button>
          <button 
            className={`flex-1 py-2 text-center ${activeTab === 'pages' ? 'border-b-2 border-primary font-bold' : ''}`}
            onClick={() => setActiveTab('pages')}
          >
            الصفحات
          </button>
          <button 
            className={`flex-1 py-2 text-center ${activeTab === 'bookmarks' ? 'border-b-2 border-primary font-bold' : ''}`}
            onClick={() => setActiveTab('bookmarks')}
          >
            العلامات
          </button>
        </div>
        
        {/* مربع البحث */}
        <div className="p-2 border-b">
          <input
            type="text"
            placeholder="بحث..."
            className="w-full p-2 rounded border bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* محتوى التبويب */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'surahs' && (
            <div className="divide-y">
              {filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  className={`w-full text-right px-4 py-2 hover:bg-muted flex justify-between items-center ${currentSurah === surah.number ? 'bg-muted' : ''}`}
                  onClick={() => handleSurahSelect(surah.number)}
                >
                  <span>
                    <span className="ml-2 inline-block w-8 text-center">{toArabicNumbers(surah.number)}</span>
                    {surah.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{toArabicNumbers(surah.totalVerses)}</span>
                </button>
              ))}
            </div>
          )}
          
          {activeTab === 'pages' && (
            <div className="grid grid-cols-3 gap-2 p-2">
              {filteredPages.map((page) => (
                <button
                  key={page}
                  className={`p-2 rounded text-center hover:bg-muted ${currentPage === page ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => handlePageSelect(page)}
                >
                  {toArabicNumbers(page)}
                </button>
              ))}
            </div>
          )}
          
          {activeTab === 'bookmarks' && (
            <div className="p-4 text-center text-muted-foreground">
              لا توجد علامات مرجعية حتى الآن
            </div>
          )}
        </div>
      </div>
    </div>
  );
}