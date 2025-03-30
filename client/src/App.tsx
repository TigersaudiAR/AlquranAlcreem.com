import { Route, Switch } from 'wouter';
import Quran from './pages/Quran';
import NotFound from './pages/not-found';
import { ThemeProvider } from './components/theme-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="quran-app-theme">
        <div className="min-h-screen">
          <Switch>
            <Route path="/" component={Quran} />
            {/* يمكن إضافة المزيد من المسارات هنا */}
            {/* <Route path="/prayer" component={Prayer} /> */}
            {/* <Route path="/hadith" component={Hadith} /> */}
            {/* <Route path="/tafsir" component={Tafsir} /> */}
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;