import React, { useEffect, useRef } from 'react';
import { useHighlightAnimation } from '../../hooks/useHighlightAnimation';
import { motion } from 'framer-motion';

interface HighlightedVerseProps {
  verseText: string;
  verseNumber: number;
  surahNumber: number;
  isActive?: boolean;
  isPlaying?: boolean;
  onClick?: () => void;
  onVerseEnter?: () => void;
  onVerseLeave?: () => void;
  fontSize?: number;
  fontFamily?: string;
  withAnimation?: boolean;
  translation?: string;
}

/**
 * مكوّن عرض الآيات مع تأثيرات الإبراز والرسوم المتحركة
 * يقوم بإبراز الآية الحالية أثناء القراءة أو الاستماع
 */
const HighlightedVerse: React.FC<HighlightedVerseProps> = ({
  verseText,
  verseNumber,
  surahNumber,
  isActive = false,
  isPlaying = false,
  onClick,
  onVerseEnter,
  onVerseLeave,
  fontSize = 24,
  fontFamily = 'HafsSmart',
  withAnimation = true,
  translation
}) => {
  const verseRef = useRef<HTMLDivElement>(null);
  const { highlightElement, clearHighlight } = useHighlightAnimation();
  
  // تفعيل تأثير الإبراز عندما تكون الآية نشطة
  useEffect(() => {
    if (isActive && withAnimation && verseRef.current) {
      highlightElement(verseRef.current, {
        duration: isPlaying ? 3000 : 1500,
        highlightColor: isPlaying 
          ? 'rgba(255, 193, 7, 0.3)' 
          : 'rgba(255, 193, 7, 0.15)'
      });
    } else if (!isActive && verseRef.current) {
      clearHighlight();
    }
  }, [isActive, isPlaying, withAnimation, highlightElement, clearHighlight]);

  // تأثيرات الرسوم المتحركة باستخدام framer-motion
  const verseVariants = {
    normal: { 
      scale: 1,
      opacity: 1 
    },
    active: { 
      scale: 1.02,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    playing: {
      scale: [1, 1.01, 1],
      opacity: [1, 1, 1],
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 2
      }
    }
  };

  // تحديد الحالة الحالية للرسوم المتحركة
  const currentState = isPlaying ? 'playing' : isActive ? 'active' : 'normal';
  
  return (
    <motion.div
      ref={verseRef}
      initial="normal"
      animate={currentState}
      variants={verseVariants}
      className={`verse-container p-4 rounded-lg mb-3 ${
        isActive ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-white dark:bg-gray-800'
      } cursor-pointer transition-all duration-300 ease-in-out hover:bg-amber-50 dark:hover:bg-amber-900/20`}
      onClick={onClick}
      onMouseEnter={onVerseEnter}
      onMouseLeave={onVerseLeave}
      data-surah={surahNumber}
      data-verse={verseNumber}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="verse-number w-8 h-8 flex items-center justify-center bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-full text-sm font-bold">
          {verseNumber}
        </div>
        
        <div className="verse-content flex-1">
          <p 
            className={`verse-text text-right font-${fontFamily}`}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            dir="rtl"
          >
            {verseText}
          </p>
          
          {translation && (
            <p className="verse-translation mt-2 text-gray-600 dark:text-gray-400 text-sm">
              {translation}
            </p>
          )}
        </div>
      </div>
      
      {isPlaying && (
        <div className="audio-indicator mt-2 flex justify-end">
          <div className="flex gap-1 items-center">
            <span className="audio-dot w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="audio-dot w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
            <span className="audio-dot w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HighlightedVerse;