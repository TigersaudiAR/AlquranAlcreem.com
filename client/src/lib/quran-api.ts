/**
 * واجهة برمجة تطبيقات القرآن الكريم
 * مجموعة من الوظائف للتفاعل مع واجهة برمجة تطبيقات القرآن لجلب البيانات
 */

// استيراد الثوابت
import { APP_CONFIG } from './constants';

// مصدر API الرئيسي
const API_BASE_URL = 'https://api.quran.com/api/v4';
const API_CDN_URL = 'https://cdn.islamic.network/quran';

// أنواع البيانات للواجهة البرمجية
interface ChapterData {
  id: number;
  revelation_place?: string;
  revelation_order?: number;
  bismillah_pre?: boolean;
  name_arabic?: string;
  name_simple?: string;
  name?: string;
  verses_count: number;
  pages?: number[];
  translated_name?: {
    language_name?: string;
    name?: string;
  };
}

/**
 * جلب بيانات سورة محددة
 * @param surahNumber رقم السورة
 * @returns وعد بتفاصيل السورة
 */
export async function getSurah(surahNumber: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/chapters/${surahNumber}?language=ar`);
    if (!response.ok) throw new Error(`فشل جلب بيانات السورة: ${response.statusText}`);
    
    const data = await response.json();
    return data.chapter;
  } catch (error) {
    console.error('خطأ في جلب بيانات السورة:', error);
    throw error;
  }
}

/**
 * جلب قائمة جميع السور مع تنسيق البيانات لتتوافق مع واجهة QuranData
 * @returns وعد بكائن يحتوي على بيانات السور
 */
export async function getSurahs() {
  try {
    const chapters = await getAllSurahs() as ChapterData[];
    
    // تهيئة الكائن الذي سيتم إعادته
    return {
      surahs: {
        list: chapters.map(chapter => ({
          number: chapter.id,
          name: chapter.name_arabic || chapter.name || '',
          englishName: chapter.name_simple || chapter.name || '',
          englishNameTranslation: chapter.translated_name?.name || chapter.name || '',
          numberOfAyahs: chapter.verses_count,
          revelationType: chapter.revelation_place || 'Meccan'
        }))
      }
    };
  } catch (error) {
    console.error('خطأ في جلب وتنسيق بيانات السور:', error);
    throw error;
  }
}

/**
 * جلب قائمة جميع السور (اسم آخر لنفس الوظيفة)
 * @returns وعد بقائمة جميع السور
 */
export async function getAllSurahs() {
  try {
    const response = await fetch(`${API_BASE_URL}/chapters?language=ar`);
    if (!response.ok) throw new Error(`فشل جلب قائمة السور: ${response.statusText}`);
    
    const data = await response.json();
    return data.chapters;
  } catch (error) {
    console.error('خطأ في جلب قائمة السور:', error);
    throw error;
  }
}

/**
 * جلب آيات سورة معينة
 * @param surahNumber رقم السورة
 * @param options خيارات إضافية مثل الترجمة والصفحة
 * @returns وعد بآيات السورة
 */
export async function getSurahVerses(
  surahNumber: number, 
  options: { 
    translationId?: string; 
    page?: number; 
    perPage?: number; 
    wordByWord?: boolean;
  } = {}
) {
  try {
    const { translationId, page = 1, perPage = 50, wordByWord = false } = options;
    
    const params = new URLSearchParams({
      language: 'ar',
      page: page.toString(),
      per_page: perPage.toString(),
      fields: 'text_uthmani,chapter_id,hizb_number,text_imlaei,page_number,juz_number,verse_key',
      word_fields: wordByWord ? 'text_uthmani,code_v1,code_v2,qpc_uthmani_hafs' : ''
    });
    
    if (translationId) {
      params.append('translations', translationId);
    }
    
    if (wordByWord) {
      params.append('word_translation', 'true');
    }
    
    const response = await fetch(
      `${API_BASE_URL}/verses/by_chapter/${surahNumber}?${params.toString()}`
    );
    
    if (!response.ok) throw new Error(`فشل جلب آيات السورة: ${response.statusText}`);
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('خطأ في جلب آيات السورة:', error);
    throw error;
  }
}

/**
 * جلب معلومات آية محددة
 * @param surahNumber رقم السورة
 * @param verseNumber رقم الآية
 * @param translationId معرف الترجمة
 * @returns وعد ببيانات الآية
 */
export async function getVerse(
  surahNumber: number, 
  verseNumber: number, 
  translationId?: string
) {
  try {
    const verseKey = `${surahNumber}:${verseNumber}`;
    const params = new URLSearchParams({
      language: 'ar',
      fields: 'text_uthmani,chapter_id,hizb_number,text_imlaei,page_number,juz_number,verse_key'
    });
    
    if (translationId) {
      params.append('translations', translationId);
    }
    
    const response = await fetch(
      `${API_BASE_URL}/verses/by_key/${verseKey}?${params.toString()}`
    );
    
    if (!response.ok) throw new Error(`فشل جلب الآية: ${response.statusText}`);
    
    const data = await response.json();
    return data.verse;
  } catch (error) {
    console.error('خطأ في جلب الآية:', error);
    throw error;
  }
}

/**
 * جلب بيانات صفحة معينة
 * @param pageNumber رقم الصفحة
 * @param options خيارات إضافية
 * @returns وعد ببيانات الصفحة
 */
export async function getPage(pageNumber: number, options: { translationId?: string } = {}) {
  const data = await getPageVerses(pageNumber, options.translationId);
  return data;
}

/**
 * جلب آيات صفحة معينة
 * @param pageNumber رقم الصفحة
 * @param translationId معرف الترجمة
 * @returns وعد بآيات الصفحة
 */
export async function getPageVerses(pageNumber: number, translationId?: string) {
  try {
    const params = new URLSearchParams({
      language: 'ar',
      fields: 'text_uthmani,chapter_id,verse_key,page_number,juz_number'
    });
    
    if (translationId) {
      params.append('translations', translationId);
    }
    
    const response = await fetch(
      `${API_BASE_URL}/verses/by_page/${pageNumber}?${params.toString()}`
    );
    
    if (!response.ok) throw new Error(`فشل جلب آيات الصفحة: ${response.statusText}`);
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('خطأ في جلب آيات الصفحة:', error);
    throw error;
  }
}

/**
 * الحصول على عنوان URL للصوت
 * @param surahNumber رقم السورة
 * @param verseNumber رقم الآية
 * @param reciterId معرف القارئ
 * @returns رابط الملف الصوتي
 */
export function getAudioUrl(surahNumber: number, verseNumber: number, reciterId: string) {
  return getVerseAudioUrl(reciterId, surahNumber, verseNumber);
}

/**
 * جلب رابط ملف صوتي لآية محددة
 * @param reciterId معرف القارئ
 * @param surahNumber رقم السورة
 * @param verseNumber رقم الآية
 * @returns رابط الملف الصوتي
 */
export function getVerseAudioUrl(
  reciterId: string, 
  surahNumber: number, 
  verseNumber: number
) {
  // تنسيق معرف القارئ ورقم السورة ورقم الآية
  const formattedSurah = surahNumber.toString().padStart(3, '0');
  const formattedVerse = verseNumber.toString().padStart(3, '0');
  
  // إرجاع رابط الملف الصوتي
  return `${API_CDN_URL}/audio/${reciterId}/${formattedSurah}${formattedVerse}.mp3`;
}

/**
 * جلب بيانات التفسير لآية محددة
 * @param tafsirId معرف التفسير
 * @param surahNumber رقم السورة
 * @param verseNumber رقم الآية
 * @returns وعد ببيانات التفسير
 */
export async function getTafsir(tafsirId: string, surahNumber: number, verseNumber: number) {
  try {
    const verseKey = `${surahNumber}:${verseNumber}`;
    
    const response = await fetch(
      `${API_BASE_URL}/tafsirs/${tafsirId}/by_ayah/${verseKey}`
    );
    
    if (!response.ok) throw new Error(`فشل جلب التفسير: ${response.statusText}`);
    
    const data = await response.json();
    return data.tafsir;
  } catch (error) {
    console.error('خطأ في جلب التفسير:', error);
    throw error;
  }
}

/**
 * جلب قائمة قراء القرآن المتاحين
 * @returns وعد بقائمة القراء
 */
export async function getReciters() {
  try {
    const response = await fetch(`${API_BASE_URL}/resources/recitations?language=ar`);
    if (!response.ok) throw new Error(`فشل جلب قائمة القراء: ${response.statusText}`);
    
    const data = await response.json();
    return data.recitations;
  } catch (error) {
    console.error('خطأ في جلب قائمة القراء:', error);
    throw error;
  }
}

/**
 * جلب قائمة الترجمات المتاحة
 * @returns وعد بقائمة الترجمات
 */
export async function getTranslations() {
  try {
    const response = await fetch(`${API_BASE_URL}/resources/translations`);
    if (!response.ok) throw new Error(`فشل جلب قائمة الترجمات: ${response.statusText}`);
    
    const data = await response.json();
    return data.translations;
  } catch (error) {
    console.error('خطأ في جلب قائمة الترجمات:', error);
    throw error;
  }
}

/**
 * البحث في القرآن الكريم
 * @param query نص البحث
 * @param page رقم الصفحة
 * @param limit عدد النتائج في الصفحة
 * @param translationId معرف الترجمة
 * @returns وعد بنتائج البحث
 */
export async function searchQuran(
  query: string, 
  page: number = 1, 
  limit: number = 20,
  translationId?: string
) {
  try {
    const params = new URLSearchParams({
      language: 'ar',
      q: query,
      page: page.toString(),
      size: limit.toString()
    });
    
    if (translationId) {
      params.append('translations', translationId);
    }
    
    const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
    if (!response.ok) throw new Error(`فشل البحث: ${response.statusText}`);
    
    const data = await response.json();
    
    return {
      results: data.search.results,
      total_results: data.search.total_results,
      page: data.search.current_page,
      total_pages: data.search.total_pages
    };
  } catch (error) {
    console.error('خطأ في البحث:', error);
    throw error;
  }
}

/**
 * البحث المتقدم في القرآن الكريم
 * @param options خيارات البحث المتقدمة
 * @returns وعد بنتائج البحث
 */
export async function advancedSearch(options: {
  query: string;
  page?: number;
  limit?: number;
  translationId?: string;
  filters?: {
    surahIds?: number[];
    juzNumbers?: number[];
    revelationType?: 'meccan' | 'medinan';
  };
  options?: {
    matchWholeWords?: boolean;
    includeDerivatives?: boolean;
    caseSensitive?: boolean;
    searchInTranslations?: boolean;
  };
}) {
  try {
    const { 
      query, 
      page = 1, 
      limit = 20,
      translationId,
      filters = {},
      options: searchOptions = {}
    } = options;
    
    const params = new URLSearchParams({
      language: 'ar',
      q: query,
      page: page.toString(),
      size: limit.toString()
    });
    
    // إضافة معرف الترجمة إذا كان متوفرًا
    if (translationId) {
      params.append('translations', translationId);
    }
    
    // إضافة فلاتر السور إذا كانت متوفرة
    if (filters.surahIds && filters.surahIds.length > 0) {
      params.append('chapter', filters.surahIds.join(','));
    }
    
    // إضافة فلاتر الأجزاء إذا كانت متوفرة
    if (filters.juzNumbers && filters.juzNumbers.length > 0) {
      params.append('juz', filters.juzNumbers.join(','));
    }
    
    // إضافة فلتر نوع النزول إذا كان متوفرًا
    if (filters.revelationType) {
      params.append('revelation_type', filters.revelationType);
    }
    
    // إضافة خيارات البحث إذا كانت متوفرة
    if (searchOptions.matchWholeWords) {
      params.append('phrase', 'true');
    }
    
    if (searchOptions.includeDerivatives) {
      params.append('with_root', 'true');
    }
    
    if (searchOptions.caseSensitive) {
      params.append('sensitive', 'true');
    }
    
    if (searchOptions.searchInTranslations) {
      params.append('translate', 'true');
    }
    
    const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
    if (!response.ok) throw new Error(`فشل البحث المتقدم: ${response.statusText}`);
    
    const data = await response.json();
    
    return {
      results: data.search.results,
      total_results: data.search.total_results,
      page: data.search.current_page,
      total_pages: data.search.total_pages
    };
  } catch (error) {
    console.error('خطأ في البحث المتقدم:', error);
    throw error;
  }
}