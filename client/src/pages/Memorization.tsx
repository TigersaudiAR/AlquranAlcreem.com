import { MainLayout } from '../components/layout/MainLayout';
import TopBar from '../components/common/TopBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import {
  Users,
  Sparkles,
  Crown,
  Flame,
  CalendarClock,
} from 'lucide-react';

const circleTypes = [
  {
    id: 'kids',
    name: 'حلقة الناشئة',
    description: 'إشراف مباشر من المعلم، تلاوة يومية قصيرة، وتقييم أسبوعي مبسط.',
    language: 'العربية',
    capacity: '١٥ طالب',
  },
  {
    id: 'global',
    name: 'حلقة عالمية باللغات المتعددة',
    description: 'مترجم فوري، بث مباشر مع تفاعلات صوتية، ومتابعة فردية لكل طالب.',
    language: 'العربية، الإنجليزية، الأردية',
    capacity: '٢٥ طالب',
  },
  {
    id: 'tajweed',
    name: 'حلقة التجويد المتقدم',
    description: 'تدريب مكثف على مخارج الحروف والمدود مع تغذية راجعة لحظية.',
    language: 'العربية',
    capacity: '١٢ طالب',
  },
];

const topStudents = [
  { rank: 1, name: 'سارة العبدالله', juz: 18, points: 9840 },
  { rank: 2, name: 'محمد اليامي', juz: 17, points: 9630 },
  { rank: 3, name: 'ليلى التركي', juz: 16, points: 9500 },
  { rank: 4, name: 'أحمد الشهري', juz: 15, points: 9460 },
  { rank: 5, name: 'نور الشمري', juz: 14, points: 9325 },
  { rank: 6, name: 'علي الزهراني', juz: 14, points: 9200 },
  { rank: 7, name: 'مها البليهي', juz: 13, points: 9150 },
  { rank: 8, name: 'خالد الحربي', juz: 12, points: 9030 },
  { rank: 9, name: 'نجود السبيعي', juz: 12, points: 8990 },
  { rank: 10, name: 'ندى السويلم', juz: 11, points: 8875 },
];

export default function Memorization() {
  return (
    <MainLayout>
      <TopBar />
      <div className="pt-16 space-y-8">
        <header className="flex flex-col items-end text-right">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
            حلقات تحفيظ حديثة
          </Badge>
          <h1 className="text-3xl font-bold">رحلة الحفظ بإشراف مباشر ولوحة شرف تفاعلية</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            اختر الحلقة المناسبة لعُمرك ولغتك، تابع تقدمك مع لوحة ترتيب لأفضل ١٠٠ قارئ، واستلم تقارير مخصصة من المعلمين والمشرفين.
          </p>
        </header>

        <Tabs defaultValue="kids" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {circleTypes.map((circle) => (
              <TabsTrigger key={circle.id} value={circle.id} className="text-xs sm:text-sm">
                {circle.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {circleTypes.map((circle) => (
            <TabsContent key={circle.id} value={circle.id} className="mt-4">
              <Card className="border border-primary/20 bg-primary/5">
                <CardHeader className="items-end text-right">
                  <CardTitle className="flex items-center justify-end gap-2 text-xl">
                    <Users className="h-6 w-6 text-primary" />
                    {circle.name}
                  </CardTitle>
                  <CardDescription>{circle.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
                    <span>اللغة</span>
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      {circle.language}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
                    <span>الطاقة الاستيعابية</span>
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      {circle.capacity}
                    </Badge>
                  </div>
                  <div className="rounded-lg border bg-background/80 px-4 py-3">
                    <p>• خطة مراجعة أسبوعية مع اختبار شفهي مسجل.</p>
                    <p>• مشاركة التقييم مع ولي الأمر عبر البريد أو التطبيق.</p>
                  </div>
                  <div className="rounded-lg border bg-background/80 px-4 py-3">
                    <p>• بث مباشر مع إمكانية رفع اليد وطلب المراجعة.</p>
                    <p>• حفظ متدرج مع إشعارات لاستكمال الحلقة اليومية.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="border border-primary/30 bg-primary/5">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <Flame className="h-6 w-6 text-primary" />
                تحديات أسبوعية
              </CardTitle>
              <CardDescription>
                انضم لتحدي "حفظ خمسة أوجه" مع متابعة جماعية وترتيب لحظي للمشاركين.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>• بث مباشر للإعلان عن الفائزين في نهاية الأسبوع.</p>
              <p>• نقاط إضافية عند مشاركة تسجيل صوتي خالٍ من الأخطاء.</p>
            </CardContent>
          </Card>

          <Card className="border border-dashed border-primary/40">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <CalendarClock className="h-6 w-6 text-primary" />
                جدولة مرنة
              </CardTitle>
              <CardDescription>
                اختر الأيام والساعات المناسبة لك، مع إمكانية التعويض عن الجلسة الغائبة عبر تسجيل مرئي.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>• تذكير قبل موعد الحلقة بربع ساعة.</p>
              <p>• إشعار للمعلم عند تأخر الطالب ثلاث مرات متتالية.</p>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 bg-primary/5">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <Sparkles className="h-6 w-6 text-primary" />
                لوحة الشرف
              </CardTitle>
              <CardDescription>
                أبرز ١٠٠ مشارك يظهرون في لوحة متحركة بأسلوب الكأس مع زر لعرض المزيد من التفاصيل.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>يتم تحديث القائمة في الوقت الحقيقي بناءً على النقاط المكتسبة من الحفظ والمراجعة.</p>
            </CardContent>
          </Card>
        </section>

        <Card className="border border-border/60">
          <CardHeader className="flex flex-col items-end gap-3 text-right md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">أفضل ١٠ مشاركين هذا الأسبوع</CardTitle>
              <CardDescription>لعرض قائمة أفضل ١٠٠ مشارك اضغط زر "المزيد" داخل لوحة الشرف.</CardDescription>
            </div>
            <Button variant="outline" className="border-primary/40 text-primary">عرض المزيد</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="text-right">
                  <TableHead className="text-right">الترتيب</TableHead>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">عدد الأجزاء</TableHead>
                  <TableHead className="text-right">النقاط</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topStudents.map((student) => (
                  <TableRow key={student.rank} className="text-right">
                    <TableCell className="font-semibold">
                      {student.rank <= 3 ? (
                        <Badge variant="secondary" className="bg-primary/15 text-primary">
                          <Crown className="ml-1 h-4 w-4" />
                          {student.rank}
                        </Badge>
                      ) : (
                        student.rank
                      )}
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.juz}</TableCell>
                    <TableCell>{student.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
