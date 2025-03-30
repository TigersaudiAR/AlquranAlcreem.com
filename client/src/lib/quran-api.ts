import { APP_CONFIG } from './constants';

// واجهة لبيانات سورة
interface Surah {
  id: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

// واجهة لبيانات آية
interface Ayah {
  id: number;
  surah_id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  text_simple: string;
  juz_number: number;
  hizb_number: number;
  rub_number: number;
  sajdah_type: string | null;
  page_number: number;
  translations?: AyahTranslation[];
}

// واجهة لترجمة آية
interface AyahTranslation {
  id: number;
  text: string;
  language_name: string;
  resource_name: string;
}

// واجهة لبيانات صفحة
interface Page {
  number: number;
  verses: Ayah[];
}

// واجهة لبيانات جزء
interface Juz {
  id: number;
  juz_number: number;
  verse_mapping: Record<string, string>;
  first_verse_id: number;
  last_verse_id: number;
  verses_count: number;
}

// واجهة للتفسير
interface Tafsir {
  surahNumber: number;
  ayahNumber: number;
  tafsirId: string;
  tafsirName: string;
  tafsirText: string;
  ayahText: string;
}

// واجهة لنتائج البحث
interface SearchResult {
  query: string;
  total_results: number;
  page: number;
  total_pages: number;
  results: SearchResultItem[];
}

// واجهة لعنصر نتائج البحث
interface SearchResultItem {
  verse_id: number;
  verse_key: string;
  text: string;
  highlighted: string;
  translations?: { [key: string]: string };
}

/**
 * الحصول على قائمة السور
 * @returns وعد بقائمة السور
 */
export async function getSurahs(): Promise<Surah[]> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/chapters?language=ar`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch surahs: ${response.status}`);
    }
    
    const data = await response.json();
    return data.chapters;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
}

/**
 * الحصول على سورة محددة بالرقم
 * @param surahNumber رقم السورة (1-114)
 * @returns وعد ببيانات السورة
 */
export async function getSurah(surahNumber: number): Promise<Surah> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/chapters/${surahNumber}?language=ar`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch surah ${surahNumber}: ${response.status}`);
    }
    
    const data = await response.json();
    return data.chapter;
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error);
    throw error;
  }
}

/**
 * الحصول على آيات سورة محددة
 * @param surahNumber رقم السورة (1-114)
 * @param translationId معرف الترجمة (اختياري)
 * @returns وعد بآيات السورة
 */
export async function getSurahVerses(surahNumber: number, translationId?: string): Promise<Ayah[]> {
  try {
    let url = `${APP_CONFIG.API_BASE_URL}/verses/by_chapter/${surahNumber}?language=ar&words=false&fields=text_uthmani,text_simple,verse_key`;
    
    if (translationId) {
      url += `&translations=${translationId}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch verses for surah ${surahNumber}: ${response.status}`);
    }
    
    const data = await response.json();
    return data.verses;
  } catch (error) {
    console.error(`Error fetching verses for surah ${surahNumber}:`, error);
    throw error;
  }
}

/**
 * الحصول على آية محددة
 * @param surahNumber رقم السورة (1-114)
 * @param ayahNumber رقم الآية
 * @param translationId معرف الترجمة (اختياري)
 * @returns وعد ببيانات الآية
 */
export async function getVerse(surahNumber: number, ayahNumber: number, translationId?: string): Promise<Ayah> {
  try {
    const verseKey = `${surahNumber}:${ayahNumber}`;
    let url = `${APP_CONFIG.API_BASE_URL}/verses/by_key/${verseKey}?language=ar&words=false&fields=text_uthmani,text_simple`;
    
    if (translationId) {
      url += `&translations=${translationId}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch verse ${verseKey}: ${response.status}`);
    }
    
    const data = await response.json();
    return data.verse;
  } catch (error) {
    console.error(`Error fetching verse ${surahNumber}:${ayahNumber}:`, error);
    throw error;
  }
}

/**
 * الحصول على صفحة محددة من المصحف
 * @param pageNumber رقم الصفحة
 * @param translationId معرف الترجمة (اختياري)
 * @returns وعد ببيانات الصفحة
 */
export async function getPage(pageNumber: number, translationId?: string): Promise<Page> {
  try {
    let url = `${APP_CONFIG.API_BASE_URL}/verses/by_page/${pageNumber}?language=ar&words=false&fields=text_uthmani,text_simple,verse_key`;
    
    if (translationId) {
      url += `&translations=${translationId}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page ${pageNumber}: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      number: pageNumber,
      verses: data.verses
    };
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error);
    throw error;
  }
}

/**
 * الحصول على جزء محدد
 * @param juzNumber رقم الجزء (1-30)
 * @returns وعد ببيانات الجزء
 */
export async function getJuz(juzNumber: number): Promise<Juz> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/juzs/${juzNumber}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch juz ${juzNumber}: ${response.status}`);
    }
    
    const data = await response.json();
    return data.juz;
  } catch (error) {
    console.error(`Error fetching juz ${juzNumber}:`, error);
    throw error;
  }
}

/**
 * البحث في القرآن الكريم
 * @param query نص البحث
 * @param page رقم الصفحة (الافتراضي: 1)
 * @param size عدد النتائج في الصفحة (الافتراضي: 20)
 * @param translationId معرف الترجمة (اختياري)
 * @returns وعد بنتائج البحث
 */
export async function searchQuran(
  query: string,
  page: number = 1,
  size: number = 20,
  translationId?: string
): Promise<SearchResult> {
  try {
    let url = `${APP_CONFIG.API_BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`;
    
    if (translationId) {
      url += `&translations=${translationId}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to search Quran for "${query}": ${response.status}`);
    }
    
    const data = await response.json();
    return {
      query,
      total_results: data.total_results,
      page: data.page,
      total_pages: data.total_pages,
      results: data.search.results
    };
  } catch (error) {
    console.error(`Error searching Quran for "${query}":`, error);
    throw error;
  }
}

/**
 * الحصول على رابط ملف صوتي لآية محددة
 * @param surahNumber رقم السورة (1-114)
 * @param ayahNumber رقم الآية
 * @param reciterId معرف القارئ
 * @returns رابط الملف الصوتي
 */
export function getAudioUrl(surahNumber: number, ayahNumber: number, reciterId: string): string {
  const formattedSurah = surahNumber.toString().padStart(3, '0');
  const formattedAyah = ayahNumber.toString().padStart(3, '0');
  return `${APP_CONFIG.AUDIO_BASE_URL}/${reciterId}/${formattedSurah}${formattedAyah}.mp3`;
}

/**
 * الحصول على تفسير آية محددة
 * @param surahNumber رقم السورة (1-114)
 * @param ayahNumber رقم الآية
 * @param tafsirId معرف التفسير
 * @returns وعد ببيانات التفسير
 */
export async function getTafsir(
  surahNumber: number,
  ayahNumber: number,
  tafsirId: string = 'ar-tafsir-al-jalalayn'
): Promise<Tafsir> {
  try {
    const verseKey = `${surahNumber}:${ayahNumber}`;
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/tafsirs/${tafsirId}/by_ayah/${verseKey}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tafsir for verse ${verseKey}: ${response.status}`);
    }
    
    const tafsirData = await response.json();
    
    // جلب نص الآية أيضاً
    const verseResponse = await fetch(`${APP_CONFIG.API_BASE_URL}/verses/by_key/${verseKey}?fields=text_uthmani`);
    
    if (!verseResponse.ok) {
      throw new Error(`Failed to fetch verse ${verseKey}: ${verseResponse.status}`);
    }
    
    const verseData = await verseResponse.json();
    
    // تجميع البيانات وإرجاعها
    return {
      surahNumber,
      ayahNumber,
      tafsirId,
      tafsirName: tafsirData.tafsir.name,
      tafsirText: tafsirData.tafsir.text,
      ayahText: verseData.verse.text_uthmani
    };
  } catch (error) {
    console.error(`Error fetching tafsir for verse ${surahNumber}:${ayahNumber}:`, error);
    throw error;
  }
}