import React from 'react';

interface SelectionMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  onCopy: () => void;
  onShare: () => void;
  onBookmark: () => void;
  onView: () => void;
}

/**
 * قائمة الخيارات التي تظهر عند تحديد نص
 * تتيح للمستخدم نسخ النص أو مشاركته أو إضافته للإشارات المرجعية أو عرض التفسير
 */
const SelectionMenu: React.FC<SelectionMenuProps> = ({
  visible,
  position,
  onCopy,
  onShare,
  onBookmark,
  onView
}) => {
  if (!visible) return null;

  // موضع القائمة نسبة إلى موضع النص المحدد
  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    left: position.x,
    top: position.y,
    transform: 'translateX(-50%)',
    zIndex: 1000
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-amber-200 dark:border-amber-900/30 py-1"
      style={menuStyle}
    >
      <div className="flex flex-col divide-y divide-amber-100 dark:divide-gray-700">
        <button
          onClick={onCopy}
          className="px-4 py-2 text-sm hover:bg-amber-50 dark:hover:bg-gray-700 text-amber-900 dark:text-amber-100 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
            <path d="M4 16c0-1.1.9-2 2-2h2"></path>
            <path d="M4 12c0-1.1.9-2 2-2h2"></path>
            <path d="M4 8c0-1.1.9-2 2-2h2"></path>
          </svg>
          نسخ النص
        </button>
        <button
          onClick={onShare}
          className="px-4 py-2 text-sm hover:bg-amber-50 dark:hover:bg-gray-700 text-amber-900 dark:text-amber-100 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          مشاركة
        </button>
        <button
          onClick={onBookmark}
          className="px-4 py-2 text-sm hover:bg-amber-50 dark:hover:bg-gray-700 text-amber-900 dark:text-amber-100 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
          </svg>
          إضافة إشارة مرجعية
        </button>
        <button
          onClick={onView}
          className="px-4 py-2 text-sm hover:bg-amber-50 dark:hover:bg-gray-700 text-amber-900 dark:text-amber-100 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          عرض التفسير
        </button>
      </div>
    </div>
  );
};

export default SelectionMenu;