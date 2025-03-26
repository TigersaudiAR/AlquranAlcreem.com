import React, { useRef, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  isPlaying: boolean;
  progress: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

const AudioPlayer = ({
  isPlaying,
  progress,
  duration,
  onPlay,
  onPause,
  onStop
}: AudioPlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  
  // تنسيق الوقت من ثوانٍ إلى mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // معالجة النقر خارج مشغل الصوت
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playerRef.current && !playerRef.current.contains(event.target as Node)) {
        // يمكن إضافة منطق هنا إذا كنت ترغب في القيام بشيء عند النقر خارج المشغل
        // مثل إغلاق مؤثرات أو قوائم
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div 
      ref={playerRef}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-md p-3 z-50"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex gap-2">
          {isPlaying ? (
            <Button 
              className="bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
              onClick={onPause}
            >
              <Pause size={16} />
            </Button>
          ) : (
            <Button 
              className="bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
              onClick={onPlay}
            >
              <Play size={16} />
            </Button>
          )}
          
          <Button 
            className="bg-gray-600 hover:bg-gray-700 text-white"
            size="sm"
            onClick={onStop}
          >
            <Square size={16} />
          </Button>
        </div>
        
        <div className="flex-1 mx-4">
          <Slider
            defaultValue={[0]}
            value={[progress]} 
            max={duration || 100}
            step={0.1}
            disabled // لتلاوة القرآن، نجعل شريط التقدم معروضًا فقط ولا يمكن التفاعل معه
          />
        </div>
        
        <div className="text-sm">
          <span className="text-gray-700 dark:text-gray-300">
            {formatTime(progress)} / {formatTime(duration || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;