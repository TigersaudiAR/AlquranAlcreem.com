import { useState, useEffect, useRef } from 'react';

interface HighlightOptions {
  duration?: number;
  highlightColor?: string;
  scrollBehavior?: ScrollBehavior;
  scrollOffset?: number;
}

/**
 * خطاف لإضافة تأثيرات إبراز الآيات مع التمرير التلقائي
 * يستخدم في تحديد الآية الحالية أثناء القراءة أو الاستماع
 */
export function useHighlightAnimation() {
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // تنظيف المؤقت عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // إزالة التأثيرات السابقة قبل إضافة تأثير جديد
  const clearPreviousHighlight = () => {
    if (highlightedElement) {
      highlightedElement.style.removeProperty('transition');
      highlightedElement.style.removeProperty('background-color');
      highlightedElement.style.removeProperty('box-shadow');
      setHighlightedElement(null);
    }
  };

  /**
   * تحديد عنصر مع تأثير رسومي وتمرير تلقائي
   * @param element العنصر المراد إبرازه
   * @param options خيارات الإبراز والتمرير
   */
  const highlightElement = (element: HTMLElement | null, options: HighlightOptions = {}) => {
    // إذا كان العنصر غير موجود، لا نفعل شيئًا
    if (!element) return;

    const {
      duration = 2000,
      highlightColor = 'rgba(255, 193, 7, 0.2)',
      scrollBehavior = 'smooth',
      scrollOffset = 100
    } = options;

    // إزالة أي تأثيرات سابقة
    clearPreviousHighlight();

    // حفظ العنصر الحالي
    setHighlightedElement(element);
    setIsAnimating(true);

    // التمرير إلى العنصر (مع مراعاة الإزاحة)
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
    
    window.scrollTo({
      top: middle - scrollOffset,
      behavior: scrollBehavior
    });

    // إضافة تأثيرات الإبراز
    element.style.transition = `background-color 0.5s ease-in-out, box-shadow 0.5s ease-in-out`;
    element.style.backgroundColor = highlightColor;
    element.style.boxShadow = `0 0 10px ${highlightColor}`;

    // إزالة التأثيرات بعد انتهاء المدة المحددة
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      if (element) {
        element.style.transition = `background-color 0.5s ease-out, box-shadow 0.5s ease-out`;
        element.style.backgroundColor = 'transparent';
        element.style.boxShadow = 'none';
        setIsAnimating(false);
      }
    }, duration);
  };

  return {
    highlightElement,
    clearHighlight: clearPreviousHighlight,
    isAnimating,
    currentHighlightedElement: highlightedElement
  };
}