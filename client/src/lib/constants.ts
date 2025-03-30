/**
 * ثوابت التطبيق
 */

// تكوين عام للتطبيق
export const APP_CONFIG = {
  APP_NAME: 'القرآن التعليمي',
  APP_DESCRIPTION: 'تطبيق القرآن الكريم للتعلم والتدبر',
  DEFAULT_LANGUAGE: 'ar',
  API_BASE_URL: 'https://api.quran.com/api/v4',
  AUDIO_BASE_URL: 'https://verses.quran.com',
  DEFAULT_RECITER: 'ar.alafasy',
  DEFAULT_TRANSLATION: 'ar.muyassar',
  DEFAULT_TAFSIR: 'ar-tafsir-al-jalalayn',
  PAGE_SIZE: 10,
  VERSES_PER_PAGE: 10,
  THEME_COLOR: '#F59E0B', // Amber-500
};

// القراء المتاحون
export const RECITERS = [
  { id: 'ar.alafasy', name: 'مشاري راشد العفاسي' },
  { id: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد (مرتل)' },
  { id: 'ar.abdullahbasfar', name: 'عبد الله بصفر' },
  { id: 'ar.abdurrahmaansudais', name: 'عبد الرحمن السديس' },
  { id: 'ar.hanirifai', name: 'هاني الرفاعي' },
  { id: 'ar.husary', name: 'محمود خليل الحصري' },
  { id: 'ar.husarymujawwad', name: 'محمود خليل الحصري (مجود)' },
  { id: 'ar.mahermuaiqly', name: 'ماهر المعيقلي' },
  { id: 'ar.minshawi', name: 'محمد صديق المنشاوي' },
  { id: 'ar.muhammadayyoub', name: 'محمد أيوب' },
  { id: 'ar.muhammadjibreel', name: 'محمد جبريل' },
];

// اللغات المتاحة للترجمة
export const LANGUAGES = [
  { id: 'ar', name: 'العربية', direction: 'rtl' },
  { id: 'en', name: 'English', direction: 'ltr' },
  { id: 'fr', name: 'Français', direction: 'ltr' },
  { id: 'tr', name: 'Türkçe', direction: 'ltr' },
  { id: 'ur', name: 'اردو', direction: 'rtl' },
  { id: 'id', name: 'Bahasa Indonesia', direction: 'ltr' },
];

// كتب الحديث المتاحة
export const HADITH_BOOKS = [
  { id: 'bukhari', name: 'صحيح البخاري', total: 7563 },
  { id: 'muslim', name: 'صحيح مسلم', total: 7563 },
  { id: 'tirmidhi', name: 'جامع الترمذي', total: 3891 },
  { id: 'abudawud', name: 'سنن أبي داود', total: 5274 },
  { id: 'nasai', name: 'سنن النسائي', total: 5662 },
  { id: 'ibnmajah', name: 'سنن ابن ماجه', total: 4341 },
  { id: 'malik', name: 'موطأ مالك', total: 1594 },
  { id: 'riyadussalihin', name: 'رياض الصالحين', total: 1896 },
];

// مصادر التفسير المتاحة
export const TAFSIR_SOURCES = [
  { id: 'ar-tafsir-al-jalalayn', name: 'تفسير الجلالين' },
  { id: 'ar-tafsir-ibn-kathir', name: 'تفسير ابن كثير' },
  { id: 'ar-tafsir-al-qurtubi', name: 'تفسير القرطبي' },
  { id: 'ar-tafsir-al-tabari', name: 'تفسير الطبري' },
  { id: 'ar-tafsir-al-baghawi', name: 'تفسير البغوي' },
  { id: 'ar-tafsir-al-saadi', name: 'تفسير السعدي' },
  { id: 'ar-tafsir-al-waseet', name: 'التفسير الوسيط' },
  { id: 'en-tafsir-ibn-kathir', name: 'Ibn Kathir (English)' },
];

// أسماء السور العربية
export const SURAH_NAMES = [
  'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف',
  'الأنفال', 'التوبة', 'يونس', 'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر',
  'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه', 'الأنبياء', 'الحج', 'المؤمنون',
  'النور', 'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم', 'لقمان',
  'السجدة', 'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر',
  'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح',
  'الحجرات', 'ق', 'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة',
  'الحديد', 'المجادلة', 'الحشر', 'الممتحنة', 'الصف', 'الجمعة', 'المنافقون',
  'التغابن', 'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج', 'نوح',
  'الجن', 'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ',
  'النازعات', 'عبس', 'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج',
  'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد', 'الشمس', 'الليل', 'الضحى',
  'الشرح', 'التين', 'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات',
  'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل', 'قريش', 'الماعون',
  'الكوثر', 'الكافرون', 'النصر', 'المسد', 'الإخلاص', 'الفلق', 'الناس'
];