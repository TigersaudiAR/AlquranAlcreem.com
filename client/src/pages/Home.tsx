import { Link } from 'wouter';
import { MainLayout } from '../components/layout/MainLayout';
import TopBar from '../components/common/TopBar';
import PrayerTimesBar from '../components/common/PrayerTimesBar';
import Footer from '../components/layout/Footer';
import { 
  BookOpen,
  MessageSquare,
  Compass, 
  BookMarked, 
  PenLine, 
  BookText,
  ListChecks,
  Landmark
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

export default function Home() {
  const { lastRead } = useApp();

  const items = [
    { name: 'القرآن الكريم', path: '/quran', icon: BookOpen, color: 'bg-green-500/20 text-green-600' },
    { name: 'حلقات التحفيظ', path: '/memorization', icon: BookMarked, color: 'bg-pink-500/20 text-pink-600' },
    { name: 'الفصول الافتراضية', path: '/classes', icon: Landmark, color: 'bg-blue-500/20 text-blue-600' },
    { name: 'تعلم القراءة', path: '/learn', icon: PenLine, color: 'bg-orange-500/20 text-orange-600' },
    { name: 'المواد التعليمية', path: '/materials', icon: BookText, color: 'bg-purple-500/20 text-purple-600' },
    { name: 'الحج والعمرة', path: '/hajj', icon: Compass, color: 'bg-amber-500/20 text-amber-600' },
    { name: 'الأذكار والأدعية', path: '/duas', icon: MessageSquare, color: 'bg-sky-500/20 text-sky-600' },
    { name: 'تواصل مع العلماء', path: '/contact', icon: ListChecks, color: 'bg-indigo-500/20 text-indigo-600' }
  ];

  return (
    <MainLayout>
      <TopBar />
      <PrayerTimesBar />
      <div className="space-y-6 mt-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-2">تطبيق القرآن الكريم</h1>
        </div>

        {lastRead ? (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">آخر قراءة</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{lastRead.surahNumber}. سورة الفاتحة</div>
                  <div className="text-sm text-muted-foreground">الآية {lastRead.ayahNumber}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  صفحة {lastRead.pageNumber}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link
                to={`/quran/${lastRead.pageNumber}`}
                className="text-primary font-medium text-sm"
              >
                متابعة القراءة
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <div className="border rounded p-4 text-center text-sm text-muted-foreground">
            لم تقم بالقراءة بعد، ابدأ من سورة الفاتحة
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-medium">الأقسام التعليمية</h2>
          <div className="grid grid-cols-2 gap-4">
            {items.map((item) => (
              <Link key={item.path} to={item.path}>
                <div className="border rounded-lg p-4 h-full hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col h-full items-center text-center">
                    <div className={cn(
                      "p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3",
                      item.color
                    )}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="font-medium">{item.name}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </MainLayout>
  );
}