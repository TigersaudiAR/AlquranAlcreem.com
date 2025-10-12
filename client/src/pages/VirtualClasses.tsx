import { MainLayout } from '../components/layout/MainLayout';
import TopBar from '../components/common/TopBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Video, CalendarRange, MicVocal, Share2 } from 'lucide-react';

const classTypes = [
  {
    id: 'tajweed',
    title: 'فصل التجويد المباشر',
    description: 'بث تفاعلي مع المعلم، مؤشرات بصرية على مخارج الحروف، وتسجيل تلقائي للجلسة.'
  },
  {
    id: 'language',
    title: 'تعليم اللغة العربية للناطقين بغيرها',
    description: 'ألعاب لغوية، ترجمة فورية للنصوص، ومتابعة لنطق الطلاب عبر الذكاء الاصطناعي.'
  },
  {
    id: 'revision',
    title: 'جلسات مراجعة الحفظ',
    description: 'جلسات قصيرة يومية مع تقسيم الطلاب إلى مجموعات حسب مستوى الحفظ.'
  }
];

export default function VirtualClasses() {
  return (
    <MainLayout>
      <TopBar />
      <div className="pt-16 space-y-8">
        <header className="flex flex-col items-end text-right">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
            الفصول الافتراضية
          </Badge>
          <h1 className="text-3xl font-bold">قاعات بث مباشر للدروس والمحاضرات</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            شارك في دروس عالية الجودة مع أدوات تفاعلية، تسجيلات تلقائية، ومتابعة فورية للأداء مع المعلمين.
          </p>
        </header>

        <Tabs defaultValue="tajweed">
          <TabsList className="grid w-full grid-cols-3">
            {classTypes.map((classType) => (
              <TabsTrigger key={classType.id} value={classType.id} className="text-xs sm:text-sm">
                {classType.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {classTypes.map((classType) => (
            <TabsContent key={classType.id} value={classType.id} className="mt-4">
              <Card className="border border-primary/20 bg-primary/5">
                <CardHeader className="items-end text-right">
                  <CardTitle className="flex items-center justify-end gap-2 text-xl">
                    <Video className="h-6 w-6 text-primary" />
                    {classType.title}
                  </CardTitle>
                  <CardDescription>{classType.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
                  <div className="rounded-lg border bg-background/80 px-4 py-3">
                    <p>• لوحة تحكم للمعلم لعرض الحضور ونشاط الطلاب.</p>
                    <p>• تقسيم الغرف لمجموعات عمل مصغرة.</p>
                  </div>
                  <div className="rounded-lg border bg-background/80 px-4 py-3">
                    <p>• مشاركة الشاشة والسبورة البيضاء الذكية.</p>
                    <p>• تقييم سريع في نهاية الجلسة.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border border-dashed border-primary/40">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <CalendarRange className="h-6 w-6 text-primary" />
                جدولة متقدمة
              </CardTitle>
              <CardDescription>
                حدد تواريخ المحاضرات، أرسل الدعوات، واضبط الوصول التلقائي للطلاب حسب صلاحياتهم.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>• مزامنة مع التقويم الشخصي.</p>
              <p>• إشعارات للطلاب قبل بدء البث.</p>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 bg-primary/5">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <MicVocal className="h-6 w-6 text-primary" />
                تصحيح صوتي مباشر
              </CardTitle>
              <CardDescription>
                يحلل النظام أداء الطالب أثناء القراءة أو الحديث ويعرض ملاحظات فورية للمعلم.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>• تقارير تفصيلية بعد كل جلسة.</p>
              <p>• أرشفة التسجيلات للمراجعة.</p>
            </CardContent>
          </Card>

          <Card className="border border-border/60">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <Share2 className="h-6 w-6 text-primary" />
                مشاركة الموارد
              </CardTitle>
              <CardDescription>
                رفع ملفات PDF، عروض تقديمية، وتمارين تفاعلية لتكون متاحة مباشرة داخل الجلسة.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>• يسمح للطلاب بتحميل الملفات بعد انتهاء الدرس.</p>
              <p>• متابعة من قرأ أو حل الواجبات.</p>
            </CardContent>
          </Card>
        </section>

        <Card className="border border-dashed border-primary/40 bg-primary/5">
          <CardHeader className="flex flex-col items-end gap-2 text-right md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">إدارة الفصول الافتراضية</CardTitle>
              <CardDescription>
                لوحة تحكم للمدير والمعلمين لمراقبة الحضور، الرسوم، والأنشطة مع صلاحيات مختلفة لكل دور.
              </CardDescription>
            </div>
            <Button variant="outline" className="border-primary/40 text-primary">استعراض لوحة التحكم</Button>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <div className="rounded-lg border bg-background/80 px-4 py-3">
              <p>• تقارير أداء أسبوعية للطلاب.</p>
              <p>• أدوات تقييم إلكترونية مرتبطة بسجلات الحضور.</p>
            </div>
            <div className="rounded-lg border bg-background/80 px-4 py-3">
              <p>• صلاحيات للمدرسين والمشرفين لتعديل المحتوى.</p>
              <p>• تكامل مع نظام الإشعارات لتذكير الطلاب بالجداول.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
