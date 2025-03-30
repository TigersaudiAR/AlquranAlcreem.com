import { Route, Switch } from 'wouter';
import Quran from './pages/Quran';
import NotFound from './pages/not-found';
import { ThemeProvider } from './components/theme-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from './components/ui/toaster';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="quran-app-theme">
        <AppProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Switch>
              <Route path="/" component={Quran} />
              
              {/* مسارات السورة والصفحة */}
              <Route path="/surah/:surahNumber" component={Quran} />
              <Route path="/page/:pageNumber" component={Quran} />
              <Route path="/juz/:juzNumber" component={Quran} />
              
              {/* مسارات أخرى في المستقبل */}
              {/* <Route path="/prayer" component={Prayer} /> */}
              {/* <Route path="/hadith" component={Hadith} /> */}
              {/* <Route path="/tafsir" component={Tafsir} /> */}
              {/* <Route path="/search" component={Search} /> */}
              {/* <Route path="/settings" component={Settings} /> */}
              
              {/* صفحة غير موجودة */}
              <Route component={NotFound} />
            </Switch>
            
            <Toaster />
          </div>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;