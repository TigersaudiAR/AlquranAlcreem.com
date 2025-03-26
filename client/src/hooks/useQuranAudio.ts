import { useState, useEffect, useRef } from 'react';

export function useQuranAudio(reciterId: string) {
  const [audioState, setAudioState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [ayahQueue, setAyahQueue] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  
  // تهيئة عنصر الصوت
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
      
      // استماع لأحداث الصوت
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audioRef.current.removeEventListener('ended', handleEnded);
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.pause();
        }
        
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, []);
  
  // عند تحميل بيانات الصوت
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  // عند انتهاء تشغيل الآية
  const handleEnded = () => {
    // انتقل إلى الآية التالية
    if (currentAyahIndex < ayahQueue.length - 1) {
      setCurrentAyahIndex(prevIndex => prevIndex + 1);
    } else {
      // توقف عند انتهاء كل الآيات
      stopRecitation();
    }
  };
  
  // معالجة الأخطاء
  const handleError = (error: Event) => {
    console.error('Audio playback error:', error);
    stopRecitation();
  };
  
  // تحديث مسار الصوت عند تغيير الآية أو القارئ
  useEffect(() => {
    if (audioState === 'playing' && ayahQueue.length > 0 && currentAyahIndex < ayahQueue.length) {
      const ayahId = ayahQueue[currentAyahIndex];
      if (audioRef.current) {
        const [surahNumber, ayahNumber] = ayahId.split(':');
        
        // تكوين رابط الصوت بناءً على القارئ والسورة والآية
        const audioUrl = getAudioUrl(reciterId, surahNumber, ayahNumber);
        
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        audioRef.current.play()
          .catch(error => {
            console.error('Failed to play audio:', error);
          });
      }
    }
  }, [currentAyahIndex, ayahQueue, reciterId, audioState]);
  
  // تحديث التقدم
  useEffect(() => {
    if (audioState === 'playing') {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      progressIntervalRef.current = window.setInterval(() => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
        }
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [audioState]);
  
  // بدء التلاوة
  const startRecitation = (ayahIds: string[]) => {
    setAyahQueue(ayahIds);
    setCurrentAyahIndex(0);
    setAudioState('playing');
  };
  
  // إيقاف التلاوة مؤقتًا
  const pauseRecitation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setAudioState('paused');
  };
  
  // استئناف التلاوة
  const resumeRecitation = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .catch(error => {
          console.error('Failed to resume audio:', error);
        });
    }
    setAudioState('playing');
  };
  
  // إيقاف التلاوة تمامًا
  const stopRecitation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setProgress(0);
    setAudioState('idle');
    setCurrentAyahIndex(0);
  };
  
  // الحصول على رابط صوت الآية
  const getAudioUrl = (reciter: string, surah: string, ayah: string) => {
    return `https://verses.quran.com/${reciter}/${surah}/${ayah}.mp3`;
  };
  
  return {
    audioState,
    currentAyahIndex,
    isPlaying: audioState === 'playing',
    progress,
    duration,
    startRecitation,
    pauseRecitation: audioState === 'playing' ? pauseRecitation : resumeRecitation,
    stopRecitation,
  };
}