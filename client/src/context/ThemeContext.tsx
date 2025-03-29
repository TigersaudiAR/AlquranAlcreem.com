import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// إنشاء سياق المظهر
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// مزود سياق المظهر
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // حالة المظهر (فاتح أو داكن)
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    // البحث عن المظهر المحفوظ في التخزين المحلي
    const savedTheme = localStorage.getItem('quranAppTheme');
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    
    // استخدام تفضيلات النظام إذا لم يكن هناك مظهر محفوظ
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  // تبديل المظهر
  const toggleTheme = () => {
    setThemeState(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // تعيين المظهر بشكل مباشر
  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  // تطبيق المظهر على العنصر الجذر (html)
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // حفظ المظهر في التخزين المحلي
    localStorage.setItem('quranAppTheme', theme);
  }, [theme]);

  // الاستماع لتغييرات تفضيلات النظام
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      
      // استخدام تفضيلات النظام فقط إذا لم يكن المستخدم قد اختار مظهرًا
      if (!localStorage.getItem('quranAppTheme')) {
        setThemeState(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // قيمة السياق
  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// خطاف استخدام سياق المظهر
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};