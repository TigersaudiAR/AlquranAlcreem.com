import { useState, useEffect } from 'react';
import { getTafsir } from '../lib/quran-api';

interface UseTafsirProps {
  defaultSource?: string;
}

/**
 * خطاف للتعامل مع جلب وعرض بيانات التفسير
 * يدعم تغيير مصدر التفسير والتنقل بين الآيات
 */
export function useTafsir({ defaultSource = 'ar-tafsir-al-jalalayn' }: UseTafsirProps = {}) {
  const [tafsirSource, setTafsirSource] = useState(defaultSource);
  const [tafsirText, setTafsirText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVerse, setCurrentVerse] = useState<{ surah: number; ayah: number } | null>(null);

  /**
   * جلب تفسير آية محددة
   * @param surahNumber رقم السورة
   * @param ayahNumber رقم الآية
   */
  const fetchTafsir = async (surahNumber: number, ayahNumber: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await getTafsir(surahNumber, ayahNumber, tafsirSource);
      setTafsirText(data.tafsirText);
      setCurrentVerse({ surah: surahNumber, ayah: ayahNumber });
      
    } catch (err) {
      console.error('Error fetching tafsir:', err);
      setError('حدث خطأ أثناء جلب التفسير. يرجى المحاولة مرة أخرى.');
      setTafsirText(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * التنقل إلى الآية السابقة في نفس السورة
   */
  const goToPreviousAyah = () => {
    if (!currentVerse) return;
    
    const { surah, ayah } = currentVerse;
    if (ayah > 1) {
      fetchTafsir(surah, ayah - 1);
    }
    // في حالة الآية الأولى، يمكن الانتقال إلى السورة السابقة
    // لكن هذا يتطلب معرفة عدد آيات كل سورة
  };

  /**
   * التنقل إلى الآية التالية في نفس السورة
   * @param totalAyahsInSurah إجمالي عدد الآيات في السورة
   */
  const goToNextAyah = (totalAyahsInSurah?: number) => {
    if (!currentVerse || !totalAyahsInSurah) return;
    
    const { surah, ayah } = currentVerse;
    if (ayah < totalAyahsInSurah) {
      fetchTafsir(surah, ayah + 1);
    }
    // في حالة الآية الأخيرة، يمكن الانتقال إلى السورة التالية
  };

  /**
   * إعادة تحميل التفسير عند تغيير مصدر التفسير
   */
  useEffect(() => {
    if (currentVerse) {
      fetchTafsir(currentVerse.surah, currentVerse.ayah);
    }
  }, [tafsirSource]);

  return {
    tafsirSource,
    setTafsirSource,
    tafsirText,
    isLoading,
    error,
    currentVerse,
    fetchTafsir,
    goToPreviousAyah,
    goToNextAyah
  };
}