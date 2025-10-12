import { Link } from 'wouter';
import { MainLayout } from '../components/layout/MainLayout';
import TopBar from '../components/common/TopBar';
import PrayerTimesBar from '../components/common/PrayerTimesBar';
import Footer from '../components/layout/Footer';
import {
  BookOpen,
  BookMarked,
  Landmark,
  PenLine,
  BookText,
  MapPin,
  MessageCircleHeart,
  Users,
  MessageSquare,
  Sparkles,
  GraduationCap,
  MicVocal,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const gridItems = [
  {
    name: 'القرآن الكريم',
    description: 'تجربة مصحف كاملة بملء الشاشة مع إمكانات التقليب ولمسات تفاعلية على الآيات.',
    path: '/quran',
    icon: BookOpen,
    color: 'bg-emerald-500/15 text-emerald-600',
  },
  {
    name: 'حلقات التحفيظ',
    description: 'مسارات منظمة للحفظ الفردي والجماعي مع لوحة شرف لأفضل ١٠٠ طالب.',
    path: '/memorization',
    icon: BookMarked,
    color: 'bg-pink-500/15 text-pink-600',
  },
  {
    name: 'الفصول الافتراضية',
    description: 'قاعات بث مباشر للمحاضرات والدروس مع تسجيلات وواجبات تفاعلية.',
    path: '/virtual-classes',
    icon: Landmark,
    color: 'bg-blue-500/15 text-blue-600',
  },
  {
    name: 'تعليم ذاتي',
    description: 'محتوى ذكي لتعليم العربية، التجويد، والحفظ بمستويات وأوسمة.',
    path: '/self-learning',
    icon: PenLine,
    color: 'bg-orange-500/15 text-orange-600',
  },
  {
    name: 'المواد التعليمية',
    description: 'مكتبة دروس، أوراق عمل، وعروض تفاعلية لجميع المستويات.',
    path: '/learning-materials',
    icon: BookText,
    color: 'bg-purple-500/15 text-purple-600',
  },
  {
    name: 'الحج والعمرة',
    description: 'دليل ذكي للمناسك خطوة بخطوة مع إرشادات صوتية وبصرية.',
    path: '/hajj',
    icon: MapPin,
    color: 'bg-amber-500/15 text-amber-600',
  },
  {
    name: 'الأذكار والأدعية',
    description: 'مسبحة ذكية تتفاعل مع الصوت أو اللمس مع اقتراحات للذكر المناسب.',
    path: '/duas',
    icon: MessageCircleHeart,
    color: 'bg-sky-500/15 text-sky-600',
  },
  {
    name: 'تواصل مع أهل العلم',
    description: 'محادثة فورية مع العلماء مع أرشيف للأسئلة الشائعة وخيارات المتابعة.',
    path: '/scholars',
    icon: MessageSquare,
    color: 'bg-indigo-500/15 text-indigo-600',
  },
  {
    name: 'الأحاديث النبوية',
    description: 'مصادر موثوقة من مجمع الملك فهد مع تصنيف موضوعي ومرجعية دقيقة.',
    path: '/hadith',
    icon: ShieldCheck,
    color: 'bg-teal-500/15 text-teal-600',
  },
  {
    name: 'الدعوة والإرشاد',
    description: 'مركز تفاعلي للتعريف بالإسلام والإجابة عن الأسئلة بلغات متعددة.',
    path: '/dawah',
    icon: Users,
    color: 'bg-rose-500/15 text-rose-600',
  },
  {
    name: 'لوحة التحكم',
    description: 'صلاحيات متقدمة للمديرين والمعلمين لإدارة المحتوى والطلاب.',
    path: '/admin',
    icon: Sparkles,
    color: 'bg-slate-500/15 text-slate-600',
  },
];

const aiHighlights = [
  {
    title: 'نظام تتبع التقدم',
    description: 'يسجل الآيات المقروءة، الوقت المستغرق، ويصدر توصيات تشجيعية يومية.',
    icon: Star,
  },
  {
    title: 'مدرب صوتي ذكي',
    description: 'يحلل التلاوة بدقة، يقترح مواضع للتحسين، ويحسب الأخطاء تلقائيًا.',
    icon: MicVocal,
  },
  {
    title: 'مسارات تعليمية مخصصة',
    description: 'تصميم دروس حسب العمر واللغة مع أوسمة وإنجازات تحفّز الاستمرارية.',
    icon: GraduationCap,
  },
];

export default function Home() {
  const { lastRead } = useApp();

  return (
    <MainLayout>
      <TopBar />
      <div className="pt-16 space-y-8">
        <section className="rounded-3xl bg-primary/10 p-6 text-right">
          <p className="text-sm text-primary/80">مرحبا بك في منصة تعليم القرآن التفاعلية</p>
          <h1 className="mt-2 text-3xl font-bold leading-loose">استكشف المصحف، الحفظ، والدروس الذكية من مكان واحد</h1>
          <p className="mt-2 text-muted-foreground">
            واجهة عربية كاملة، تعمل على الجوال والحاسوب، مع تجربة قراءة غامرة على غرار التطبيقات المتخصصة.
          </p>
          <div className="mt-4 flex flex-wrap justify-end gap-3 text-sm text-primary">
            <span className="rounded-full bg-primary/20 px-3 py-1">ذكاء اصطناعي تعليمي</span>
            <span className="rounded-full bg-primary/20 px-3 py-1">لوحة تحكم للمدرسين</span>
            <span className="rounded-full bg-primary/20 px-3 py-1">محتوى عربي بالكامل</span>
          </div>
        </section>

        <PrayerTimesBar />

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">آخر قراءة</h2>
            <Link href="/quran" className="text-sm text-primary hover:underline">فتح المصحف</Link>
          </div>
          {lastRead ? (
            <Card className="mt-3 border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{`سورة ${lastRead.surahNumber}`}</CardTitle>
                <CardDescription>الآية {lastRead.ayahNumber} - صفحة {lastRead.pageNumber}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between text-sm">
                <Link to={`/quran/${lastRead.pageNumber}`} className="text-primary">متابعة القراءة</Link>
                <span className="text-muted-foreground">استمر بالتلاوة لتحصل على توصيات جديدة</span>
              </CardFooter>
            </Card>
          ) : (
            <Card className="mt-3 border-dashed border-primary/30">
              <CardContent className="py-6 text-center text-sm text-muted-foreground">
                لم يتم تسجيل قراءة بعد. ابدأ من سورة الفاتحة لتفعيل نظام التتبع الذكي وتشجيعك اليومي.
              </CardContent>
            </Card>
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">الأقسام التفاعلية</h2>
            <p className="text-sm text-muted-foreground">اختر القسم الذي ترغب باستكشافه، كل قسم مصمم بعناية ليلبي احتياجات المستخدمين المتنوعة.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gridItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Card className="h-full border border-border/60 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <CardHeader className="space-y-2 text-right">
                    <div className={cn('ml-auto flex h-12 w-12 items-center justify-center rounded-full', item.color)}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
                    <CardDescription className="leading-relaxed text-muted-foreground">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {aiHighlights.map((highlight) => (
            <Card key={highlight.title} className="border border-primary/20 bg-primary/5">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className={cn('rounded-full bg-primary/20 p-2 text-primary')}>
                  <highlight.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{highlight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}

          <Card className="border border-dashed border-primary/40">
            <CardHeader>
              <CardTitle className="text-lg">تذكيرات وتشجيع مستمر</CardTitle>
              <CardDescription>
                فعّل الإشعارات الذكية لتذكيرك بالمواعيد، حلقات التحفيظ، وأذكار الصباح والمساء بما يتناسب مع موقعك الزمني.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• تنبيهات مبكرة قبل وقت الحلقة بربع ساعة.</p>
              <p>• اقتراحات ورد يومي بناءً على أدائك في اليوم السابق.</p>
              <p>• إشعارات محفزة بعد كل صلاة لتذكيرك بالذكر المخصص.</p>
            </CardContent>
          </Card>
        </section>
      </div>
      <Footer />
    </MainLayout>
  );
}
