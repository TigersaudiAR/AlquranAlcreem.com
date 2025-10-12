import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import TopBar from '../components/common/TopBar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Clock,
  MicVocal,
  Sparkles,
  Moon,
  Sun,
  Radio,
  BellRing,
  Plus,
  Play,
  Pause,
} from 'lucide-react';

const DEFAULT_DUAS = [
  {
    title: 'أذكار الصباح',
    description: 'تشغيل تلقائي بعد صلاة الفجر حتى الشروق مع عدّ ذكي عبر الصوت أو اللمس.',
    recommendedTime: 'من بعد الفجر حتى الشروق',
  },
  {
    title: 'أذكار المساء',
    description: 'يُفَعَّل بعد صلاة العصر، ويستمع للتلاوة لضبط عدد مرات التكرار بدقة.',
    recommendedTime: 'من بعد العصر حتى العشاء',
  },
  {
    title: 'أدعية النوم',
    description: 'مسبحة هادئة بأصوات مريحة تُطفئ الشاشة تلقائياً بعد اكتمال الأذكار.',
    recommendedTime: 'قبل النوم مباشرة',
  },
];

export default function Duas() {
  const [activeTab, setActiveTab] = useState<'audio' | 'manual'>('audio');
  const [customDua, setCustomDua] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [selectedTime, setSelectedTime] = useState('بعد كل صلاة مغرب');

  return (
    <MainLayout>
      <TopBar />
      <div className="pt-16 space-y-6">
        <header className="text-right">
          <p className="text-sm text-muted-foreground">مسبحة ذكية تفاعلية</p>
          <h1 className="text-3xl font-bold">الأذكار والأدعية</h1>
          <p className="mt-2 text-muted-foreground">
            اضبط المسبحة لتعمل تلقائياً حسب الوقت أو الصوت، وتابع تقدمك مع توصيات الذكر المناسب لوقتك الحالي.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'audio' | 'manual')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="audio">مسبحة بالصوت</TabsTrigger>
            <TabsTrigger value="manual">مسبحة باللمس</TabsTrigger>
          </TabsList>

          <TabsContent value="audio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تحليل التكرار الصوتي</CardTitle>
                <CardDescription>
                  يعتمد على الذكاء الاصطناعي لرصد نهاية العبارة أو انقطاع الصوت والتأكد من دقة العدّ.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border bg-muted/40 p-4 text-right">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>الوضع الحالي</span>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
                        مستمع نشط
                      </Badge>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">أذكار المساء</h3>
                    <p className="text-sm text-muted-foreground">التعرف على الصوت مستمر، سيتم العد عند اكتمال العبارة.</p>
                  </div>
                  <div className="rounded-xl border bg-muted/40 p-4 text-right">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>الحساسية</span>
                      <Radio className="h-4 w-4" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      اضبط عتبة الكشف عن الصمت للتأكد من عدّ كل تكرار بدقة حتى مع اختلاف مخارج الحروف.
                    </p>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline">حساسية منخفضة</Button>
                      <Button size="sm" className="bg-primary/90 text-primary-foreground hover:bg-primary">تلقائي</Button>
                      <Button size="sm" variant="outline">حساسية عالية</Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MicVocal className="h-4 w-4" />
                    <span>استمع للتلاوة واضغط إيقاف عند الانتهاء</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <Play className="mr-1 h-4 w-4" /> بدء الاستماع
                    </Button>
                    <Button size="sm" variant="outline">
                      <Pause className="mr-1 h-4 w-4" /> إيقاف مؤقت
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>مسبحة باللمس</CardTitle>
                <CardDescription>
                  يمكنك النقر على أي جزء من الشاشة أثناء التلاوة لزيادة العدّ، مع مؤشرات ضوئية تحفز على الاستمرار.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-dashed bg-background p-6 text-center shadow-sm">
                  <div className="text-5xl font-black text-primary">{33}</div>
                  <p className="mt-2 text-sm text-muted-foreground">عدد التسبيحات الحالية</p>
                  <Button className="mt-4 w-full" size="lg">زيادة باللمس</Button>
                </div>
                <div className="rounded-2xl border bg-muted/40 p-6 text-right">
                  <p className="text-sm text-muted-foreground">انقر الشاشة بالكامل لزيادة العد أو استخدم العدّاد الدائري:</p>
                  <div className="mt-4 flex items-center justify-end gap-3 text-sm">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">تفعيل النقر الشامل</Badge>
                    <Switch defaultChecked />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    يمكنك تخصيص صوت للتأكيد أو اهتزاز خفيف كل عشرة تسبيحات لمزيد من التركيز.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <section className="grid gap-4 md:grid-cols-2">
          {DEFAULT_DUAS.map((dua) => (
            <Card key={dua.title} className="border border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">{dua.title}</CardTitle>
                <CardDescription>{dua.recommendedTime}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{dua.description}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>يتم تذكيرك تلقائيًا</span>
                </div>
                <Button variant="ghost" size="sm">عرض التفاصيل</Button>
              </CardFooter>
            </Card>
          ))}
        </section>

        <Card className="border border-dashed border-primary/30">
          <CardHeader>
            <CardTitle>أضف دعاءً مخصصًا</CardTitle>
            <CardDescription>
              خصص وقتًا، تكرارًا، وتنبيهًا صوتيًا لتذكيرك بالدعاء الذي تريده قبل أو بعد الصلاة.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 text-right">
              <label className="text-sm font-medium">نص الدعاء</label>
              <Textarea
                placeholder="اكتب دعاءك هنا ليتم تذكيرك به"
                value={customDua}
                onChange={(event) => setCustomDua(event.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-4 text-right">
              <div className="space-y-2">
                <label className="text-sm font-medium">وقت التذكير</label>
                <Input
                  value={selectedTime}
                  onChange={(event) => setSelectedTime(event.target.value)}
                  placeholder="مثال: قبل صلاة الفجر بعشر دقائق"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
                <div className="text-sm text-muted-foreground">
                  <p>تفعيل التذكير الصوتي</p>
                  <p className="text-xs">إرسال تنبيه صوتي مع عرض الدعاء داخل التطبيق.</p>
                </div>
                <Switch checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
              </div>
              <Button className="w-full" disabled={!customDua.trim()}>
                <Plus className="ml-2 h-4 w-4" /> حفظ الدعاء
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-end gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Sun className="h-4 w-4" />
              <span>اقتراحات الصباح حسب موقعك</span>
            </div>
            <div className="flex items-center gap-1">
              <Moon className="h-4 w-4" />
              <span>تذكير بالأذكار المسائية عند غروب الشمس</span>
            </div>
            <div className="flex items-center gap-1">
              <BellRing className="h-4 w-4" />
              <span>تنبيهات مخصصة للمناسبات الخاصة</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
