import { useState, useEffect, useRef, useCallback } from 'react';
import { APP_CONFIG } from '../lib/constants';

export function useQuranAudio(reciterId: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [ayahIds, setAyahIds] = useState<string[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    // Set up event listeners
    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener('loadedmetadata', updateDuration);
    audioRef.current.addEventListener('ended', handleAudioEnd);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('loadedmetadata', updateDuration);
        audioRef.current.removeEventListener('ended', handleAudioEnd);
        audioRef.current.pause();
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Update duration when audio is loaded
  const updateDuration = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  // Update progress during playback
  const updateProgress = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };
  
  // Handle audio end event
  const handleAudioEnd = () => {
    if (currentAyahIndex < ayahIds.length - 1) {
      // Play next ayah
      setCurrentAyahIndex(currentAyahIndex + 1);
    } else {
      // End of playlist
      setIsPlaying(false);
      setProgress(0);
      setCurrentAyahIndex(0);
    }
  };
  
  // Effect to load and play audio when currentAyahIndex changes
  useEffect(() => {
    if (ayahIds.length > 0 && isPlaying) {
      const ayahId = ayahIds[currentAyahIndex];
      const [surahNumber, ayahNumber] = ayahId.split(':').map(Number);
      
      // Construct audio URL
      const audioUrl = `${APP_CONFIG.audioBaseURL}${reciterId}/${surahNumber}/${ayahNumber}.mp3`;
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentAyahIndex, isPlaying, ayahIds, reciterId]);
  
  // Start recitation
  const startRecitation = useCallback((newAyahIds: string[]) => {
    setAyahIds(newAyahIds);
    setCurrentAyahIndex(0);
    setIsPlaying(true);
  }, []);
  
  // Pause recitation
  const pauseRecitation = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);
  
  // Stop recitation
  const stopRecitation = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
    setCurrentAyahIndex(0);
  }, []);
  
  return {
    audioState: {
      currentAyahIndex,
      totalAyahs: ayahIds.length
    },
    isPlaying,
    progress,
    duration,
    startRecitation,
    pauseRecitation,
    stopRecitation
  };
}
