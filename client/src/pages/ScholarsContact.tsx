import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import TopBar from '../components/common/TopBar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  MessageCircle,
  Send,
  Phone,
  Mail,
  Globe,
  Clock,
  BookOpen,
} from 'lucide-react';

const commonQuestions = [
  'ما حكم الجمع بين الصلوات في السفر؟',
  'كيف تكون زكاة المال في التجارة الإلكترونية؟',
  'أفضل طرق حفظ القرآن للأطفال في المراحل الأولى؟',
  'ما ضوابط استخدام الذكاء الاصطناعي في التعليم الشرعي؟',
];

export default function ScholarsContact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [question, setQuestion] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!question.trim()) return;
    setSent(true);
  };

  return (
    <MainLayout>
      <TopBar />
      <div className="pt-16 space-y-8">
        <header className="flex flex-col items-end text-right">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
            تواصل مع أهل العلم
          </Badge>
          <h1 className="text-3xl font-bold">استفتاء فوري وإرشاد من علماء موثوقين</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            أرسل استفسارك مباشرة إلى العلماء أو المشرفين، مع إمكانية إضافة معلومات التواصل لاختيارك. ستتلقى تنبيهاً فور الرد مع ملخص قابل للتنزيل.
          </p>
        </header>

        <Card className="border border-primary/20 bg-primary/5">
          <CardHeader className="items-end text-right">
            <CardTitle className="flex items-center justify-end gap-2 text-xl">
              <MessageCircle className="h-6 w-6 text-primary" />
              نافذة محادثة فورية
            </CardTitle>
            <CardDescription>
              أدخل بياناتك (اختياري) وابدأ المحادثة. يتم تشفير الرسائل وحفظها في لوحة تحكم العلماء للمتابعة.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="الاسم" className="text-right" />
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="البريد الإلكتروني" className="text-right" />
              <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="رقم الجوال (اختياري)" className="text-right" />
            </div>
            <Textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="اكتب سؤالك الشرعي أو الاستفسار التعليمي"
              className="min-h-[140px] text-right"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmit}>
                <Send className="ml-2 h-4 w-4" /> إرسال السؤال
              </Button>
            </div>
            {sent && (
              <div className="rounded-lg border border-primary/30 bg-background/80 p-4 text-right text-sm text-muted-foreground">
                تم استلام سؤالك. سيقوم أحد العلماء بالرد خلال ٢٤ ساعة مع إمكانية التواصل المباشر عبر البريد أو الجوال إذا رغبت.
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-end gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" /> دعم هاتفي اختياري
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" /> بريد رسمي موثق
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> أوقات الرد ٩ صباحاً - ٩ مساءً
            </span>
          </CardFooter>
        </Card>

        <Tabs defaultValue="faq">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="faq" className="text-xs sm:text-sm">أسئلة شائعة</TabsTrigger>
            <TabsTrigger value="resources" className="text-xs sm:text-sm">موارد للمراجعة</TabsTrigger>
          </TabsList>
          <TabsContent value="faq" className="mt-4">
            <Card className="border border-dashed border-primary/40 bg-primary/5">
              <CardHeader className="items-end text-right">
                <CardTitle className="text-xl font-semibold">أبرز الأسئلة</CardTitle>
                <CardDescription>مختارات من أكثر الأسئلة المتكررة مع إجابات موجزة.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-right text-sm text-muted-foreground">
                {commonQuestions.map((item) => (
                  <div key={item} className="rounded-lg border bg-background/80 p-4">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="resources" className="mt-4">
            <Card className="border border-border/60">
              <CardHeader className="items-end text-right">
                <CardTitle className="flex items-center justify-end gap-2 text-xl">
                  <BookOpen className="h-6 w-6 text-primary" />
                  مصادر موثوقة للرجوع
                </CardTitle>
                <CardDescription>
                  روابط مباشرة لدور الإفتاء الرسمية، موسوعة فتاوى معتمدة، وخدمات تواصل للحالات العاجلة.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm text-muted-foreground">
                <p>• الرئاسة العامة للبحوث العلمية والإفتاء (KSA).</p>
                <p>• منصة فتاوى وزارة الشؤون الإسلامية.</p>
                <p>• مكتبة إلكترونية للبحوث الشرعية بصيغ متنوعة.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
