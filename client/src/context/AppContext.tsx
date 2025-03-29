import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface AppSettings {
  reciter: string;
  translation: string;
  fontSize: number;
  showTranslation: boolean;
  autoPlayAudio: boolean;
  prayerMethod: number;
  showNextPrayer: boolean;
  highlightCurrentVerse: boolean;
  autoSaveLastRead: boolean;
}

interface BookmarkItem {
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  timestamp: string;
}

interface LastRead {
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  timestamp: string;
}

interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  bookmarks: BookmarkItem[];
  addBookmark: (bookmark: { surahNumber: number; ayahNumber: number; pageNumber: number }) => void;
  removeBookmark: (index: number) => void;
  lastRead: LastRead | null;
  updateLastRead: (lastRead: { surahNumber: number; ayahNumber: number; pageNumber: number }) => void;
}

const defaultSettings: AppSettings = {
  reciter: 'ar.alafasy',
  translation: 'ar.muyassar',
  fontSize: 24,
  showTranslation: false,
  autoPlayAudio: false,
  prayerMethod: 4, // مركز الملك فهد
  showNextPrayer: true,
  highlightCurrentVerse: true,
  autoSaveLastRead: true
};

// إنشاء سياق التطبيق
const AppContext = createContext<AppContextType | undefined>(undefined);

// مزود سياق التطبيق
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // حالة الإعدادات
  const [settings, setSettings] = useState<AppSettings>(() => {
    // جلب الإعدادات من التخزين المحلي
    const savedSettings = localStorage.getItem('quranAppSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // حالة الإشارات المرجعية
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const savedBookmarks = localStorage.getItem('quranAppBookmarks');
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });

  // حالة آخر قراءة
  const [lastRead, setLastRead] = useState<LastRead | null>(() => {
    const savedLastRead = localStorage.getItem('quranAppLastRead');
    return savedLastRead ? JSON.parse(savedLastRead) : null;
  });

  // حفظ الإعدادات عند تغييرها
  useEffect(() => {
    localStorage.setItem('quranAppSettings', JSON.stringify(settings));
  }, [settings]);

  // حفظ الإشارات المرجعية عند تغييرها
  useEffect(() => {
    localStorage.setItem('quranAppBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // حفظ آخر قراءة عند تغييرها
  useEffect(() => {
    if (lastRead) {
      localStorage.setItem('quranAppLastRead', JSON.stringify(lastRead));
    }
  }, [lastRead]);

  // تحديث الإعدادات
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  // إضافة إشارة مرجعية
  const addBookmark = (bookmark: { surahNumber: number; ayahNumber: number; pageNumber: number }) => {
    const timestamp = new Date().toISOString();
    const newBookmark: BookmarkItem = {
      ...bookmark,
      timestamp
    };
    
    // التحقق من عدم وجود نفس الإشارة المرجعية
    const bookmarkExists = bookmarks.some(
      b => b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber
    );
    
    if (!bookmarkExists) {
      setBookmarks(prevBookmarks => [...prevBookmarks, newBookmark]);
    }
  };

  // حذف إشارة مرجعية
  const removeBookmark = (index: number) => {
    setBookmarks(prevBookmarks => prevBookmarks.filter((_, i) => i !== index));
  };

  // تحديث آخر قراءة
  const updateLastRead = (lastReadData: { surahNumber: number; ayahNumber: number; pageNumber: number }) => {
    const timestamp = new Date().toISOString();
    const newLastRead: LastRead = {
      ...lastReadData,
      timestamp
    };
    
    setLastRead(newLastRead);
  };

  // قيمة السياق
  const contextValue: AppContextType = {
    settings,
    updateSettings,
    bookmarks,
    addBookmark,
    removeBookmark,
    lastRead,
    updateLastRead
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// خطاف استخدام سياق التطبيق
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};