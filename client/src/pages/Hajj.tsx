import { MainLayout } from '../components/layout/MainLayout';
import TopBar from '../components/common/TopBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  MapPinned,
  Compass,
  Kaaba,
  Headset,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

const rituals = [
  {
    id: 'hajj',
    title: 'الحج خطوة بخطوة',
    description: 'دليل شامل من الإحرام حتى طواف الوداع مع مؤقت للأعمال ومذكرات صوتية.',
    highlights: ['تنبيهات توقيتية لكل نسك', 'خرائط تفاعلية للمشاعر المقدسة', 'مرشد صوتي بعدة لغات'],
  },
  {
    id: 'umrah',
    title: 'العمرة التفصيلية',
    description: 'شرح عملي لنسك العمرة مع صور توضيحية ونصائح للزحام.',
    highlights: ['مخطط زمني للعمرة', 'أدعية مكتوبة ومسموعة', 'إرشادات للصحة والسلامة'],
  },
  {
    id: 'ziyara',
    title: 'الزيارة والمسجد النبوي',
    description: 'إرشادات لزيارة المسجد النبوي، الروضة الشريفة، والمعالم التاريخية.',
    highlights: ['أوقات الزيارة المفضلة', 'آداب الزيارة', 'خريطة الأماكن المهمة'],
  },
];

export default function Hajj() {
  return (
    <MainLayout>
      <TopBar />
      <div className="pt-16 space-y-8">
        <header className="flex flex-col items-end text-right">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
            الحج والعمرة
          </Badge>
          <h1 className="text-3xl font-bold">دليل ذكي للمناسك مع دعم صوتي وبصري</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            اتبع المناسك خطوة بخطوة مع إشعارات تلقائية، خرائط تفاعلية، وأدعية مسموعة بلغات متعددة.
          </p>
        </header>

        <Tabs defaultValue="hajj">
          <TabsList className="grid w-full grid-cols-3">
            {rituals.map((ritual) => (
              <TabsTrigger key={ritual.id} value={ritual.id} className="text-xs sm:text-sm">
                {ritual.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {rituals.map((ritual) => (
            <TabsContent key={ritual.id} value={ritual.id} className="mt-4">
              <Card className="border border-primary/20 bg-primary/5">
                <CardHeader className="items-end text-right">
                  <CardTitle className="flex items-center justify-end gap-2 text-xl">
                    <Kaaba className="h-6 w-6 text-primary" />
                    {ritual.title}
                  </CardTitle>
                  <CardDescription>{ritual.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
                  {ritual.highlights.map((highlight) => (
                    <div key={highlight} className="rounded-lg border bg-background/80 px-4 py-3">
                      {highlight}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border border-primary/20 bg-primary/5">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <MapPinned className="h-6 w-6 text-primary" />
                خرائط ذكية
              </CardTitle>
              <CardDescription>
                مسارات واضحة للمشاعر المقدسة مع مؤشر للتزاحم وخيارات مساعدة مباشرة.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>• عرض ثلاثي الأبعاد للحرم والمشاعر.</p>
              <p>• وضع عدم الاتصال لتصفح الخرائط بدون إنترنت.</p>
            </CardContent>
          </Card>

          <Card className="border border-dashed border-primary/40">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <Headset className="h-6 w-6 text-primary" />
                مرشد صوتي
              </CardTitle>
              <CardDescription>
                استمع إلى الأذكار والأدعية المخصصة لكل نسك بصوت واضح وبدون الحاجة للمس الجهاز.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>• دعم للغات متعددة.</p>
              <p>• تحديد تلقائي للنسك الحالي عبر الموقع.</p>
            </CardContent>
          </Card>

          <Card className="border border-border/60">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <Compass className="h-6 w-6 text-primary" />
                مسار زمني
              </CardTitle>
              <CardDescription>
                خط زمني يوضح متى تبدأ وتنتهي كل خطوة مع تذكيرات أثناء الليل والنهار.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>• إشعارات عند دخول أوقات الصلاة في المشاعر.</p>
              <p>• تحديث أوتوماتيكي حسب وقت غروب الشمس وشروقها.</p>
            </CardContent>
          </Card>
        </section>

        <Card className="border border-dashed border-primary/40 bg-primary/5">
          <CardHeader className="items-end text-right">
            <CardTitle className="flex items-center justify-end gap-2 text-xl">
              <Sparkles className="h-6 w-6 text-primary" />
              إرشادات يومية
            </CardTitle>
            <CardDescription>
              تلقي نصائح صحية وروحية مخصصة لرحلتك، مع تتبع لحالة الطقس وتذكير بشرب الماء والراحة.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              • رسائل صباحية ومسائية
              <span className="mx-1 inline-flex items-center gap-1">
                <Sun className="h-4 w-4" /> صباحًا
              </span>
              ،
              <span className="ml-1 inline-flex items-center gap-1">
                <Moon className="h-4 w-4" /> مساءً
              </span>
              .
            </p>
            <p>• إرشادات للطوارئ وخطوط تواصل رسمية.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
