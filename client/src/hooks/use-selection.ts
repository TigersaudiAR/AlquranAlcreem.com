import { useState, useCallback, useEffect } from 'react';

// واجهة لموضع النص المحدد
interface SelectionPosition {
  x: number;
  y: number;
}

export function useSelection() {
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionMenuVisible, setSelectionMenuVisible] = useState<boolean>(false);
  const [selectionPosition, setSelectionPosition] = useState<SelectionPosition>({ x: 0, y: 0 });
  
  // معالج تحديد النص
  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    
    if (selection && selection.toString().trim().length > 0) {
      const text = selection.toString().trim();
      setSelectedText(text);
      
      // الحصول على موضع التحديد
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // تحديد موضع قائمة التحديد (فوق النص المحدد)
      setSelectionPosition({
        x: rect.left + rect.width / 2,
        y: window.scrollY + rect.top - 10
      });
      
      setSelectionMenuVisible(true);
    } else {
      setSelectionMenuVisible(false);
    }
  }, []);
  
  // إخفاء قائمة التحديد عند النقر في مكان آخر
  const hideSelectionMenu = useCallback(() => {
    setSelectionMenuVisible(false);
  }, []);
  
  // إنشاء مستمعي الأحداث
  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('mousedown', hideSelectionMenu);
    
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('mousedown', hideSelectionMenu);
    };
  }, [handleSelection, hideSelectionMenu]);
  
  return {
    selectedText,
    selectionMenuVisible,
    selectionPosition,
    setSelectionMenuVisible
  };
}