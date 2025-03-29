/**
 * وظائف مساعدة لنسخ ومشاركة النص القرآني
 */

/**
 * تنسيق النص القرآني عند النسخ
 * يضيف معلومات السورة والآية إذا كانت متوفرة
 */
export function formatQuranText(text: string, pageNumber: number, surahName?: string) {
  const formattedText = `﴿${text}﴾`;
  
  let citation = '';
  if (surahName) {
    citation = `\n— ${surahName}، صفحة ${pageNumber}`;
  } else {
    citation = `\n— المصحف الشريف، صفحة ${pageNumber}`;
  }
  
  return `${formattedText}${citation}`;
}

/**
 * نسخ النص المحدد إلى الحافظة مع التنسيق
 */
export async function copyQuranText(text: string, pageNumber: number, surahName?: string) {
  const formattedText = formatQuranText(text, pageNumber, surahName);
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(formattedText);
    } else {
      // طريقة احتياطية للمتصفحات القديمة
      copyTextFallback(formattedText);
    }
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
}

/**
 * طريقة بديلة لنسخ النص في حالة عدم دعم واجهة الحافظة
 */
function copyTextFallback(text: string) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  
  // جعل النص غير مرئي ولكن موجود في الصفحة
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback: Failed to copy text', err);
    throw err;
  } finally {
    document.body.removeChild(textArea);
  }
}

/**
 * إنشاء رابط مشاركة للصفحة
 */
export function createShareLink(pageNumber: number, surahName?: string, selectedText?: string) {
  const baseUrl = window.location.origin;
  const path = '/quran';
  
  // إضافة المعلومات إلى عنوان الصفحة
  const params = new URLSearchParams();
  params.append('page', pageNumber.toString());
  
  if (surahName) {
    params.append('surah', surahName);
  }
  
  // يمكن أيضًا إضافة النص المحدد مشفرًا إذا كان موجودًا
  if (selectedText) {
    params.append('highlight', encodeURIComponent(selectedText));
  }
  
  return `${baseUrl}${path}?${params.toString()}`;
}

/**
 * مشاركة صفحة المصحف عبر واجهة مشاركة المتصفح
 * أو إنشاء رابط مباشر في حالة عدم توفر واجهة المشاركة
 */
export async function shareQuranPage(pageNumber: number, surahName?: string, selectedText?: string) {
  const shareLink = createShareLink(pageNumber, surahName, selectedText);
  
  let shareText = surahName
    ? `قراءة ${surahName} من المصحف - صفحة ${pageNumber}`
    : `قراءة المصحف الشريف - صفحة ${pageNumber}`;
    
  if (selectedText) {
    // إضافة الآية المحددة للنص المشارك
    shareText = `${formatQuranText(selectedText, pageNumber, surahName)}\n\n${shareText}`;
  }
  
  try {
    if (navigator.share) {
      await navigator.share({
        title: 'مشاركة من المصحف الشريف',
        text: shareText,
        url: shareLink
      });
      return true;
    } else {
      // نسخ الرابط إلى الحافظة إذا لم تكن واجهة المشاركة متوفرة
      await navigator.clipboard.writeText(`${shareText}\n\n${shareLink}`);
      return true;
    }
  } catch (error) {
    console.error('Error sharing page:', error);
    
    // محاولة نسخ الرابط فقط كخيار أخير
    try {
      await navigator.clipboard.writeText(shareLink);
      return true;
    } catch (err) {
      console.error('Error copying share link:', err);
      return false;
    }
  }
}