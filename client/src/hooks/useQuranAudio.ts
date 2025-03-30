
import { useState, useEffect, useRef } from 'react';

/**
 * Hook for basic Quran audio functionality with a simple reciter ID
 */
export function useQuranAudioBasic(reciterId: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [currentSurah, setCurrentSurah] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  const playAudio = (surahNumber: number) => {
    setIsLoading(true);
    setError(null);

    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
    }

    // Format surah number with leading zeros
    const formattedSurah = surahNumber.toString().padStart(3, '0');
    const audioUrl = `https://download.quranicaudio.com/quran/${reciterId}/${formattedSurah}.mp3`;

    const audio = new Audio(audioUrl);
    audio.onloadeddata = () => {
      setIsLoading(false);
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setError('فشل في تشغيل الصوت. يرجى المحاولة مرة أخرى.');
        setIsLoading(false);
      });
    };

    audio.onerror = () => {
      setError('فشل في تحميل الصوت. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.');
      setIsLoading(false);
    };

    audio.onplaying = () => {
      setIsPlaying(true);
      setCurrentSurah(surahNumber);
    };

    audio.onpause = () => {
      setIsPlaying(false);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentSurah(null);
    };

    setCurrentAudio(audio);
  };

  const pauseAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
    }
  };

  const resumeAudio = () => {
    if (currentAudio) {
      currentAudio.play().catch(err => {
        console.error('Error resuming audio:', err);
        setError('فشل في استئناف التشغيل.');
      });
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentSurah(null);
    }
  };

  return {
    isPlaying,
    isLoading,
    error,
    currentSurah,
    playAudio,
    pauseAudio,
    resumeAudio,
    stopAudio
  };
}

/**
 * Enhanced hook for Quran audio with advanced features
 */
export const useQuranAudio = (surahNumber: number, reciter: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    const handleError = () => {
      setError('حدث خطأ أثناء تحميل الصوت');
      setIsLoading(false);
    };

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, []);

  useEffect(() => {
    loadAudio();
  }, [surahNumber, reciter]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const loadAudio = () => {
    if (!audioRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    const formattedSurah = surahNumber.toString().padStart(3, '0');
    const audioUrl = `https://download.quranicaudio.com/quran/${reciter}/${formattedSurah}.mp3`;
    
    audioRef.current.src = audioUrl;
    audioRef.current.load();
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setError('فشل في تشغيل الصوت');
      });
    }
  };

  const seek = (newTime: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress((newTime / duration) * 100);
  };

  const seekByPercentage = (percentage: number) => {
    if (!audioRef.current || !duration) return;
    
    const newTime = (percentage / 100) * duration;
    seek(newTime);
  };

  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
  };

  return {
    isPlaying,
    isLoading,
    progress,
    duration,
    currentTime,
    error,
    volume,
    togglePlay,
    seek,
    seekByPercentage,
    changeVolume
  };
};
