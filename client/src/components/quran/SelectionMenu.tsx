import React, { useState, useEffect, useRef } from 'react';
import { Copy, Share, BookmarkPlus, ExternalLink } from 'lucide-react';

interface SelectionMenuProps {
  onCopy: () => void;
  onShare: () => void;
  onBookmark: () => void;
  onView: () => void;
  visible: boolean;
  position: { x: number; y: number };
}

/**
 * قائمة تظهر عند تحديد النص في المصحف
 */
export default function SelectionMenu({ 
  onCopy, 
  onShare, 
  onBookmark, 
  onView,
  visible, 
  position 
}: SelectionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // ضبط موقع القائمة لتظل داخل الشاشة
  const adjustMenuPosition = () => {
    if (!menuRef.current || !visible) return { x: position.x, y: position.y };
    
    const menuRect = menuRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let x = position.x;
    let y = position.y;
    
    // تعديل موقع X إذا كانت القائمة ستتجاوز حدود النافذة
    if (x + menuRect.width > windowWidth) {
      x = windowWidth - menuRect.width - 10;
    }
    
    // تعديل موقع Y إذا كانت القائمة ستتجاوز الحد السفلي للنافذة
    if (y + menuRect.height > windowHeight) {
      y = windowHeight - menuRect.height - 10;
    }
    
    return { x, y };
  };
  
  const adjustedPosition = adjustMenuPosition();
  
  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // يمكن إضافة وظيفة لإخفاء القائمة هنا إذا لزم الأمر
      }
    };
    
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <div 
      ref={menuRef}
      className="selection-menu absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-amber-200 dark:border-gray-700 py-1 z-50"
      style={{
        top: `${adjustedPosition.y}px`,
        left: `${adjustedPosition.x}px`,
        direction: 'rtl'
      }}
    >
      <button 
        onClick={onCopy}
        className="flex items-center w-full px-4 py-2 text-sm text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Copy className="ml-2 h-4 w-4" />
        نسخ النص
      </button>
      <button 
        onClick={onShare}
        className="flex items-center w-full px-4 py-2 text-sm text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Share className="ml-2 h-4 w-4" />
        مشاركة
      </button>
      <button 
        onClick={onBookmark}
        className="flex items-center w-full px-4 py-2 text-sm text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors"
      >
        <BookmarkPlus className="ml-2 h-4 w-4" />
        إضافة إشارة مرجعية
      </button>
      <button 
        onClick={onView}
        className="flex items-center w-full px-4 py-2 text-sm text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors"
      >
        <ExternalLink className="ml-2 h-4 w-4" />
        عرض التفسير
      </button>
    </div>
  );
}