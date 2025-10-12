import { MainLayout } from '../components/layout/MainLayout';
import TopBar from '../components/common/TopBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import {
  BookOpen,
  ShieldCheck,
  Search,
  AudioLines,
  BookmarkPlus,
  ScrollText,
  Info,
} from 'lucide-react';

const categories = [
  {
    id: 'faith',
    title: 'كتاب الإيمان',
    description: 'أحاديث مختارة من صحيح البخاري ومسلم معتمد من مجمع الملك فهد.',
    notes: ['شرح مبسط', 'تخريج موثوق', 'تلاوة صوتية'],
  },
  {
    id: 'manners',
    title: 'كتاب الأدب',
    description: 'أحاديث عن الأخلاق الإسلامية مع تطبيقات عملية للأسرة والمجتمع.',
    notes: ['مترجم للغات متعددة', 'بطاقات تعليمية للأطفال', 'نقاشات تفاعلية'],
  },
  {
    id: 'prayer',
    title: 'كتاب الصلاة',
    description: 'مرجع تفصيلي لسنن الصلاة وآدابها مع مراجع من السنن الكبرى.',
    notes: ['تصحيح الأخطاء الشائعة', 'روابط فتاوى رسمية', 'إرشادات مرئية'],
  },
];

const references = [
  'صحيح البخاري – نسخة مجمع الملك فهد لطباعة المصحف الشريف.',
  'صحيح مسلم – إصدار موثوق معتمد من وزارة الشؤون الإسلامية والدعوة والإرشاد.',
  'سنن النسائي – مراجعة حديثة من المجمع مع إمكانية الاستماع والتحميل.',
];

export default function Hadith() {
  return (
    <MainLayout>
      <TopBar />
      <div className="pt-16 space-y-8">
        <header className="flex flex-col items-end text-right">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
            مصادر موثوقة
          </Badge>
          <h1 className="text-3xl font-bold">الأحاديث النبوية من المصادر المعتمدة</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            جميع الأحاديث المعروضة مأخوذة من منصات رسمية سعودية (مجمع الملك فهد، وزارة الشؤون الإسلامية)، مع تخريج وتوثيق كامل وسند واضح.
          </p>
        </header>

        <Tabs defaultValue="faith">
          <TabsList className="grid w-full grid-cols-3">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs sm:text-sm">
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              <Card className="border border-primary/20 bg-primary/5">
                <CardHeader className="items-end text-right">
                  <CardTitle className="flex items-center justify-end gap-2 text-xl">
                    <BookOpen className="h-6 w-6 text-primary" />
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                  {category.notes.map((note) => (
                    <div key={note} className="rounded-lg border bg-background/80 px-4 py-3 text-right">
                      <ShieldCheck className="ml-2 inline-block h-4 w-4 text-primary" />
                      {note}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="border border-dashed border-primary/40">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <Search className="h-6 w-6 text-primary" />
                بحث متقدم
              </CardTitle>
              <CardDescription>
                ابحث عن الحديث بواسطة الكلمات المفتاحية، الموضوع، أو الراوي مع نتائج موثقة من المصادر الرسمية.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• ترميز ألوان يوضح درجة الحديث.</p>
              <p>• روابط مباشرة إلى النسخة الموثقة بصيغة PDF.</p>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 bg-primary/5">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <AudioLines className="h-6 w-6 text-primary" />
                استماع وترديد
              </CardTitle>
              <CardDescription>
                استمع إلى التلاوة الصوتية للحديث بصوت قرّاء معتمدين، مع إمكانية ترديد وتسجيل صوتك للمراجعة.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• تحليل نبرة الصوت لمطابقة أسلوب القراءة الحديثي.</p>
              <p>• مشاركة التسجيل مع المعلم للحصول على التغذية الراجعة.</p>
            </CardContent>
          </Card>
        </section>

        <Card className="border border-border/60">
          <CardHeader className="items-end text-right">
            <CardTitle className="flex items-center justify-end gap-2 text-xl">
              <BookmarkPlus className="h-6 w-6 text-primary" />
              قائمة المراجع الرسمية
            </CardTitle>
            <CardDescription>
              يتم تحديث هذه القائمة تلقائياً عند صدور طبعات جديدة من الجهات الحكومية المعتمدة.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-relaxed text-muted-foreground">
            {references.map((reference) => (
              <div key={reference} className="flex items-center justify-end gap-2">
                <ScrollText className="h-4 w-4 text-primary" />
                <span>{reference}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-dashed border-primary/40 bg-primary/5">
          <CardHeader className="items-end text-right">
            <CardTitle className="flex items-center justify-end gap-2 text-xl">
              <Info className="h-5 w-5 text-primary" />
              توثيق واعتماد رسمي
            </CardTitle>
            <CardDescription>
              جميع الأحاديث مرتبطة مباشرة بقاعدة بيانات مجمع الملك فهد ومنصات وزارة الشؤون الإسلامية في المملكة العربية السعودية.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>يتم التأكد من صحة التخريج بشكل دوري، مع توفير إشعارات عند تحديث أي حكم حديثي أو إضافة شروح جديدة.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
