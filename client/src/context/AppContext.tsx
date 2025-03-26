import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RECITERS, LANGUAGES } from '../lib/constants';

// Define app settings types
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

// Define the overall app context type
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

// Create the context with default values
const AppContext = createContext<AppContextType>({
  settings: {
    reciter: RECITERS[0].id,
    translation: LANGUAGES[0].translation,
    fontSize: 3,
    showTranslation: true,
    autoPlayAudio: false,
    prayerMethod: 2,
    showNextPrayer: true,
    highlightCurrentVerse: true,
    autoSaveLastRead: true,
  },
  updateSettings: () => {},
  bookmarks: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  lastRead: null,
  updateLastRead: () => {},
});

// Context provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Initialize settings from localStorage or use defaults
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('quranAppSettings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
    
    return {
      reciter: RECITERS[0].id,
      translation: LANGUAGES[0].translation,
      fontSize: 3,
      showTranslation: true,
      autoPlayAudio: false,
      prayerMethod: 2,
      showNextPrayer: true,
      highlightCurrentVerse: true,
      autoSaveLastRead: true,
    };
  });
  
  // Initialize bookmarks from localStorage or use empty array
  const [bookmarks, setBookmarks] = useState<any[]>(() => {
    const savedBookmarks = localStorage.getItem('quranBookmarks');
    if (savedBookmarks) {
      try {
        return JSON.parse(savedBookmarks);
      } catch (e) {
        console.error('Failed to parse saved bookmarks:', e);
        return [];
      }
    }
    return [];
  });
  
  // Initialize last read position from localStorage
  const [lastRead, setLastRead] = useState<any>(() => {
    const savedLastRead = localStorage.getItem('quranLastRead');
    if (savedLastRead) {
      try {
        return JSON.parse(savedLastRead);
      } catch (e) {
        console.error('Failed to parse saved last read:', e);
        return null;
      }
    }
    return null;
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

// Custom hook for using the app context
export const useApp = () => useContext(AppContext);
