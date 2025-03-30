import { ReactNode, useContext } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import Footer from './Footer';
import { ThemeContext } from '../../context/ThemeContext';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const context = useContext(ThemeContext);
  const theme = context?.theme || 'light';
  
  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar />
      <MobileHeader />
      
      <main className="flex-1 overflow-y-auto pt-0 md:pt-0 mt-14 md:mt-0 pb-16 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {children}
        <Footer />
      </main>
    </div>
  );
};

export default MainLayout;
