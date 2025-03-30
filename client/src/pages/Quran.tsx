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
    // إذا كان هناك رقم صفحة في المعلمات
    if (params.pageNumber) {
      const pageNum = parseInt(params.pageNumber, 10);
      setInitialPage(pageNum);
    } 
    // إذا كان هناك رقم سورة في المعلمات
    else if (params.surahNumber) {
      const surahNum = parseInt(params.surahNumber, 10);
      setInitialSurah(surahNum);
      
      // إذا كان هناك رقم آية أيضًا
      if (params.ayahNumber) {
        const ayahNum = parseInt(params.ayahNumber, 10);
        setInitialAyah(ayahNum);
      }
    } 
    // إذا كان هناك آخر قراءة محفوظة وتم تفعيل خيار "حفظ آخر قراءة"
    else if (lastRead && settings.autoSaveLastRead) {
      setInitialPage(lastRead.pageNumber);
    }
  }, [params.pageNumber, params.surahNumber, params.ayahNumber, lastRead, settings.autoSaveLastRead]);
  
  return (
    <KingFahdMushaf 
      initialPage={initialPage}
      initialSurah={initialSurah}
      initialAyah={initialAyah}
    />
  );
};

export default Quran;