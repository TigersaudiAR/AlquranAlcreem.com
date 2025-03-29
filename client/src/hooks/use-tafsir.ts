import { useState, useCallback } from 'react';
import { getTafsir } from '../lib/quran-api';

interface UseTafsirProps {
  defaultSource?: string;
}

export function useTafsir({ defaultSource = 'ar-tafsir-al-jalalayn' }: UseTafsirProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tafsirSource, setTafsirSource] = useState(defaultSource);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAyah, setCurrentAyah] = useState<{
    surahNumber: number;
    ayahNumber: number;
    ayahText: string;
    tafsirText: string;
  } | null>(null);

  // فتح نافذة التفسير
  const openTafsir = useCallback(async (surahNumber: number, ayahNumber: number, ayahText: string) => {
    setIsOpen(true);
    setCurrentAyah({
      surahNumber,
      ayahNumber,
      ayahText,
      tafsirText: ''
    });
    setIsLoading(true);
    setError(null);

    try {
      const data = await getTafsir(surahNumber, ayahNumber, tafsirSource);
      
      if (data && data.tafsirText) {
        setCurrentAyah(prev => prev ? { ...prev, tafsirText: data.tafsirText } : null);
      } else {
        setError('لم يتم العثور على تفسير لهذه الآية.');
      }
    } catch (err) {
      console.error('خطأ في تحميل التفسير:', err);
      setError('حدث خطأ أثناء تحميل التفسير. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  }, [tafsirSource]);

  // إغلاق نافذة التفسير
  const closeTafsir = useCallback(() => {
    setIsOpen(false);
    setCurrentAyah(null);
  }, []);

  // تغيير مصدر التفسير
  const changeTafsirSource = useCallback(async (newSource: string) => {
    setTafsirSource(newSource);
    
    if (currentAyah) {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getTafsir(currentAyah.surahNumber, currentAyah.ayahNumber, newSource);
        
        if (data && data.tafsirText) {
          setCurrentAyah(prev => prev ? { ...prev, tafsirText: data.tafsirText } : null);
        } else {
          setError('لم يتم العثور على تفسير لهذه الآية.');
        }
      } catch (err) {
        console.error('خطأ في تحميل التفسير:', err);
        setError('حدث خطأ أثناء تحميل التفسير. يرجى المحاولة مرة أخرى.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentAyah]);

  return {
    isOpen,
    isLoading,
    error,
    currentAyah,
    tafsirSource,
    openTafsir,
    closeTafsir,
    changeTafsirSource
  };
}