import { useState, useRef, useEffect } from 'react';

/**
 * خطاف للتحكم في تشغيل تلاوة آيات القرآن الكريم
 * يوفر وظائف التشغيل والإيقاف المؤقت وتتبع الآية الحالية
 * @param reciterId معرف القارئ المطلوب (مثل ar.alafasy)
 */
export function useQuranAudio(reciterId: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrcState] = useState<string | null>(null);
  const [currentVerse, setCurrentVerse] = useState<{ surah: number; verse: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioSrcRef = useRef<string | null>(null);
  const nextVerseRef = useRef<{ surah: number; verse: number } | null>(null);

  // إنشاء عنصر الصوت عند تحميل المكون
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      nextAudioRef.current = new Audio();
      
      const handleError = (error: Event) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      };
      
      audioRef.current.addEventListener('error', handleError);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('error', handleError);
        }
        if (nextAudioRef.current) {
          nextAudioRef.current.pause();
        }
      };
    }
  }, []);

  // تبديل القارئ عند تغيير معرف القارئ
  useEffect(() => {
    if (currentVerse && audioSrc) {
      // إذا تم تغيير القارئ أثناء التشغيل، نقوم بإعادة تحميل المقطع الصوتي
      const newAudioSrc = audioSrc.replace(/\/([^/]+)\/\d+\/\d+/, `/${reciterId}/$1/$2`);
      setAudioSrc(newAudioSrc, currentVerse.surah, currentVerse.verse);
    }
  }, [reciterId, currentVerse, audioSrc]);

  /**
   * تعيين مصدر الصوت وبيانات الآية
   * @param src رابط ملف الصوت
   * @param surahNumber رقم السورة
   * @param verseNumber رقم الآية
   */
  const setAudioSrc = (src: string, surahNumber: number, verseNumber: number) => {
    if (!audioRef.current) return;
    
    setAudioSrcState(src);
    setCurrentVerse({ surah: surahNumber, verse: verseNumber });
    
    // تعيين المصدر وتحميل الملف الصوتي
    audioRef.current.src = src;
    audioRef.current.load();
  };

  /**
   * تعيين مصدر الصوت التالي للتحميل المسبق
   * @param src رابط ملف الصوت التالي
   * @param surahNumber رقم السورة
   * @param verseNumber رقم الآية
   */
  const preloadNextAudio = (src: string, surahNumber: number, verseNumber: number) => {
    if (!nextAudioRef.current) return;
    
    nextAudioSrcRef.current = src;
    nextVerseRef.current = { surah: surahNumber, verse: verseNumber };
    
    // تعيين المصدر وتحميل الملف الصوتي التالي مسبقًا
    nextAudioRef.current.src = src;
    nextAudioRef.current.load();
  };

  /**
   * تشغيل المقطع الصوتي الحالي
   */
  const play = () => {
    if (!audioRef.current || !audioSrc) return;
    
    // وعد للتأكد من بدء التشغيل حتى في حالة عدم اكتمال التحميل
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
    }
  };

  /**
   * إيقاف التشغيل مؤقتًا
   */
  const pause = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  };

  /**
   * الانتقال إلى الآية التالية
   */
  const playNextVerse = () => {
    if (!nextAudioRef.current || !nextAudioSrcRef.current || !nextVerseRef.current) return;
    
    // تبديل عناصر الصوت
    const tempAudio = audioRef.current;
    audioRef.current = nextAudioRef.current;
    nextAudioRef.current = tempAudio;
    
    // تحديث الحالة
    setAudioSrcState(nextAudioSrcRef.current);
    setCurrentVerse(nextVerseRef.current);
    
    // تشغيل الآية التالية
    play();
  };

  /**
   * ضبط مستوى الصوت
   * @param volume مستوى الصوت (0-1)
   */
  const setVolume = (volume: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = Math.max(0, Math.min(1, volume));
  };

  return {
    play,
    pause,
    isPlaying,
    currentVerse,
    audioSrc,
    setAudioSrc,
    preloadNextAudio,
    playNextVerse,
    setVolume,
    currentAudioElement: audioRef.current
  };
}