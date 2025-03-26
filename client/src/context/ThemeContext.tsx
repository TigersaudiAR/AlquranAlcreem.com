import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the theme context type
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

// Theme provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize theme from localStorage or use system preference
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('quranAppTheme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    
    // Otherwise use system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default to light
    return 'light';
  });
  
  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quranAppTheme', theme);
    
    // Apply the theme to the document element for CSS styling
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change theme based on system preference if no explicit user preference is set
      if (!localStorage.getItem('quranAppTheme')) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setThemeState(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // Function to explicitly set the theme
  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };
  
  // Provide theme context
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);
