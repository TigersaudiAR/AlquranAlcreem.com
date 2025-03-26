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
    // For SSR or when window is not available
    if (typeof window === 'undefined') return 'light';
    
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
  
  // Apply theme immediately on mount and when theme changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('quranAppTheme', theme);
    
    // Apply the theme to the document element for CSS styling
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    
    // Also set a data attribute for additional theme-related styling
    root.setAttribute('data-theme', theme);
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
    
    // Add event listener with compatibility for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, []);
  
  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    console.log("Toggling theme from:", theme);
    setThemeState(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log("New theme will be:", newTheme);
      return newTheme;
    });
  };
  
  // Function to explicitly set the theme
  const setTheme = (newTheme: 'light' | 'dark') => {
    console.log("Setting theme to:", newTheme);
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
