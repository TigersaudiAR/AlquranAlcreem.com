/**
 * وظائف مساعدة لنسخ ومشاركة النص القرآني
 */

/**
 * تنسيق النص القرآني عند النسخ
 * يضيف معلومات السورة والآية إذا كانت متوفرة
 */
export function formatQuranText(text: string, pageNumber: number, surahName?: string) {
  let formattedText = text.trim();
  
  // إضافة اسم السورة ورقم الصفحة إذا كانا متوفرين
  if (surahName) {
    formattedText += `\n\n— ${surahName}، صفحة ${pageNumber} من المصحف الشريف`;
  } else {
    formattedText += `\n\n— صفحة ${pageNumber} من المصحف الشريف`;
  }
  
  return formattedText;
}

/**
 * نسخ النص المحدد إلى الحافظة مع التنسيق
 */
export async function copyQuranText(text: string, pageNumber: number, surahName?: string) {
  const formattedText = formatQuranText(text, pageNumber, surahName);
  
  try {
    // استخدام واجهة الحافظة الحديثة إن كانت متوفرة
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(formattedText);
      return true;
    } else {
      // طريقة بديلة قديمة
      copyTextFallback(formattedText);
      return true;
    }
  } catch (error) {
    console.error('خطأ في نسخ النص:', error);
    // محاولة النسخ بالطريقة البديلة
    copyTextFallback(formattedText);
    return false;
  }
}

/**
 * طريقة بديلة لنسخ النص في حالة عدم دعم واجهة الحافظة
 */
function copyTextFallback(text: string) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('فشل نسخ النص بالطريقة البديلة:', err);
  }
  
  document.body.removeChild(textArea);
}

/**
 * إنشاء رابط مشاركة للصفحة
 */
export function createShareLink(pageNumber: number, surahName?: string, selectedText?: string) {
  // تحديد الصفحة الحالية
  const pageUrl = `${window.location.origin}/quran/page/${pageNumber}`;
  
  // إنشاء نص المشاركة
  let shareText = selectedText 
    ? `"${selectedText.substring(0, 100)}${selectedText.length > 100 ? '...' : ''}"`
    : '';
  
  if (surahName) {
    shareText += ` — ${surahName}، صفحة ${pageNumber} من المصحف الشريف`;
  } else {
    shareText += ` — صفحة ${pageNumber} من المصحف الشريف`;
  }
  
  // إنشاء رابط المشاركة
  return {
    url: pageUrl,
    text: shareText.trim()
  };
}

/**
 * مشاركة صفحة المصحف عبر واجهة مشاركة المتصفح
 * أو إنشاء رابط مباشر في حالة عدم توفر واجهة المشاركة
 */
export async function shareQuranPage(pageNumber: number, surahName?: string, selectedText?: string) {
  const { url, text } = createShareLink(pageNumber, surahName, selectedText);
  
  try {
    // استخدام واجهة المشاركة الحديثة إن كانت متوفرة
    if (navigator.share) {
      await navigator.share({
        title: 'مشاركة من المصحف الشريف',
        text,
        url
      });
      return true;
    } else {
      // في حالة عدم توفر واجهة المشاركة، يتم نسخ الرابط للحافظة
      await navigator.clipboard.writeText(`${text}\n${url}`);
      return false;
    }
  } catch (error) {
    console.error('خطأ في مشاركة الصفحة:', error);
    // محاولة نسخ الرابط بالطريقة البديلة
    copyTextFallback(`${text}\n${url}`);
    return false;
  }
}