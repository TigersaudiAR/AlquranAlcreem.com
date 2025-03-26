import { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

interface BookmarkAndShareProps {
  pageNumber: number;
  surahNumber?: number;
  ayahNumber?: number;
}

const BookmarkAndShare = ({ pageNumber, surahNumber, ayahNumber }: BookmarkAndShareProps) => {
  const { toast } = useToast();
  
  const handleBookmark = useCallback(() => {
    try {
      // In a real app, you would save this to an API/database
      const bookmark = {
        pageNumber,
        surahNumber,
        ayahNumber,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('quranBookmark', JSON.stringify(bookmark));
      
      toast({
        title: "تم حفظ الموضع",
        description: "تم حفظ موضع القراءة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ موضع القراءة",
        variant: "destructive",
      });
    }
  }, [pageNumber, surahNumber, ayahNumber, toast]);
  
  const handleShare = useCallback(() => {
    // Create sharing URL or text
    const shareText = `أقرأ القرآن الكريم - صفحة ${pageNumber}${surahNumber ? ` - سورة ${surahNumber}` : ''}${ayahNumber ? ` - آية ${ayahNumber}` : ''}`;
    const shareUrl = `${window.location.origin}/quran?page=${pageNumber}${surahNumber ? `&surah=${surahNumber}` : ''}${ayahNumber ? `&ayah=${ayahNumber}` : ''}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'تطبيق القرآن الكريم التعليمي',
        text: shareText,
        url: shareUrl,
      })
      .then(() => {
        toast({
          title: "تمت المشاركة",
          description: "تم مشاركة القرآن الكريم بنجاح",
        });
      })
      .catch((error) => {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء مشاركة القرآن الكريم",
          variant: "destructive",
        });
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        .then(() => {
          toast({
            title: "تم النسخ",
            description: "تم نسخ الرابط إلى الحافظة",
          });
        })
        .catch(() => {
          toast({
            title: "خطأ",
            description: "فشل نسخ الرابط إلى الحافظة",
            variant: "destructive",
          });
        });
    }
  }, [pageNumber, surahNumber, ayahNumber, toast]);
  
  const handleDownload = useCallback(() => {
    // In a real app, this would generate a PDF or image of the current page
    toast({
      title: "جاري التحميل",
      description: "جاري تحميل الصفحة كملف PDF",
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "تم التحميل",
        description: "تم تحميل الصفحة بنجاح",
      });
    }, 2000);
  }, [toast]);
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <button 
        className="flex items-center gap-2 py-2 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        onClick={handleBookmark}
      >
        <i className="fas fa-bookmark"></i>
        <span>حفظ موضع القراءة</span>
      </button>
      <button 
        className="flex items-center gap-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={handleShare}
      >
        <i className="fas fa-share-nodes"></i>
        <span>مشاركة</span>
      </button>
      <button 
        className="flex items-center gap-2 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
        onClick={handleDownload}
      >
        <i className="fas fa-download"></i>
        <span>تحميل الصفحة</span>
      </button>
    </div>
  );
};

export default BookmarkAndShare;
