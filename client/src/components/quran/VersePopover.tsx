import { useState, useEffect } from 'react';
import { X, Volume2, Copy, Share2, Bookmark } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../hooks/use-toast';
import { TAFSIR_SOURCES } from '../../lib/constants';

interface VersePopoverProps {
  surahNumber: number;
  verseNumber: number;
  onClose: () => void;
  className?: string;
}

/**
 * مكون منبثق لعرض معلومات الآية والتفسير
 */
const VersePopover = ({
  surahNumber,
  verseNumber,
  onClose,
  className
}: VersePopoverProps) => {
  const { settings, addBookmark } = useApp();
  const [verseData, setVerseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [tafsir, setTafsir] = useState<string>('');
  const [activeTab, setActiveTab] = useState('text');
  const { toast } = useToast();
  
  // جلب بيانات الآية والتفسير
  useEffect(() => {
    const fetchVerseData = async () => {
      try {
        setLoading(true);
        
        // جلب بيانات الآية من القرآن
        const response = await fetch(`/assets/quran/hafs_smart_v8.json`);
        
        if (!response.ok) {
          throw new Error('فشل في تحميل بيانات الآية');
        }
        
        const allData = await response.json();
        
        // العثور على الآية المطلوبة
        const foundVerse = allData.find((verse: any) => 
          verse.sura_no === surahNumber && verse.aya_no === verseNumber
        );
        
        setVerseData(foundVerse);
        
        // هنا يمكن إضافة جلب بيانات التفسير
        // في المرحلة الحالية نستخدم نص بديل
        setTafsir('تفسير الآية الكريمة سيظهر هنا عند توفر بيانات التفسير. يمكن استخدام واجهة برمجة التطبيقات المناسبة لاسترداد التفسير من مصادر موثوقة.');
        
        setLoading(false);
      } catch (err) {
        console.error('خطأ في تحميل بيانات الآية:', err);
        setLoading(false);
      }
    };
    
    fetchVerseData();
  }, [surahNumber, verseNumber]);
  
  // نسخ نص الآية
  const copyVerseText = () => {
    if (verseData?.aya_text_emlaey) {
      navigator.clipboard.writeText(verseData.aya_text_emlaey);
      toast({
        title: "تم النسخ",
        description: "تم نسخ نص الآية إلى الحافظة",
        variant: "default",
      });
    }
  };
  
  // مشاركة الآية
  const shareVerse = () => {
    const shareText = `${verseData?.aya_text_emlaey} [سورة ${verseData?.sura_name_ar} : ${verseData?.aya_no}]`;
    navigator.clipboard.writeText(shareText);
    toast({
      title: "تم النسخ",
      description: "تم نسخ نص الآية مع معلوماتها للمشاركة",
      variant: "default",
    });
  };
  
  // إضافة إشارة مرجعية
  const handleAddBookmark = () => {
    if (verseData) {
      addBookmark({
        surahNumber,
        ayahNumber: verseNumber,
        pageNumber: verseData.page
      });
      toast({
        title: "تمت الإضافة",
        description: "تمت إضافة الآية إلى الإشارات المرجعية",
        variant: "default",
      });
    }
  };
  
  return (
    <Card 
      className={cn(
        "verse-popover fixed bottom-0 left-0 right-0 rounded-t-xl shadow-lg z-40",
        "bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800",
        "transform transition-transform",
        className
      )}
      dir="rtl"
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">
          {verseData ? `${verseData.sura_name_ar} - الآية ${verseData.aya_no}` : 'جاري التحميل...'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="text">الآية</TabsTrigger>
              <TabsTrigger value="tafsir">التفسير</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              <div className="text-xl text-center p-4 font-quran leading-loose">
                {verseData?.aya_text_emlaey}
              </div>
              
              <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                <Button variant="ghost" size="sm" onClick={copyVerseText}>
                  <Copy className="h-4 w-4 ml-2 rtl:mr-2" />
                  نسخ
                </Button>
                
                <Button variant="ghost" size="sm" onClick={shareVerse}>
                  <Share2 className="h-4 w-4 ml-2 rtl:mr-2" />
                  مشاركة
                </Button>
                
                <Button variant="ghost" size="sm" onClick={handleAddBookmark}>
                  <Bookmark className="h-4 w-4 ml-2 rtl:mr-2" />
                  حفظ
                </Button>
                
                <Button variant="ghost" size="sm">
                  <Volume2 className="h-4 w-4 ml-2 rtl:mr-2" />
                  استماع
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="tafsir" className="space-y-4">
              <div>
                <select 
                  className="w-full p-2 border rounded-md mb-4"
                  value={settings.translation}
                  onChange={(e) => {
                    // هنا يمكن تحديث التفسير المختار
                    // ستحتاج لربط هذا بسياق التطبيق لتغيير الإعدادات
                  }}
                >
                  {TAFSIR_SOURCES.map(source => (
                    <option key={source.id} value={source.id}>
                      {source.name}
                    </option>
                  ))}
                </select>
                
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-right leading-relaxed">{tafsir}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Card>
  );
};

export default VersePopover;