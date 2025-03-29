/**
 * ثوابت التطبيق
 */

export const APP_CONFIG = {
  APP_NAME: 'القرآن التعليمي',
  BASE_API_URL: 'https://api.alquran.cloud/v1',
  TAFSIR_API_URL: 'https://quranenc.com/api/v1/translation',
  PRAYER_API_URL: 'https://api.aladhan.com/v1',
  HADITH_API_URL: 'https://api.hadith.gading.dev',
  VERSION: '1.0.0',
  TOTAL_PAGES: 604,
  TOTAL_SURAHS: 114,
  TOTAL_JUZ: 30
};

export const RECITERS = [
  { id: 'ar.alafasy', name: 'مشاري العفاسي' },
  { id: 'ar.husary', name: 'محمود خليل الحصري' },
  { id: 'ar.minshawi', name: 'محمد صديق المنشاوي' },
  { id: 'ar.abdulbasit', name: 'عبد الباسط عبد الصمد' },
  { id: 'ar.abdullahbasfar', name: 'عبد الله بصفر' },
  { id: 'ar.shaatree', name: 'أبو بكر الشاطري' },
  { id: 'ar.ahmedajamy', name: 'أحمد بن علي العجمي' },
  { id: 'ar.mahermuaiqly', name: 'ماهر المعيقلي' },
  { id: 'ar.muhammadayyoub', name: 'محمد أيوب' },
  { id: 'ar.muhammadjibreel', name: 'محمد جبريل' }
];

export const LANGUAGES = [
  { id: 'ar', name: 'العربية' },
  { id: 'en', name: 'English' },
  { id: 'fr', name: 'Français' },
  { id: 'tr', name: 'Türkçe' },
  { id: 'id', name: 'Bahasa Indonesia' },
  { id: 'fa', name: 'فارسی' },
  { id: 'ur', name: 'اردو' },
];

export const HADITH_BOOKS = [
  { id: 'bukhari', name: 'صحيح البخاري' },
  { id: 'muslim', name: 'صحيح مسلم' },
  { id: 'abudawud', name: 'سنن أبي داود' },
  { id: 'tirmidhi', name: 'جامع الترمذي' },
  { id: 'nasai', name: 'سنن النسائي' },
  { id: 'ibnmajah', name: 'سنن ابن ماجه' },
  { id: 'malik', name: 'موطأ مالك' },
  { id: 'ahmad', name: 'مسند أحمد' }
];

export const TAFSIR_SOURCES = [
  { id: 'ar-tafsir-al-jalalayn', name: 'تفسير الجلالين' },
  { id: 'ar-tafsir-ibn-kathir', name: 'تفسير ابن كثير' },
  { id: 'ar-tafseer-al-sadi', name: 'تفسير السعدي' },
  { id: 'ar-tafsir-al-tabari', name: 'تفسير الطبري' },
  { id: 'ar-tafsir-al-qurtubi', name: 'تفسير القرطبي' },
  { id: 'en-tafsir-ibn-kathir', name: 'Ibn Kathir (English)' },
  { id: 'ur-tafsir-ibn-kathir', name: 'ابن کثیر (اردو)' }
];

export const SURAH_NAMES = [
  'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال',
  'التوبة', 'يونس', 'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل', 'الإسراء',
  'الكهف', 'مريم', 'طه', 'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان', 'الشعراء',
  'النمل', 'القصص', 'العنكبوت', 'الروم', 'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر',
  'يس', 'الصافات', 'ص', 'الزمر', 'غافر', 'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية',
  'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق', 'الذاريات', 'الطور', 'النجم', 'القمر',
  'الرحمن', 'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة', 'الصف', 'الجمعة',
  'المنافقون', 'التغابن', 'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج',
  'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات',
  'عبس', 'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج', 'الطارق', 'الأعلى',
  'الغاشية', 'الفجر', 'البلد', 'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق',
  'القدر', 'البينة', 'الزلزلة', 'العاديات', 'القارعة', 'التكاثر', 'العصر', 'الهمزة',
  'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر', 'المسد', 'الإخلاص', 'الفلق', 'الناس'
];