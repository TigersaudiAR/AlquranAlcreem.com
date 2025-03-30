import { useState, useEffect } from 'react';
import { SURAH_NAMES, APP_CONFIG } from '../../lib/constants';
import { 
  X, 
  BookOpen, 
  BookText, 
  Layers, 
  Bookmark, 
  History 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';

interface QuranNavSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * شريط التنقل الجانبي للقرآن الكريم
 */
const QuranNavSidebar = ({
  isOpen,
  onClose,
  currentPage,
  onPageChange,
  className
}: QuranNavSidebarProps) => {
  const { bookmarks, lastRead } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('surahs');
  
  // تصفية السور بناءً على البحث
  const filteredSurahs = SURAH_NAMES.filter(surah => 
    searchQuery === '' || 
    surah.name.includes(searchQuery) || 
    surah.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.number.toString().includes(searchQuery)
  );
  
  // توليد أرقام الصفحات
  const pageNumbers = Array.from({ length: APP_CONFIG.TOTAL_PAGES }, (_, i) => i + 1);
  
  // تصفية الصفحات بناءً على البحث
  const filteredPages = searchQuery === '' 
    ? pageNumbers 
    : pageNumbers.filter(num => num.toString().includes(searchQuery));
  
  // توليد أرقام الأجزاء
  const juzNumbers = Array.from({ length: APP_CONFIG.TOTAL_JUZS }, (_, i) => i + 1);
  
  // تصفية الأجزاء بناءً على البحث
  const filteredJuzs = searchQuery === '' 
    ? juzNumbers 
    : juzNumbers.filter(num => num.toString().includes(searchQuery));
  
  // إغلاق الشريط الجانبي عند الضغط على Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={cn(
        "quran-sidebar fixed inset-0 z-50 bg-white dark:bg-gray-900 shadow-xl",
        "transform transition-transform duration-300 ease-in-out",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen
        },
        className
      )}
      dir="rtl"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">القرآن الكريم</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 border-b">
          <Input 
            type="text"
            placeholder="بحث..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Tabs 
          defaultValue="surahs" 
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid grid-cols-5 mb-2 p-1 mx-4 mt-4">
            <TabsTrigger value="surahs" className="flex flex-col items-center text-xs py-2">
              <BookText className="h-4 w-4 mb-1" />
              <span>السور</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex flex-col items-center text-xs py-2">
              <BookOpen className="h-4 w-4 mb-1" />
              <span>الصفحات</span>
            </TabsTrigger>
            <TabsTrigger value="juz" className="flex flex-col items-center text-xs py-2">
              <Layers className="h-4 w-4 mb-1" />
              <span>الأجزاء</span>
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="flex flex-col items-center text-xs py-2">
              <Bookmark className="h-4 w-4 mb-1" />
              <span>المرجعيات</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex flex-col items-center text-xs py-2">
              <History className="h-4 w-4 mb-1" />
              <span>التاريخ</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 px-4 overflow-hidden">
            <TabsContent value="surahs" className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-1 gap-2 pb-4">
                  {filteredSurahs.map((surah) => (
                    <button
                      key={surah.number}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-md text-right",
                        "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      )}
                      onClick={() => {
                        // هنا يجب وضع رقم الصفحة المناسب لكل سورة
                        // حاليًا مجرد تقدير ويجب تحديثه بالبيانات الصحيحة
                        const estimatedPage = Math.min(surah.number * 5, APP_CONFIG.TOTAL_PAGES);
                        onPageChange(estimatedPage);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center ml-3">
                          {surah.number}
                        </div>
                        <div>
                          <div className="font-semibold">{surah.name}</div>
                          <div className="text-xs text-gray-500">آياتها: {surah.totalVerses}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 font-arabic">
                        {surah.transliteration}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="pages" className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-5 gap-2 pb-4">
                  {filteredPages.map((page) => (
                    <button
                      key={page}
                      className={cn(
                        "p-3 rounded-md",
                        "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                        {
                          "bg-primary/20 font-bold": page === currentPage
                        }
                      )}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="juz" className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-3 gap-2 pb-4">
                  {filteredJuzs.map((juz) => (
                    <button
                      key={juz}
                      className={cn(
                        "p-3 rounded-md flex flex-col items-center",
                        "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      )}
                      onClick={() => {
                        // هنا يجب وضع رقم الصفحة المناسب لكل جزء
                        // حاليًا مجرد تقدير ويجب تحديثه بالبيانات الصحيحة
                        const estimatedPage = Math.min(juz * 20, APP_CONFIG.TOTAL_PAGES);
                        onPageChange(estimatedPage);
                      }}
                    >
                      <div className="text-lg font-semibold">جزء {juz}</div>
                      <div className="text-xs text-gray-500">
                        {/* معلومات إضافية عن الجزء يمكن إضافتها هنا */}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="bookmarks" className="h-full mt-0">
              <ScrollArea className="h-full">
                {bookmarks.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    لا توجد إشارات مرجعية حتى الآن
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 pb-4">
                    {bookmarks.map((bookmark, index) => (
                      <button
                        key={index}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-md text-right",
                          "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        )}
                        onClick={() => onPageChange(bookmark.pageNumber)}
                      >
                        <div className="flex items-center">
                          <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center ml-3">
                            <Bookmark className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-semibold">
                              {SURAH_NAMES.find(s => s.number === bookmark.surahNumber)?.name} ({bookmark.ayahNumber})
                            </div>
                            <div className="text-xs text-gray-500">
                              صفحة {bookmark.pageNumber}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(bookmark.timestamp).toLocaleDateString('ar-EG')}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="history" className="h-full mt-0">
              <ScrollArea className="h-full">
                {!lastRead ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    لا يوجد سجل للقراءة حتى الآن
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 pb-4">
                    <button
                      className={cn(
                        "flex items-center justify-between p-3 rounded-md text-right",
                        "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      )}
                      onClick={() => onPageChange(lastRead.pageNumber)}
                    >
                      <div className="flex items-center">
                        <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center ml-3">
                          <History className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {SURAH_NAMES.find(s => s.number === lastRead.surahNumber)?.name} ({lastRead.ayahNumber})
                          </div>
                          <div className="text-xs text-gray-500">
                            صفحة {lastRead.pageNumber}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(lastRead.timestamp).toLocaleDateString('ar-EG')}
                      </div>
                    </button>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default QuranNavSidebar;