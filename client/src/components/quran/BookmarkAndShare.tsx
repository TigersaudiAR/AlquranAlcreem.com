import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { SURAH_NAMES } from '../../lib/constants';

interface BookmarkAndShareProps {
  pageNumber: number;
  surahNumber?: number;
  ayahNumber?: number;
}

const BookmarkAndShare = ({ pageNumber, surahNumber, ayahNumber }: BookmarkAndShareProps) => {
  const [description, setDescription] = useState('');
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState('');
  
  // الحصول على اسم السورة من الرقم
  const getSurahName = () => {
    if (!surahNumber) return 'غير محدد';
    const surah = SURAH_NAMES.find(s => s.number === surahNumber);
    return surah ? surah.name : `سورة ${surahNumber}`;
  };
  
  const handleAddBookmark = () => {
    // في التطبيق الفعلي، سيتم حفظ العلامة المرجعية في التخزين المحلي أو قاعدة البيانات
    const bookmark = {
      id: Date.now().toString(),
      surahNumber: surahNumber || 1,
      ayahNumber: ayahNumber || 1,
      pageNumber,
      timestamp: new Date().toISOString(),
      description: description.trim(),
    };
    
    // حفظ في التخزين المحلي (localStorage)
    const existingBookmarks = JSON.parse(localStorage.getItem('quran_bookmarks') || '[]');
    localStorage.setItem('quran_bookmarks', JSON.stringify([...existingBookmarks, bookmark]));
    
    // إغلاق مربع الحوار
    setShowBookmarkDialog(false);
    setDescription('');
    
    // إظهار رسالة تأكيد
    alert('تمت إضافة الفاصل بنجاح');
  };
  
  const handleShare = () => {
    // إنشاء رابط مشاركة
    const queryParams = new URLSearchParams();
    queryParams.set('page', pageNumber.toString());
    
    if (surahNumber) {
      queryParams.set('surah', surahNumber.toString());
      
      if (ayahNumber) {
        queryParams.set('ayah', ayahNumber.toString());
      }
    }
    
    const shareUrl = `${window.location.origin}/quran?${queryParams.toString()}`;
    setShareLink(shareUrl);
    setShowShareDialog(true);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        alert('تم نسخ الرابط بنجاح');
        setShowShareDialog(false);
      })
      .catch(err => {
        console.error('فشل نسخ الرابط: ', err);
      });
  };
  
  return (
    <div className="flex justify-center gap-4 mt-4 mb-8">
      {/* زر إضافة فاصل */}
      <Dialog open={showBookmarkDialog} onOpenChange={setShowBookmarkDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <i className="fas fa-bookmark"></i>
            <span>إضافة فاصل</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">إضافة فاصل</DialogTitle>
            <DialogDescription className="text-right">
              أضف وصفاً اختيارياً للفاصل
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 space-y-4">
            <div className="text-right">
              <p><strong>السورة:</strong> {getSurahName()}</p>
              <p><strong>رقم الآية:</strong> {ayahNumber || 'غير محدد'}</p>
              <p><strong>الصفحة:</strong> {pageNumber}</p>
            </div>
            
            <Textarea
              placeholder="أضف وصفاً للفاصل (اختياري)"
              className="h-20 text-right"
              dir="rtl"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <DialogFooter className="sm:justify-start">
            <Button type="button" onClick={handleAddBookmark}>
              إضافة فاصل
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowBookmarkDialog(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* زر المشاركة */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <i className="fas fa-share-alt"></i>
            <span>مشاركة</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">مشاركة هذه الصفحة</DialogTitle>
            <DialogDescription className="text-right">
              انسخ الرابط أدناه لمشاركة هذه الصفحة مع الآخرين
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={copyToClipboard}>
                نسخ
              </Button>
              <Input
                value={shareLink}
                readOnly
                className="text-left"
              />
            </div>
            
            <div className="mt-4 text-right">
              <p><strong>السورة:</strong> {getSurahName()}</p>
              {ayahNumber && <p><strong>الآية:</strong> {ayahNumber}</p>}
              <p><strong>الصفحة:</strong> {pageNumber}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" onClick={() => setShowShareDialog(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookmarkAndShare;