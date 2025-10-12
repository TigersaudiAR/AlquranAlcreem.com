import { MainLayout } from '../components/layout/MainLayout';
import TopBar from '../components/common/TopBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookMarked, Video, AudioLines, Download, Sparkles } from 'lucide-react';

const materialCategories = [
  {
    id: 'curriculum',
    title: 'مناهج ودروس',
    description: 'خطط دراسية متكاملة للمدارس والحلقات مع أوراق عمل جاهزة.',
    resources: ['خطة أسبوعية للتلاوة', 'دروس لغوية للأطفال', 'أنشطة صفية للمرحلة المتوسطة'],
  },
  {
    id: 'media',
    title: 'محتوى مرئي وصوتي',
    description: 'مقاطع فيديو تعليمية، بودكاست، وتلاوات مع شرح مبسط.',
    resources: ['مرئيات التجويد التفاعلية', 'بودكاست قصص الأنبياء', 'تلاوات مع تحليل النطق'],
  },
  {
    id: 'assessments',
    title: 'اختبارات وتقويم',
    description: 'نماذج تقييم شهرية، استبانات متابعة، وتغذية راجعة آلية.',
    resources: ['نماذج تقييم أسبوعية', 'استبانة مستوى القراءة', 'تقرير الأداء الشهري'],
  },
];

export default function LearningMaterials() {
  return (
    <MainLayout>
      <TopBar />
      <div className="pt-16 space-y-8">
        <header className="flex flex-col items-end text-right">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
            المواد التعليمية
          </Badge>
          <h1 className="text-3xl font-bold">مكتبة شاملة للدروس والأنشطة</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            حمّل موارد تعليمية جاهزة، ملفات مرئية وصوتية، ونماذج تقييم مع إمكانية تخصيصها حسب مستوى الطلاب.
          </p>
        </header>

        <Tabs defaultValue="curriculum">
          <TabsList className="grid w-full grid-cols-3">
            {materialCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs sm:text-sm">
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {materialCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              <Card className="border border-primary/20 bg-primary/5">
                <CardHeader className="items-end text-right">
                  <CardTitle className="flex items-center justify-end gap-2 text-xl">
                    <BookMarked className="h-6 w-6 text-primary" />
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
                  {category.resources.map((resource) => (
                    <div key={resource} className="rounded-lg border bg-background/80 px-4 py-3">
                      {resource}
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
                <Video className="h-6 w-6 text-primary" />
                دروس مرئية
              </CardTitle>
              <CardDescription>
                محتوى عالي الجودة بصيغة MP4 مع خيارات ترجمة وتكبير للنصوص العربية.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>• تحميل مباشر أو بث من داخل التطبيق.</p>
              <p>• إضافة أسئلة تفاعلية أثناء المشاهدة.</p>
            </CardContent>
          </Card>

          <Card className="border border-dashed border-primary/40">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <AudioLines className="h-6 w-6 text-primary" />
                مكتبة صوتية
              </CardTitle>
              <CardDescription>
                قراءات متنوعة، أناشيد تربوية، ومقاطع موجهة لتعليم المخارج.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>• قوائم تشغيل حسب المستوى.</p>
              <p>• خيار التحميل مع ترخيص الاستخدام التعليمي.</p>
            </CardContent>
          </Card>

          <Card className="border border-border/60">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <Download className="h-6 w-6 text-primary" />
                مركز التحميل
              </CardTitle>
              <CardDescription>
                إدارة الملفات التي تم تنزيلها، مع تحديثات تلقائية عند صدور نسخ جديدة.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>• إشعار عند توفر تحديث للمواد.</p>
              <p>• تصنيف حسب الفئة العمرية والموضوع.</p>
            </CardContent>
          </Card>
        </section>

        <Card className="border border-dashed border-primary/40 bg-primary/5">
          <CardHeader className="items-end text-right">
            <CardTitle className="flex items-center justify-end gap-2 text-xl">
              <Sparkles className="h-6 w-6 text-primary" />
              توليد موارد بالذكاء الاصطناعي
            </CardTitle>
            <CardDescription>
              أنشئ درسًا مخصصًا في دقائق: اختر المستوى، عدد الأهداف، ويحضر النظام محتوى متوافقًا مع المعايير التعليمية.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>• اقتراح أنشطة داعمة تلقائيًا.</p>
            <p>• تصدير بصيغة PDF أو PowerPoint مباشرة.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
