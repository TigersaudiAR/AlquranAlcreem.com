import { APP_CONFIG } from './constants';

/**
 * Fetch a specific surah from the Quran API
 * @param surahNumber The surah number (1-114)
 * @param edition The edition of the Quran (default: quran-uthmani)
 * @returns Promise with the surah data
 */
export async function getSurah(surahNumber: number, edition = 'quran-uthmani') {
  try {
    const response = await fetch(`${APP_CONFIG.quranAPI}surah/${surahNumber}/${edition}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch surah: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching surah:', error);
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
    const response = await fetch(`${APP_CONFIG.quranAPI}page/${pageNumber}/${edition}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching page:', error);
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
    const response = await fetch(`${APP_CONFIG.quranAPI}juz/${juzNumber}/${edition}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch juz: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching juz:', error);
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
    const response = await fetch(`${APP_CONFIG.quranAPI}search/${query}/${edition}/${page}/${perPage}`);
    
    if (!response.ok) {
      throw new Error(`Failed to search Quran: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error searching Quran:', error);
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
    // First, get the actual ayah text
    const ayahResponse = await fetch(`${APP_CONFIG.quranAPI}ayah/${surahNumber}:${ayahNumber}`);
    
    if (!ayahResponse.ok) {
      throw new Error(`Failed to fetch ayah: ${ayahResponse.status}`);
    }
    
    const ayahData = await ayahResponse.json();
    
    // Then get the tafsir from Quran.com API
    const tafsirResponse = await fetch(`${APP_CONFIG.tafsirAPI}tafsirs/${tafsirId}/by_ayah/${surahNumber}:${ayahNumber}`);
    
    if (!tafsirResponse.ok) {
      throw new Error(`Failed to fetch tafsir: ${tafsirResponse.status}`);
    }
    
    const tafsirData = await tafsirResponse.json();
    
    // Combine the data
    return {
      ayahText: ayahData.data.text,
      tafsirText: tafsirData.tafsir?.text || 'التفسير غير متوفر',
      tafsirName: tafsirData.tafsir?.resource_name || tafsirId,
      surahNumber,
      ayahNumber
    };
  } catch (error) {
    console.error('Error fetching tafsir:', error);
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
  return `${APP_CONFIG.audioBaseURL}${reciterId}/${surahNumber}/${ayahNumber}.mp3`;
}

/**
 * Get translation of a surah
 * @param surahNumber The surah number (1-114)
 * @param translationId The translation ID (e.g., 'en.sahih')
 * @returns Promise with the translated surah
 */
export async function getTranslation(surahNumber: number, translationId = 'en.sahih') {
  try {
    const response = await fetch(`${APP_CONFIG.quranAPI}surah/${surahNumber}/${translationId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch translation: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching translation:', error);
    throw error;
  }
}

/**
 * Get a list of all surahs in the Quran
 * @returns Promise with the list of surahs
 */
export async function getSurahs() {
  try {
    const response = await fetch(`${APP_CONFIG.quranAPI}surah`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch surahs: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
}

/**
 * Get metadata about the Quran
 * @returns Promise with Quran metadata
 */
export async function getQuranMeta() {
  try {
    const response = await fetch(`${APP_CONFIG.quranAPI}meta`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Quran metadata: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching Quran metadata:', error);
    throw error;
  }
}
