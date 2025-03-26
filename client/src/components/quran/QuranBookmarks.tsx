import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SURAH_NAMES } from '../../lib/constants';

interface QuranBookmark {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  timestamp: string;
  description?: string;
}

interface QuranBookmarksProps {
  bookmarks: QuranBookmark[];
  onSelectBookmark: (bookmark: QuranBookmark) => void;
  onRemoveBookmark?: (bookmarkId: string) => void;
}

const QuranBookmarks = ({ bookmarks, onSelectBookmark, onRemoveBookmark }: QuranBookmarksProps) => {
  // تحويل التاريخ إلى صيغة مقروءة
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // الحصول على اسم السورة من الرقم
  const getSurahName = (surahNumber: number) => {
    const surah = SURAH_NAMES.find(s => s.number === surahNumber);
    return surah ? surah.name : `سورة ${surahNumber}`;
  };

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-xl text-right">فواصل القرآن</CardTitle>
      </CardHeader>
      <CardContent>
        {bookmarks.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            لا توجد فواصل محفوظة
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {bookmarks.map((bookmark) => (
                <div 
                  key={bookmark.id} 
                  className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  <div className="flex-1 text-right">
                    <div className="font-medium">{getSurahName(bookmark.surahNumber)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      الآية {bookmark.ayahNumber} - الصفحة {bookmark.pageNumber}
                    </div>
                    {bookmark.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {bookmark.description}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatDate(bookmark.timestamp)}
                    </div>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => onSelectBookmark(bookmark)}
                    >
                      فتح
                    </Button>
                    {onRemoveBookmark && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => onRemoveBookmark(bookmark.id)}
                      >
                        حذف
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default QuranBookmarks;