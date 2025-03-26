import { useState, useEffect, useRef } from 'react';

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
  const [volume, setVolume] = useState(1);
  const [repeat, setRepeat] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Click outside volume slider to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(event.target as Node)) {
        setShowVolumeSlider(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-800 p-3 rounded-lg mt-4">
      <div className="flex items-center gap-2">
        {!isPlaying ? (
          <button 
            className="p-2 rounded-full bg-primary text-white hover:bg-opacity-90"
            onClick={onPlay}
          >
            <i className="fas fa-play"></i>
          </button>
        ) : (
          <button 
            className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
            onClick={onPause}
          >
            <i className="fas fa-pause"></i>
          </button>
        )}
        <button 
          className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
          onClick={onStop}
        >
          <i className="fas fa-stop"></i>
        </button>
      </div>
      
      <div className="flex-1 mx-4">
        <div className="relative">
          <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${(progress / duration) * 100 || 0}%` }}
            ></div>
          </div>
          <div 
            className="absolute -top-1 right-0 w-4 h-4 bg-primary rounded-full shadow" 
            style={{ right: `${(progress / duration) * 100 || 0}%`, transform: 'translateX(50%)' }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative" ref={volumeRef}>
          <button 
            className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          >
            {volume > 0.5 ? (
              <i className="fas fa-volume-high"></i>
            ) : volume > 0 ? (
              <i className="fas fa-volume-low"></i>
            ) : (
              <i className="fas fa-volume-xmark"></i>
            )}
          </button>
          
          {showVolumeSlider && (
            <div className="absolute bottom-full right-0 mb-2 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24"
              />
            </div>
          )}
        </div>
        
        <button 
          className={`p-2 rounded-full ${repeat ? 'bg-primary text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'}`}
          onClick={() => setRepeat(!repeat)}
        >
          <i className="fas fa-repeat"></i>
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
