import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  bookmarks: {
    surahNumber: number;
    ayahNumber: number;
    pageNumber: number;
    timestamp: string;
  }[];
  addBookmark: (bookmark: { surahNumber: number; ayahNumber: number; pageNumber: number }) => void;
  removeBookmark: (index: number) => void;
  lastRead: {
    surahNumber: number;
    ayahNumber: number;
    pageNumber: number;
    timestamp: string;
  } | null;
  updateLastRead: (lastRead: { surahNumber: number; ayahNumber: number; pageNumber: number }) => void;
}

const defaultSettings: AppSettings = {
  reciter: 'ar.alafasy',
  translation: 'ar',
  fontSize: 18,
  showTranslation: true,
  autoPlayAudio: false,
  prayerMethod: 2, // Umm al-Qura University, Makkah
  showNextPrayer: true,
  highlightCurrentVerse: true,
  autoSaveLastRead: true
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('quranAppSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  const [bookmarks, setBookmarks] = useState<AppContextType['bookmarks']>(() => {
    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem('quranBookmarks');
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });
  
  const [lastRead, setLastRead] = useState<AppContextType['lastRead']>(() => {
    // Load last read position from localStorage
    const savedLastRead = localStorage.getItem('quranLastRead');
    return savedLastRead ? JSON.parse(savedLastRead) : null;
  });
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quranAppSettings', JSON.stringify(settings));
  }, [settings]);
  
  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quranBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);
  
  // Save last read position to localStorage whenever it changes
  useEffect(() => {
    if (lastRead) {
      localStorage.setItem('quranLastRead', JSON.stringify(lastRead));
    }
  }, [lastRead]);
  
  // Update settings function
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Add bookmark function
  const addBookmark = (bookmark: { surahNumber: number; ayahNumber: number; pageNumber: number }) => {
    setBookmarks(prev => [
      ...prev,
      {
        ...bookmark,
        timestamp: new Date().toISOString(),
      },
    ]);
  };
  
  // Remove bookmark function
  const removeBookmark = (index: number) => {
    setBookmarks(prev => prev.filter((_, i) => i !== index));
  };
  
  // Update last read function
  const updateLastRead = (newLastRead: { surahNumber: number; ayahNumber: number; pageNumber: number }) => {
    setLastRead({
      ...newLastRead,
      timestamp: new Date().toISOString(),
    });
  };
  
  // Provide context value
  const contextValue: AppContextType = {
    settings,
    updateSettings,
    bookmarks,
    addBookmark,
    removeBookmark,
    lastRead,
    updateLastRead,
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};