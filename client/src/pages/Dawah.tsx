import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import TopBar from '../components/common/TopBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  MessageSquare,
  Globe,
  BookOpen,
  Sparkles,
  Languages,
  Send,
  Handshake,
  Info,
} from 'lucide-react';

const faqs = [
  {
    question: 'ما معنى الإسلام؟',
    answer: 'الإسلام هو الاستسلام لله بالتوحيد، والانقياد له بالطاعة، والبراءة من الشرك وأهله. يشرح القسم هذا المعنى بأسلوب بسيط مع أدلة من القرآن والسنة.'
  },
  {
    question: 'من هو النبي محمد ﷺ؟',
    answer: 'نقدم سيرة مختصرة للنبي محمد ﷺ مع أبرز المحطات، والمعجزات، والأخلاق، مع روابط لمصادر رسمية سعودية للتوسع.'
  },
  {
    question: 'كيف أبدأ تعلّم الإسلام؟',
    answer: 'يتضمن القسم دليلًا خطوة بخطوة للتعرف على أركان الإيمان والإسلام، مع إمكانية التواصل مع العلماء مباشرة لأي استفسار.'
  },
];

export default function Dawah() {
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('العربية');
  const [response, setResponse] = useState('');

  const handleAsk = () => {
    if (!question.trim()) return;
    setResponse('سيتم توليد إجابة معتمدة على القرآن الكريم والسنة النبوية الشريفة، مع ترجمة مناسبة للغة المختارة.');
  };

  return (
    <MainLayout>
      <TopBar />
      <div className="pt-16 space-y-8">
        <header className="flex flex-col items-end text-right">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
            الدعوة والإرشاد
          </Badge>
          <h1 className="text-3xl font-bold">بوابة للتعريف بالإسلام والرد على الاستفسارات</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            يقدم هذا القسم مواد تعريفية بلغات متعددة، وإجابة فورية عن الأسئلة اعتمادًا على نصوص القرآن والسنة النبوية، مع إرشاد لخطوات الدخول في الإسلام.
          </p>
        </header>

        <Card className="border border-primary/20 bg-primary/5">
          <CardHeader className="items-end text-right">
            <CardTitle className="flex items-center justify-end gap-2 text-xl">
              <MessageSquare className="h-6 w-6 text-primary" />
              اسأل بأي لغة
            </CardTitle>
            <CardDescription>
              يترجم النظام السؤال آليًا، يستخرج الجواب من المصادر الموثوقة، ثم يعرضه باللغة الأصلية مع روابط للمراجع.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="text-right">
                <label className="text-sm font-medium">اختر اللغة</label>
                <Input value={language} onChange={(event) => setLanguage(event.target.value)} placeholder="English, Français, Türkçe" />
              </div>
              <div className="text-right">
                <label className="text-sm font-medium">سؤالك</label>
                <Input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="مثال: ما أركان الإسلام؟" />
              </div>
            </div>
            <div className="text-right">
              <label className="text-sm font-medium">تفاصيل إضافية (اختياري)</label>
              <Textarea placeholder="اكتب تفاصيل تساعد المستجيب على فهم سؤالك" />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAsk}>
                <Send className="ml-2 h-4 w-4" /> إرسال السؤال
              </Button>
            </div>
            {response && (
              <div className="rounded-lg border border-primary/30 bg-background/80 p-4 text-right text-sm text-muted-foreground">
                {response}
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">نبذة عامة</TabsTrigger>
            <TabsTrigger value="guide" className="text-xs sm:text-sm">دليل التعرف على الإسلام</TabsTrigger>
            <TabsTrigger value="support" className="text-xs sm:text-sm">موارد إضافية</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <Card className="border border-dashed border-primary/40">
              <CardHeader className="items-end text-right">
                <CardTitle className="flex items-center justify-end gap-2 text-xl">
                  <Globe className="h-6 w-6 text-primary" />
                  منصات عالمية
                </CardTitle>
                <CardDescription>
                  يتم توفير المحتوى بأكثر من ١٥ لغة مع دعم الترجمة الفورية للنصوص والملفات الصوتية.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• ملفات PDF تعريفية باللغات العالمية.</p>
                <p>• مقاطع فيديو مترجمة عن معنى الإسلام وأركانه.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="guide" className="mt-4">
            <Card className="border border-primary/20 bg-primary/5">
              <CardHeader className="items-end text-right">
                <CardTitle className="flex items-center justify-end gap-2 text-xl">
                  <BookOpen className="h-6 w-6 text-primary" />
                  خطوات واضحة
                </CardTitle>
                <CardDescription>
                  دليل عملي للأشخاص الراغبين في الدخول في الإسلام مع شرح الشهادتين والوضوء والصلاة الأولى.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• نص الشهادتين بلغات متعددة.</p>
                <p>• دروس مرئية لكيفية الوضوء والصلاة.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="support" className="mt-4">
            <Card className="border border-border/60">
              <CardHeader className="items-end text-right">
                <CardTitle className="flex items-center justify-end gap-2 text-xl">
                  <Handshake className="h-6 w-6 text-primary" />
                  متابعة ودعم
                </CardTitle>
                <CardDescription>
                  فريق متخصص للتواصل مع المهتمين حديثًا بالإسلام، مع برامج دعم أسبوعية وإجابات عن الأسئلة المستمرة.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• مجموعات متابعات عبر الفيديو.</p>
                <p>• خط مباشر مع أهل العلم لتأكيد الفتاوى.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border border-dashed border-primary/40 bg-primary/5">
          <CardHeader className="items-end text-right">
            <CardTitle className="flex items-center justify-end gap-2 text-xl">
              <Info className="h-5 w-5 text-primary" />
              التزام بالمصادر الموثوقة
            </CardTitle>
            <CardDescription>
              يتم جمع الإجابات من القرآن الكريم والسنة النبوية الصحيحة، مع إشارة إلى المصدر والآية أو الحديث عند كل رد.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>يتم أرشفة كل محادثة للرجوع إليها لاحقًا، ويمكن للزائر تحميل نسخة من الإجابة مع روابط للمراجع الرسمية.</p>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="items-end text-right">
            <CardTitle className="text-2xl font-bold">أسئلة شائعة</CardTitle>
            <CardDescription>إجابات موجزة بلغة مبسطة مع روابط للتوسع.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-right text-sm text-muted-foreground">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border bg-background/80 p-4">
                <h3 className="text-base font-semibold text-foreground">{faq.question}</h3>
                <p className="mt-2 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
