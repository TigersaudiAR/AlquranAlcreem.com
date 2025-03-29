/**
 * واجهة برمجية للوصول إلى بيانات القرآن الكريم والتفاسير
 */

import { APP_CONFIG } from './constants';

/**
 * Fetch a specific surah from the Quran API
 * @param surahNumber The surah number (1-114)
 * @param edition The edition of the Quran (default: quran-uthmani)
 * @returns Promise with the surah data
 */
export async function getSurah(surahNumber: number, edition = 'quran-uthmani') {
  try {
    const response = await fetch(`${APP_CONFIG.BASE_API_URL}/surah/${surahNumber}/${edition}`);
    if (!response.ok) {
      throw new Error(`Error fetching surah: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getSurah:', error);
    throw error;
  }
}

/**
 * Fetch a specific page from the Quran API
 * @param pageNumber The page number (1-604)
 * @param edition The edition of the Quran (default: quran-uthmani)
 * @returns Promise with the page data
 */
export async function getPage(pageNumber: number, edition = 'quran-uthmani') {
  try {
    const response = await fetch(`${APP_CONFIG.BASE_API_URL}/page/${pageNumber}/${edition}`);
    if (!response.ok) {
      throw new Error(`Error fetching page: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getPage:', error);
    throw error;
  }
}

/**
 * Fetch a specific juz from the Quran API
 * @param juzNumber The juz number (1-30)
 * @param edition The edition of the Quran (default: quran-uthmani)
 * @returns Promise with the juz data
 */
export async function getJuz(juzNumber: number, edition = 'quran-uthmani') {
  try {
    const response = await fetch(`${APP_CONFIG.BASE_API_URL}/juz/${juzNumber}/${edition}`);
    if (!response.ok) {
      throw new Error(`Error fetching juz: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getJuz:', error);
    throw error;
  }
}

/**
 * Search the Quran for a specific term
 * @param query The search query
 * @param edition The edition of the Quran (default: quran-uthmani)
 * @param page The page number for paginated results
 * @param perPage Number of results per page
 * @returns Promise with the search results
 */
export async function searchQuran(query: string, edition = 'quran-uthmani', page = 1, perPage = 20) {
  try {
    const response = await fetch(
      `${APP_CONFIG.BASE_API_URL}/search/${query}/${edition}/${page}/${perPage}`
    );
    if (!response.ok) {
      throw new Error(`Error searching Quran: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in searchQuran:', error);
    throw error;
  }
}

/**
 * Fetch tafsir (exegesis) for a specific ayah
 * @param surahNumber The surah number (1-114)
 * @param ayahNumber The ayah number
 * @param tafsirId The tafsir ID (e.g., 'ar-tafsir-al-jalalayn')
 * @returns Promise with the tafsir data
 */
export async function getTafsir(surahNumber: number, ayahNumber: number, tafsirId = 'ar-tafsir-al-jalalayn') {
  try {
    const response = await fetch(
      `${APP_CONFIG.TAFSIR_API_URL}/translation/sura/${surahNumber}/ayah/${ayahNumber}/language/ar/${tafsirId}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching tafsir: ${response.statusText}`);
    }
    const data = await response.json();
    
    return {
      surahNumber,
      ayahNumber,
      tafsirId,
      tafsirName: data.result?.name || tafsirId,
      tafsirText: data.result?.text || 'لا يوجد تفسير متاح',
      ayahText: data.result?.arabic || ''
    };
  } catch (error) {
    console.error('Error in getTafsir:', error);
    throw error;
  }
}

/**
 * Get a specific ayah from the Quran
 * @param surahNumber The surah number (1-114)
 * @param ayahNumber The ayah number
 * @returns Promise with the ayah text
 */
export async function getAyah(surahNumber: number, ayahNumber: number) {
  try {
    const response = await fetch(
      `${APP_CONFIG.BASE_API_URL}/ayah/${surahNumber}:${ayahNumber}/quran-uthmani`
    );
    if (!response.ok) {
      throw new Error(`Error fetching ayah: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data.text;
  } catch (error) {
    console.error('Error in getAyah:', error);
    throw error;
  }
}

/**
 * Get the audio URL for a specific ayah
 * @param surahNumber The surah number (1-114)
 * @param ayahNumber The ayah number
 * @param reciterId The reciter ID (default: ar.alafasy)
 * @returns The audio URL
 */
export function getAyahAudioUrl(surahNumber: number, ayahNumber: number, reciterId = 'ar.alafasy') {
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${surahNumber * 1000 + ayahNumber}.mp3`;
}

/**
 * Get translation of a surah
 * @param surahNumber The surah number (1-114)
 * @param translationId The translation ID (e.g., 'en.sahih')
 * @returns Promise with the translated surah
 */
export async function getTranslation(surahNumber: number, translationId = 'en.sahih') {
  try {
    const response = await fetch(`${APP_CONFIG.BASE_API_URL}/surah/${surahNumber}/${translationId}`);
    if (!response.ok) {
      throw new Error(`Error fetching translation: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getTranslation:', error);
    throw error;
  }
}

/**
 * Get a list of all surahs in the Quran
 * @returns Promise with the list of surahs
 */
export async function getSurahs() {
  try {
    const response = await fetch(`${APP_CONFIG.BASE_API_URL}/meta`);
    if (!response.ok) {
      throw new Error(`Error fetching surah list: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data.surahs.references;
  } catch (error) {
    console.error('Error in getSurahs:', error);
    throw error;
  }
}

/**
 * Get metadata about the Quran
 * @returns Promise with Quran metadata
 */
export async function getQuranMeta() {
  try {
    const response = await fetch(`${APP_CONFIG.BASE_API_URL}/meta`);
    if (!response.ok) {
      throw new Error(`Error fetching Quran metadata: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getQuranMeta:', error);
    throw error;
  }
}