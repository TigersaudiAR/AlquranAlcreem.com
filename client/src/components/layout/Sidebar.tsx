import { useLocation } from 'wouter';
import { useTheme } from '../../context/ThemeContext';
import { APP_CONFIG } from '../../lib/constants';

const Sidebar = () => {
  const [location, setLocation] = useLocation();
  const { toggleTheme, theme } = useTheme();
  
  const navItems = [
    { path: '/', icon: 'fas fa-home', label: 'الرئيسية' },
    { path: '/quran', icon: 'fas fa-book-quran', label: 'القرآن الكريم' },
    { path: '/prayer', icon: 'fas fa-mosque', label: 'مواقيت الصلاة' },
    { path: '/memorization', icon: 'fas fa-brain', label: 'الحفظ والمراجعة' },
    { path: '/tafsir', icon: 'fas fa-book-open', label: 'التفسير' },
    { path: '/hadith', icon: 'fas fa-scroll', label: 'الأحاديث النبوية' },
    { path: '/duas', icon: 'fas fa-hands-praying', label: 'الأدعية والأذكار' },
    { path: '/hajj', icon: 'fas fa-kaaba', label: 'الحج والعمرة' },
    { path: '/settings', icon: 'fas fa-gear', label: 'الإعدادات' }
  ];
  
  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };
  
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 shadow-lg z-10">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">القرآن التعليمي</h1>
        <button 
          className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700" 
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <i className="fas fa-sun text-gray-300"></i>
          ) : (
            <i className="fas fa-moon text-gray-600"></i>
          )}
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1">
        <nav className="p-2">
          <ul>
            {navItems.map((item) => (
              <li className="mb-1" key={item.path}>
                <a 
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation(item.path);
                  }}
                  className={`flex items-center p-3 rounded-lg ${
                    isActive(item.path) 
                      ? 'bg-gray-200 dark:bg-gray-700 font-medium text-gray-800 dark:text-gray-200' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className={`${item.icon} w-6`}></i>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div>إصدار {APP_CONFIG.version}</div>
          <div>© {new Date().getFullYear()} {APP_CONFIG.developer}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
