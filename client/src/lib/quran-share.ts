/**
 * وظائف مساعدة لنسخ ومشاركة النص القرآني
 */

/**
 * تنسيق النص القرآني عند النسخ
 * يضيف معلومات السورة والآية إذا كانت متوفرة
 */
export function formatQuranText(text: string, pageNumber: number, surahName?: string) {
  // تنسيق النص الأساسي
  let formattedText = `${text}`;
  
  // إضافة معلومات السورة والصفحة إذا كانت متوفرة
  if (surahName) {
    formattedText += `\n(سورة ${surahName})`;
  }
  
  formattedText += `\n[المصحف الشريف - صفحة ${pageNumber}]`;
  
  return formattedText;
}

/**
 * نسخ النص المحدد إلى الحافظة مع التنسيق
 */
export async function copyQuranText(text: string, pageNumber: number, surahName?: string) {
  const formattedText = formatQuranText(text, pageNumber, surahName);
  
  try {
    await navigator.clipboard.writeText(formattedText);
    return true;
  } catch (error) {
    console.error('خطأ في نسخ النص:', error);
    // بديل في حالة فشل API الحافظة
    copyTextFallback(formattedText);
    return false;
  }
}

/**
 * طريقة بديلة لنسخ النص في حالة عدم دعم واجهة الحافظة
 */
function copyTextFallback(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

/**
 * إنشاء رابط مشاركة للصفحة
 */
export function createShareLink(pageNumber: number, surahName?: string, selectedText?: string) {
  const baseUrl = window.location.origin;
  let shareUrl = `${baseUrl}/quran?page=${pageNumber}`;
  
  // إضافة معلومات إضافية للمشاركة إذا كانت متوفرة
  if (surahName) {
    shareUrl += `&surah=${encodeURIComponent(surahName)}`;
  }
  
  // يمكن إضافة نص محدد كمعلمة في الرابط
  // لكن سيتم تقييد الطول للحفاظ على روابط معقولة
  if (selectedText && selectedText.length < 100) {
    shareUrl += `&text=${encodeURIComponent(selectedText.substring(0, 100))}`;
  }
  
  return shareUrl;
}

/**
 * مشاركة صفحة المصحف عبر واجهة مشاركة المتصفح
 * أو إنشاء رابط مباشر في حالة عدم توفر واجهة المشاركة
 */
export async function shareQuranPage(pageNumber: number, surahName?: string, selectedText?: string) {
  const shareUrl = createShareLink(pageNumber, surahName, selectedText);
  const shareTitle = `المصحف الشريف - ${surahName || `صفحة ${pageNumber}`}`;
  const shareText = selectedText 
    ? `${selectedText}\n[المصحف الشريف - ${surahName || `صفحة ${pageNumber}`}]` 
    : `المصحف الشريف - ${surahName || `صفحة ${pageNumber}`}`;
  
  // محاولة استخدام واجهة المشاركة الحديثة
  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      });
      return true;
    } catch (error) {
      console.error('خطأ في مشاركة الصفحة:', error);
    }
  }
  
  // نسخ الرابط إلى الحافظة كحل بديل
  try {
    await navigator.clipboard.writeText(shareUrl);
    return true;
  } catch (error) {
    console.error('خطأ في نسخ الرابط:', error);
    copyTextFallback(shareUrl);
    return false;
  }
}