import { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import KingFahdMushaf from '../components/quran/KingFahdMushaf';
import { useApp } from '../context/AppContext';
import { APP_CONFIG } from '../lib/constants';

/**
 * صفحة القرآن الكريم الرئيسية
 * تعرض المصحف بتنسيق مجمع الملك فهد
 */
const Quran = () => {
  const params = useParams();
  const { lastRead, settings } = useApp();
  const [initialPage, setInitialPage] = useState<number>(APP_CONFIG.DEFAULT_PAGE);
  const [initialSurah, setInitialSurah] = useState<number | undefined>(undefined);
  const [initialAyah, setInitialAyah] = useState<number | undefined>(undefined);
  
  // تحديد الصفحة الأولية استنادًا إلى المعلمات أو آخر قراءة
  useEffect(() => {
    // نستخدم متغيراً مؤقتاً لتخزين الصفحة/السورة/الآية لمنع التحديثات المتكررة
    let newPage = APP_CONFIG.DEFAULT_PAGE;
    let newSurah = undefined;
    let newAyah = undefined;
    let shouldUpdate = false;
    
    // إذا كان هناك رقم صفحة في المعلمات
    if (params.pageNumber) {
      newPage = parseInt(params.pageNumber, 10);
      shouldUpdate = newPage !== initialPage;
    } 
    // إذا كان هناك رقم سورة في المعلمات
    else if (params.surahNumber) {
      newSurah = parseInt(params.surahNumber, 10);
      shouldUpdate = newSurah !== initialSurah;
      
      // إذا كان هناك رقم آية أيضًا
      if (params.ayahNumber) {
        newAyah = parseInt(params.ayahNumber, 10);
        shouldUpdate = shouldUpdate || newAyah !== initialAyah;
      }
    } 
    // إذا كان هناك آخر قراءة محفوظة وتم تفعيل خيار "حفظ آخر قراءة"
    else if (lastRead && settings.autoSaveLastRead) {
      newPage = lastRead.pageNumber;
      shouldUpdate = newPage !== initialPage;
    }
    
    // نقوم بالتحديث فقط إذا كانت القيم الجديدة مختلفة
    if (shouldUpdate) {
      if (newSurah !== undefined) {
        setInitialSurah(newSurah);
        if (newAyah !== undefined) {
          setInitialAyah(newAyah);
        }
      } else {
        setInitialPage(newPage);
      }
    }
  }, [params.pageNumber, params.surahNumber, params.ayahNumber, lastRead, settings.autoSaveLastRead, initialPage, initialSurah, initialAyah]);
  
  return (
    <KingFahdMushaf 
      initialPage={initialPage}
      initialSurah={initialSurah}
      initialAyah={initialAyah}
    />
  );
};

export default Quran;