import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SURAH_NAMES } from '../../lib/constants';
import { Clock, Search, BookMarked, Folder, Settings, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QuranNavSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSurah: (surahNumber: number) => void;
  onSelectJuz: (juzNumber: number) => void;
  onSelectPage: (pageNumber: number) => void;
  onSelectBookmark: (surahNumber: number, ayahNumber: number, pageNumber: number) => void;
  onSelectLastRead: () => void;
}

const QuranNavSidebar: React.FC<QuranNavSidebarProps> = ({
  isOpen,
  onClose,
  onSelectSurah,
  onSelectJuz,
  onSelectPage,
  onSelectBookmark,
  onSelectLastRead
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('surahs');
  const { bookmarks, lastRead } = useApp();
  
  // تصفية السور بناءً على مصطلح البحث
  const filteredSurahs = searchTerm
    ? SURAH_NAMES.map((name, index) => ({ name, number: index + 1 })).filter(
        surah => surah.name.includes(searchTerm) || surah.number.toString().includes(searchTerm)
      )
    : SURAH_NAMES.map((name, index) => ({ name, number: index + 1 }));
    
  // إنشاء مصفوفة للأجزاء 1-30
  const juzs = Array.from({ length: 30 }, (_, i) => i + 1);
  
  // معالج النقر على سورة
  const handleSurahClick = (surahNumber: number) => {
    onSelectSurah(surahNumber);
    onClose();
  };
  
  // معالج النقر على جزء
  const handleJuzClick = (juzNumber: number) => {
    onSelectJuz(juzNumber);
    onClose();
  };
  
  // معالج النقر على علامة مرجعية
  const handleBookmarkClick = (bookmark: { surahNumber: number; ayahNumber: number; pageNumber: number }) => {
    onSelectBookmark(bookmark.surahNumber, bookmark.ayahNumber, bookmark.pageNumber);
    onClose();
  };
  
  // معالج النقر على آخر قراءة
  const handleLastReadClick = () => {
    onSelectLastRead();
    onClose();
  };
  
  // معالج تغيير علامة التبويب
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setSearchTerm('');
  };
  
  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()} side="right">
      <SheetContent className="h-[100vh] max-h-[100vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl text-amber-700 dark:text-amber-300 text-right">
            القرآن الكريم
          </SheetTitle>
          <SheetDescription className="text-right">
            تصفح السور والأجزاء والعلامات المرجعية
          </SheetDescription>
        </SheetHeader>
        
        <div className="px-2 py-4">
          <Tabs defaultValue="surahs" value={selectedTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="surahs" className="text-xs sm:text-sm">
                <Folder className="h-4 w-4 ml-1.5" />
                <span className="hidden sm:inline">السور</span>
              </TabsTrigger>
              <TabsTrigger value="juz" className="text-xs sm:text-sm">
                <div className="ml-1.5 h-4 w-4 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-[10px] font-bold">٣٠</div>
                <span className="hidden sm:inline">الأجزاء</span>
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="text-xs sm:text-sm">
                <BookMarked className="h-4 w-4 ml-1.5" />
                <span className="hidden sm:inline">المرجعيات</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs sm:text-sm">
                <Clock className="h-4 w-4 ml-1.5" />
                <span className="hidden sm:inline">آخر قراءة</span>
              </TabsTrigger>
            </TabsList>
            
            {(selectedTab === 'surahs' || selectedTab === 'juz') && (
              <div className="relative mb-4">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="بحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 pr-9 text-right"
                  dir="rtl"
                />
              </div>
            )}
            
            <TabsContent value="surahs" className="mt-0">
              <ScrollArea className="h-[50vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredSurahs.map((surah) => (
                    <Button
                      key={surah.number}
                      variant="ghost"
                      className="justify-between h-auto py-2 text-right"
                      onClick={() => handleSurahClick(surah.number)}
                    >
                      <span className="flex items-center text-amber-700 dark:text-amber-300">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="inline-block ml-2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-full w-6 h-6 text-xs flex items-center justify-center">
                          {surah.number}
                        </span>
                        {surah.name}
                      </span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="juz" className="mt-0">
              <ScrollArea className="h-[50vh]">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {juzs
                    .filter(juz => searchTerm ? juz.toString().includes(searchTerm) : true)
                    .map((juz) => (
                      <Button
                        key={juz}
                        variant="outline"
                        className="h-16 flex flex-col items-center justify-center gap-1"
                        onClick={() => handleJuzClick(juz)}
                      >
                        <span className="text-sm font-medium">الجزء</span>
                        <span className="text-lg font-bold text-amber-700 dark:text-amber-300">{juz}</span>
                      </Button>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="bookmarks" className="mt-0">
              <ScrollArea className="h-[50vh]">
                {bookmarks.length > 0 ? (
                  <div className="space-y-3">
                    {bookmarks.map((bookmark, index) => (
                      <Card key={index} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <CardHeader className="p-3" onClick={() => handleBookmarkClick(bookmark)}>
                          <CardTitle className="text-base flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(bookmark.timestamp)}
                            </span>
                            <span>
                              سورة {SURAH_NAMES[bookmark.surahNumber - 1]}، الآية {bookmark.ayahNumber}
                            </span>
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500 dark:text-gray-400">
                    <BookMarked className="h-12 w-12 mb-2 text-gray-300 dark:text-gray-600" />
                    <p>لا توجد علامات مرجعية حتى الآن</p>
                    <p className="text-sm mt-1">اضغط على زر الإشارة المرجعية أثناء القراءة لحفظ الموقع</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <div className="flex flex-col items-center justify-center py-4">
                {lastRead ? (
                  <Card className="w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <CardHeader className="p-4" onClick={handleLastReadClick}>
                      <CardTitle className="text-base text-right">
                        آخر قراءة: سورة {SURAH_NAMES[lastRead.surahNumber - 1]}، الآية {lastRead.ayahNumber}
                      </CardTitle>
                      <CardContent className="p-0 pt-2 text-sm text-gray-500 dark:text-gray-400 text-right">
                        {formatDate(lastRead.timestamp)}
                      </CardContent>
                    </CardHeader>
                  </Card>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500 dark:text-gray-400">
                    <Clock className="h-12 w-12 mb-2 text-gray-300 dark:text-gray-600" />
                    <p>لا توجد تاريخ قراءة حتى الآن</p>
                    <p className="text-sm mt-1">سيتم حفظ موقع آخر قراءة تلقائياً</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <SheetFooter className="pt-2">
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default QuranNavSidebar;