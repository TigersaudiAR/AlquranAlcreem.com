/**
 * واجهة برمجية للوصول إلى بيانات القرآن الكريم والتفاسير
 */

/**
 * Fetch a specific surah from the Quran API
 * @param surahNumber The surah number (1-114)
 * @param edition The edition of the Quran (default: quran-uthmani)
 * @returns Promise with the surah data
 */
export async function getSurah(surahNumber: number, edition = 'quran-uthmani') {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch surah ${surahNumber}`);
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
    const response = await fetch(`https://api.alquran.cloud/v1/page/${pageNumber}/${edition}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch page ${pageNumber}`);
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
    const response = await fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/${edition}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch juz ${juzNumber}`);
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
    const response = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/${edition}/${page}/${perPage}`);
    if (!response.ok) {
      throw new Error(`Failed to search for ${query}`);
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
    const response = await fetch(`https://api.quran-tafseer.com/tafseer/${tafsirId}/${surahNumber}/${ayahNumber}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tafsir for surah ${surahNumber}, ayah ${ayahNumber}`);
    }
    
    const data = await response.json();
    
    // Get the ayah text also
    const ayahData = await getAyah(surahNumber, ayahNumber);
    
    return {
      surahNumber,
      ayahNumber,
      tafsirId,
      tafsirName: data.tafseer_name || 'تفسير',
      tafsirText: data.text || 'لا يوجد تفسير متاح',
      ayahText: ayahData?.text || null
    };
  } catch (error) {
    console.error('Error fetching tafsir:', error);
    // كمعالجة للخطأ، نقوم بإرجاع بيانات تفسير بديلة مع رسالة الخطأ
    return {
      surahNumber,
      ayahNumber,
      tafsirId,
      tafsirName: 'خطأ في التفسير',
      tafsirText: 'تعذر الحصول على التفسير. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.',
      ayahText: null
    };
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
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ayah ${surahNumber}:${ayahNumber}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching ayah:', error);
    return null;
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
  return `https://verses.quran.com/${reciterId}/${surahNumber}/${ayahNumber}.mp3`;
}

/**
 * Get translation of a surah
 * @param surahNumber The surah number (1-114)
 * @param translationId The translation ID (e.g., 'en.sahih')
 * @returns Promise with the translated surah
 */
export async function getTranslation(surahNumber: number, translationId = 'en.sahih') {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${translationId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch translation for surah ${surahNumber}`);
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
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    if (!response.ok) {
      throw new Error('Failed to fetch surahs');
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
    const response = await fetch('https://api.alquran.cloud/v1/meta');
    if (!response.ok) {
      throw new Error('Failed to fetch Quran metadata');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching Quran metadata:', error);
    throw error;
  }
}