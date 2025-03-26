import { useState, useCallback, useEffect } from 'react';

interface LastRead {
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  text: string;
  timestamp: string;
  description?: string;
}

export function useQuranData() {
  const [lastRead, setLastRead] = useState<LastRead | null>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  
  // استرداد آخر قراءة من التخزين المحلي عند تهيئة الهوك
  useEffect(() => {
    const savedLastRead = getLastReadFromStorage();
    if (savedLastRead) {
      setLastRead(savedLastRead);
    }
    
    // استرداد الفواصل من التخزين المحلي
    const savedBookmarks = localStorage.getItem('quran_bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Error parsing bookmarks:', error);
      }
    }
  }, []);
  
  // استرجاع آخر قراءة من التخزين المحلي
  const getLastReadFromStorage = useCallback((): LastRead | null => {
    const savedLastRead = localStorage.getItem('quran_last_read');
    if (savedLastRead) {
      try {
        return JSON.parse(savedLastRead);
      } catch (error) {
        console.error('Error parsing last read data:', error);
        return null;
      }
    }
    return null;
  }, []);
  
  // تحديث آخر قراءة
  const updateLastRead = useCallback((newLastRead: Partial<LastRead> & { surahNumber: number; ayahNumber: number; pageNumber: number }) => {
    // الحصول على اسم السورة إذا لم يكن موجودًا
    const surahName = newLastRead.surahName || `سورة ${newLastRead.surahNumber}`;
    
    const lastReadData: LastRead = {
      surahName,
      surahNumber: newLastRead.surahNumber,
      ayahNumber: newLastRead.ayahNumber,
      pageNumber: newLastRead.pageNumber,
      text: newLastRead.text || '',
      timestamp: new Date().toISOString(),
      description: newLastRead.description,
    };
    
    // حفظ في التخزين المحلي
    localStorage.setItem('quran_last_read', JSON.stringify(lastReadData));
    
    // تحديث الحالة
    setLastRead(lastReadData);
  }, []);
  
  // إضافة فاصل جديد
  const addBookmark = useCallback((bookmark: { surahNumber: number; ayahNumber: number; pageNumber: number; description?: string }) => {
    const newBookmark = {
      id: Date.now().toString(),
      ...bookmark,
      timestamp: new Date().toISOString(),
    };
    
    setBookmarks(prevBookmarks => {
      const updatedBookmarks = [...prevBookmarks, newBookmark];
      localStorage.setItem('quran_bookmarks', JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  }, []);
  
  // حذف فاصل
  const removeBookmark = useCallback((bookmarkId: string) => {
    setBookmarks(prevBookmarks => {
      const updatedBookmarks = prevBookmarks.filter(bookmark => bookmark.id !== bookmarkId);
      localStorage.setItem('quran_bookmarks', JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  }, []);
  
  return {
    lastRead,
    updateLastRead,
    bookmarks,
    addBookmark,
    removeBookmark,
  };
}