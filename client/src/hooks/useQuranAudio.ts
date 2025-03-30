import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * خطاف للتحكم في تشغيل تلاوة آيات القرآن الكريم
 * يوفر وظائف التشغيل والإيقاف المؤقت وتتبع الآية الحالية
 * @param reciterId معرف القارئ المطلوب (مثل ar.alafasy)
 */
export function useQuranAudio(reciterId: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [currentVerse, setCurrentVerse] = useState<{ surah: number; verse: number } | null>(null);
  const [nextVerse, setNextVerse] = useState<{ surah: number; verse: number } | null>(null);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);

  // إنشاء عنصر صوت جديد عند تغيير القارئ
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
      
      const handleEnded = () => {
        setIsPlaying(false);
      };
      
      const handleError = (error: Event) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      };
      
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [reciterId]);

  // إنشاء عنصر صوت للتحميل المسبق للآية التالية
  useEffect(() => {
    if (!nextAudioRef.current) {
      nextAudioRef.current = new Audio();
      nextAudioRef.current.preload = 'auto';
      
      return () => {
        if (nextAudioRef.current) {
          nextAudioRef.current.src = '';
          nextAudioRef.current = null;
        }
      };
    }
  }, []);

  /**
   * تعيين مصدر الصوت وبيانات الآية
   * @param src رابط ملف الصوت
   * @param surahNumber رقم السورة
   * @param verseNumber رقم الآية
   */
  const setAudioSrc = useCallback((src: string, surahNumber: number, verseNumber: number) => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.volume = volume;
      setCurrentSrc(src);
      setCurrentVerse({ surah: surahNumber, verse: verseNumber });
    }
  }, [volume]);

  /**
   * تعيين مصدر الصوت التالي للتحميل المسبق
   * @param src رابط ملف الصوت التالي
   * @param surahNumber رقم السورة
   * @param verseNumber رقم الآية
   */
  const setNextAudioSrc = useCallback((src: string, surahNumber: number, verseNumber: number) => {
    if (nextAudioRef.current) {
      nextAudioRef.current.src = src;
      nextAudioRef.current.volume = volume;
      setNextVerse({ surah: surahNumber, verse: verseNumber });
    }
  }, [volume]);

  /**
   * تشغيل المقطع الصوتي الحالي
   */
  const play = useCallback(() => {
    if (audioRef.current && currentSrc) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Failed to play audio:', error);
            setIsPlaying(false);
          });
      }
    }
  }, [currentSrc]);

  /**
   * إيقاف التشغيل مؤقتًا
   */
  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  /**
   * الانتقال إلى الآية التالية
   */
  const playNextVerse = useCallback(() => {
    if (nextAudioRef.current && nextVerse) {
      // تبديل العناصر الصوتية
      const tempAudio = audioRef.current;
      audioRef.current = nextAudioRef.current;
      nextAudioRef.current = tempAudio;
      
      // تحديث الحالة
      setCurrentSrc(audioRef.current.src);
      setCurrentVerse(nextVerse);
      setNextVerse(null);
      
      // تشغيل الصوت الجديد
      play();
    }
  }, [nextVerse, play]);

  /**
   * ضبط مستوى الصوت
   * @param volume مستوى الصوت (0-1)
   */
  const setAudioVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    
    if (nextAudioRef.current) {
      nextAudioRef.current.volume = clampedVolume;
    }
  }, []);

  return {
    isPlaying,
    currentVerse,
    currentSrc,
    play,
    pause,
    setAudioSrc,
    setNextAudioSrc,
    playNextVerse,
    setVolume: setAudioVolume,
    currentAudioElement: audioRef.current
  };
}
import { useState, useEffect, useRef } from 'react';

export const useQuranAudio = (surahNumber: number, reciter: string) => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentVerse, setCurrentVerse] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Get audio element
    audioRef.current = document.getElementById('quran-audio') as HTMLAudioElement;
    
    // Set up event listeners
    if (audioRef.current) {
      audioRef.current.onended = handleVerseEnd;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.onended = null;
      }
    };
  }, []);

  useEffect(() => {
    // When surah number or reciter changes, reset audio
    setIsPlaying(false);
    setCurrentVerse(1);
    updateAudioSource(1);
  }, [surahNumber, reciter]);

  useEffect(() => {
    // When current verse changes, update audio source
    updateAudioSource(currentVerse);
  }, [currentVerse]);

  const updateAudioSource = (verseNumber: number) => {
    // Format: https://verses.quran.com/[reciter]/[surahNumber]_[verseNumber].mp3
    // Example: https://verses.quran.com/ar.alafasy/1_1.mp3
    const newUrl = `https://verses.quran.com/${reciter}/${surahNumber}_${verseNumber}.mp3`;
    setAudioUrl(newUrl);
    
    if (audioRef.current) {
      audioRef.current.src = newUrl;
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleVerseEnd = () => {
    // Automatically move to next verse when current verse ends
    if (currentVerse < 286) { // Arbitrary large number, will be limited by actual surah length
      setCurrentVerse(currentVerse + 1);
    } else {
      setIsPlaying(false);
    }
  };

  return {
    audioUrl,
    isPlaying,
    togglePlay,
    currentVerse,
    setCurrentVerse
  };
};
