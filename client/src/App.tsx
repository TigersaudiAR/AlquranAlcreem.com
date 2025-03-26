import { Switch, Route } from "wouter";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Quran from "./pages/Quran";
import Prayer from "./pages/Prayer";
import Memorization from "./pages/Memorization";
import Tafsir from "./pages/Tafsir";
import Hadith from "./pages/Hadith";
import Duas from "./pages/Duas";
import Hajj from "./pages/Hajj";
import Settings from "./pages/Settings";
import NotFound from "./pages/not-found";

function App() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/quran" component={Quran} />
        <Route path="/prayer" component={Prayer} />
        <Route path="/memorization" component={Memorization} />
        <Route path="/tafsir" component={Tafsir} />
        <Route path="/hadith" component={Hadith} />
        <Route path="/duas" component={Duas} />
        <Route path="/hajj" component={Hajj} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

export default App;
