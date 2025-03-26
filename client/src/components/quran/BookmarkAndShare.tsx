import { useState } from 'react';
import { useLocation } from 'wouter';

export default function BookmarkAndShare() {
  const [isBookmarkMenuOpen, setIsBookmarkMenuOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [, location] = useLocation();

  const handleBookmark = () => {
    // حفظ الإشارة المرجعية للموقع الحالي
    const bookmarkData = {
      url: location,
      title: document.title,
      timestamp: new Date().toISOString()
    };

    // حفظ في التخزين المحلي
    const bookmarks = JSON.parse(localStorage.getItem('quran_bookmarks') || '[]');
    bookmarks.push(bookmarkData);
    localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarks));

    setIsBookmarkMenuOpen(false);
    alert('تمت إضافة الإشارة المرجعية بنجاح');
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'whatsapp' | 'copy') => {
    const url = window.location.href;
    const title = document.title;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
        break;
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('تم نسخ الرابط');
        break;
    }

    setIsShareMenuOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          onClick={() => setIsBookmarkMenuOpen(!isBookmarkMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="إضافة إشارة مرجعية"
        >
          <i className="fas fa-bookmark text-primary-600 dark:text-primary-400"></i>
        </button>

        {isBookmarkMenuOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
            <div className="p-2">
              <button
                onClick={handleBookmark}
                className="w-full text-right p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                إضافة إشارة مرجعية
              </button>
              <a
                href="/bookmarks"
                className="block w-full text-right p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                عرض الإشارات المرجعية
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="مشاركة"
        >
          <i className="fas fa-share-alt text-primary-600 dark:text-primary-400"></i>
        </button>

        {isShareMenuOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
            <div className="p-2">
              <button
                onClick={() => handleShare('facebook')}
                className="w-full text-right p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center"
              >
                <i className="fab fa-facebook ml-2 text-blue-600"></i>
                فيسبوك
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-full text-right p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center"
              >
                <i className="fab fa-twitter ml-2 text-blue-400"></i>
                تويتر
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full text-right p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center"
              >
                <i className="fab fa-whatsapp ml-2 text-green-500"></i>
                واتساب
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="w-full text-right p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center"
              >
                <i className="fas fa-link ml-2 text-gray-500"></i>
                نسخ الرابط
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}