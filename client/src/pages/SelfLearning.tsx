import { useMemo } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import TopBar from '../components/common/TopBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Languages, Sparkles, Trophy, Star, Brain, Crown } from 'lucide-react';

const levels = [
  {
    id: 'starter',
    title: 'مستوى المبتدئين',
    description: 'تعلم الحروف الهجائية، الحركات، والمفردات اليومية بطريقة مرئية ممتعة.',
    duration: '٣ أسابيع',
    badges: ['تمارين تفاعلية', 'تحفيز صوتي', 'مقاطع فيديو قصيرة'],
  },
  {
    id: 'tajweed',
    title: 'تأسيس التجويد',
    description: 'قواعد النون الساكنة، المدود، وأمثلة بالصوت مع تصحيح ذاتي للتلاوة.',
    duration: '٤ أسابيع',
    badges: ['مصحف ملون', 'محاكاة صوتية', 'اختبارات أسبوعية'],
  },
  {
    id: 'memorization',
    title: 'مسار الحفظ الذكي',
    description: 'تدريب يومي، تذكير بالورد، وتحليل صوتي للأخطاء مع اقتراحات للحفظ.',
    duration: '٨ أسابيع',
    badges: ['خطة مراجعة', 'تحديات جماعية', 'لوحة شرف'],
  },
];

const arabicTracks = [
  {
    language: 'للناطقين بالعربية',
    details: 'أنشطة لتقوية النحو، البلاغة، والفهم القرائي للطلاب العرب.',
    progress: 65,
  },
  {
    language: 'للناطقين بالإنجليزية',
    details: 'مقاطع صوتية مترجمة، تمارين نطق، وإملاء تدريجي.',
    progress: 40,
  },
  {
    language: 'للناطقين بالفرنسية',
    details: 'دروس مصورة مع واجبات قصيرة لتعلم المفردات والتراكيب.',
    progress: 25,
  },
];

const dailyBoosters = [
  'تذكير صوتي بموعد الحصة اليومية وفق التوقيت المحلي.',
  'اقتراح درس مكمل بناءً على نتيجة الاختبار السابق.',
  'إرسال ملخص بالأخطاء الشائعة مع مقاطع صوتية للتصحيح.',
  'منح أوسمة يومية للتشجيع على الاستمرار (وسام المثابر، القارئ المتقن).',
];

export default function SelfLearning() {
  const totalBadges = useMemo(() => levels.reduce((count, level) => count + level.badges.length, 0), []);

  return (
    <MainLayout>
      <TopBar />
      <div className="pt-16 space-y-8">
        <header className="flex flex-col items-end text-right">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
            تعليم ذاتي ذكي
          </Badge>
          <h1 className="text-3xl font-bold">مسارات متكاملة لتعليم العربية والتجويد</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            صُمِّمت هذه الوحدة لتناسب مختلف الأعمار واللغات. يتلقى كل طالب خطة تعلم مرنة، تدريبات صوتية، وأوسمة تشجيعية عند اجتياز كل مرحلة.
          </p>
        </header>

        <Tabs defaultValue="starter" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {levels.map((level) => (
              <TabsTrigger key={level.id} value={level.id} className="text-xs sm:text-sm">
                {level.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {levels.map((level) => (
            <TabsContent key={level.id} value={level.id} className="mt-4">
              <Card className="border border-primary/20 bg-primary/5">
                <CardHeader className="flex flex-col items-end text-right">
                  <CardTitle className="text-2xl font-semibold">{level.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {level.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-primary">
                    <Badge variant="outline" className="border-primary/30">
                      مدة البرنامج: {level.duration}
                    </Badge>
                    <Badge variant="outline" className="border-primary/30">
                      عدد الأوسمة في هذا المسار: {level.badges.length}
                    </Badge>
                  </div>
                  <ul className="grid gap-2 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
                    {level.badges.map((badge) => (
                      <li key={badge} className="flex items-center justify-end gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        <span>{badge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <section className="grid gap-4 md:grid-cols-3">
          {arabicTracks.map((track) => (
            <Card key={track.language} className="border border-border/60">
              <CardHeader className="items-end text-right">
                <CardTitle className="flex items-center justify-end gap-2 text-lg">
                  <Languages className="h-5 w-5 text-primary" />
                  {track.language}
                </CardTitle>
                <CardDescription>{track.details}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-right">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>مستوى التقدم</span>
                  <span>{track.progress}%</span>
                </div>
                <Progress value={track.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  يتم تحديث الدروس تلقائياً حسب نتيجة التقييم الأسبوعي.
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="border border-dashed border-primary/30">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <Brain className="h-6 w-6 text-primary" />
                مدرب التجويد الذكي
              </CardTitle>
              <CardDescription>
                يتابع أخطاء النطق، يحدد مواضع المدود، ويعطي ملاحظات صوتية وشروحات مرئية لكل خطأ.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>• تحليل فوري عند تسجيل التلاوة بالجوال أو الميكروفون.</p>
              <p>• مقارنة الأداء مع القرّاء المتقنين لإظهار الفروق في المخارج.</p>
              <p>• توصية آيات للحفظ مرتبطة بالدرس الحالي مع جدول مراجعة يومي.</p>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 bg-primary/5">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <Crown className="h-6 w-6 text-primary" />
                الأوسمة والتحفيز
              </CardTitle>
              <CardDescription>
                كل مرحلة تمنح الطالب وساماً مميزاً يظهر في ملفه الشخصي ولوحة الشرف العامة.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>• وسام القارئ الصاعد بعد إتمام ٧٥٪ من دروس الحروف.</p>
              <p>• وسام المتقن عند اجتياز تقييم التجويد بدون أخطاء.</p>
              <p>• وسام الذاكر اليومي للمحافظة على سلسلة الحضور خلال الأسبوع.</p>
              <p>إجمالي الأوسمة المتاحة في المنصة حالياً: {totalBadges + 6}</p>
            </CardContent>
          </Card>
        </section>

        <Card className="border border-border/60">
          <CardHeader className="items-end text-right">
            <CardTitle className="flex items-center justify-end gap-2 text-xl">
              <Sparkles className="h-6 w-6 text-primary" />
              التعلم اليومي الذكي
            </CardTitle>
            <CardDescription>
              خوارزميات المنصة تضمن رحلة تعليمية متوازنة تجمع بين القراءة، الاستماع، والأنشطة التفاعلية.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm leading-relaxed text-muted-foreground">
            {dailyBoosters.map((item) => (
              <div key={item} className="flex items-center justify-end gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
