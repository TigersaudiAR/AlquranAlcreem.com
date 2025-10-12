import { MainLayout } from '../components/layout/MainLayout';
import TopBar from '../components/common/TopBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { LayoutDashboard, ShieldCheck, Users, BookOpen, MessageSquare, Settings, CalendarCheck } from 'lucide-react';

const roles = [
  { role: 'مدير المنصة', permissions: 'إدارة المستخدمين، ضبط الصلاحيات، الإشراف العام.' },
  { role: 'المعلم', permissions: 'إنشاء الدروس، تقييم الطلاب، متابعة الحلقات.' },
  { role: 'المشرف', permissions: 'متابعة الأداء، رفع التقارير، التواصل مع أولياء الأمور.' },
];

const analytics = [
  { metric: 'عدد الطلاب النشطين', value: '١٬٢٥٠ طالب', trend: '+12% هذا الشهر' },
  { metric: 'جلسات الحفظ المكتملة', value: '٣٬٤٥٠ جلسة', trend: '+8% مقارنة بالأسبوع الماضي' },
  { metric: 'التلاوات المراجَعة صوتيًا', value: '٩٨٠ تسجيلًا', trend: '+22% بعد تفعيل المدرب الصوتي' },
];

export default function AdminDashboard() {
  return (
    <MainLayout>
      <TopBar />
      <div className="pt-16 space-y-8">
        <header className="flex flex-col items-end text-right">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
            لوحة التحكم الإدارية
          </Badge>
          <h1 className="text-3xl font-bold">إدارة متكاملة للمحتوى، المعلمين، والطلاب</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            تحكّم في صلاحيات الأدوار، راقب الأداء لحظيًا، ونسق الحصص والحلقات مع نظام تنبيهات متكامل.
          </p>
        </header>

        <Card className="border border-primary/20 bg-primary/5">
          <CardHeader className="items-end text-right">
            <CardTitle className="flex items-center justify-end gap-2 text-xl">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              نظرة عامة فورية
            </CardTitle>
            <CardDescription>
              لوحة مؤشرات تعرض حالات الخوادم، حالة البث المباشر، وعدد المستخدمين المتصلين الآن.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
            {analytics.map((item) => (
              <div key={item.metric} className="rounded-lg border bg-background/80 px-4 py-3">
                <p className="font-semibold text-foreground">{item.metric}</p>
                <p>{item.value}</p>
                <p className="text-xs text-primary">{item.trend}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Tabs defaultValue="roles">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roles" className="text-xs sm:text-sm">الصلاحيات</TabsTrigger>
            <TabsTrigger value="communication" className="text-xs sm:text-sm">التواصل</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">الإعدادات الذكية</TabsTrigger>
          </TabsList>
          <TabsContent value="roles" className="mt-4">
            <Card className="border border-border/60">
              <CardHeader className="items-end text-right">
                <CardTitle className="flex items-center justify-end gap-2 text-xl">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  إدارة الأدوار
                </CardTitle>
                <CardDescription>حدد صلاحيات كل دور وقم بتفعيل المصادقة الثنائية للمعلمين.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="text-right">
                      <TableHead className="text-right">الدور</TableHead>
                      <TableHead className="text-right">الصلاحيات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.role} className="text-right">
                        <TableCell className="font-semibold">{role.role}</TableCell>
                        <TableCell>{role.permissions}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="communication" className="mt-4">
            <Card className="border border-primary/20 bg-primary/5">
              <CardHeader className="items-end text-right">
                <CardTitle className="flex items-center justify-end gap-2 text-xl">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  مركز الرسائل والتنبيهات
                </CardTitle>
                <CardDescription>
                  إدارة التنبيهات المرسلة للطلاب والمعلمين، مع إمكانية جدولة الرسائل بعد كل حلقة أو درس.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
                <div className="rounded-lg border bg-background/80 px-4 py-3">
                  <p>• قوالب رسائل جاهزة للورد اليومي.</p>
                  <p>• إرسال آلي عند التأخر عن الحلقة.</p>
                </div>
                <div className="rounded-lg border bg-background/80 px-4 py-3">
                  <p>• تقارير وصول التنبيهات بالوقت والتاريخ.</p>
                  <p>• نظام إشعارات عبر البريد والتطبيق.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <Card className="border border-dashed border-primary/40">
              <CardHeader className="items-end text-right">
                <CardTitle className="flex items-center justify-end gap-2 text-xl">
                  <Settings className="h-6 w-6 text-primary" />
                  تهيئة ذكية
                </CardTitle>
                <CardDescription>
                  تحكم في أوقات الحصص، إعدادات الذكاء الاصطناعي للتوصيات، وخيارات النسخ الاحتياطي.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
                <div className="rounded-lg border bg-background/80 px-4 py-3">
                  <p>• ضبط مستوى حساسية المدرب الصوتي.</p>
                  <p>• اختيار لغات واجهة الطلاب.</p>
                </div>
                <div className="rounded-lg border bg-background/80 px-4 py-3">
                  <p>• نسخ احتياطي تلقائي للبيانات أسبوعيًا.</p>
                  <p>• سجل تفصيلي للتعديلات والصلاحيات.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border border-primary/20 bg-primary/5">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <Users className="h-6 w-6 text-primary" />
                متابعة الطلاب
              </CardTitle>
              <CardDescription>
                متابعة حضور الطلاب، واجباتهم، وتقدمهم في القراءة والحفظ في لوحة واحدة.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>• عرض بيانات تفصيلية لكل طالب.</p>
              <p>• مقارنة مستويات الحفظ بين الحلقات.</p>
            </CardContent>
          </Card>

          <Card className="border border-border/60">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <BookOpen className="h-6 w-6 text-primary" />
                إدارة المحتوى
              </CardTitle>
              <CardDescription>
                تنظيم الدروس، المواد التعليمية، وتوزيعها على الفصول والحلقات بسهولة.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>• أرشفة المحتوى مع إمكانية النسخ.</p>
              <p>• تتبع المواد الأكثر استخدامًا.</p>
            </CardContent>
          </Card>

          <Card className="border border-dashed border-primary/40">
            <CardHeader className="items-end text-right">
              <CardTitle className="flex items-center justify-end gap-2 text-xl">
                <CalendarCheck className="h-6 w-6 text-primary" />
                جدولة الأوقات
              </CardTitle>
              <CardDescription>
                إدارة جداول الحلقات، الفصول، والدروس الخاصة مع التذكير التلقائي للمشاركين.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>• ربط الحصص بتقويمات Google أو Outlook.</p>
              <p>• تحليلات للحضور والانضباط.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
}
