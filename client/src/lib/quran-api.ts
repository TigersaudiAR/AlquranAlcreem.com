/**
 * وحدة للتعامل مع واجهة برمجة تطبيقات القرآن الكريم
 */

/**
 * عنوان واجهة برمجة التطبيقات الأساسي
 */
const API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:8000"
  : `https://${window.location.hostname.replace('.replit.dev', '')}-8000.${window.location.hostname.includes('.replit.dev') ? 'replit.dev' : window.location.hostname.split('.').slice(1).join('.')}`;

/**
 * واجهة لبيانات التفسير
 */
export interface TafsirData {
  sura: number;
  ayah: number;
  tafsir_id: string;
  text: string;
}

/**
 * واجهة لبيانات الترجمة
 */
export interface TranslationData {
  sura: number;
  ayah: number;
  translation_id: string;
  text: string;
}

/**
 * واجهة للموارد المتاحة من API
 */
export interface AvailableResources {
  tafsirs: string[];
  translations: string[];
  pages: number;
}

/**
 * الحصول على قائمة بالموارد المتاحة
 */
export async function getAvailableResources(): Promise<AvailableResources> {
  try {
    const response = await fetch(`${API_BASE_URL}/available`);
    if (!response.ok) {
      throw new Error(`Error fetching resources: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch available resources:", error);
    // في حالة الفشل، نعود بقائمة فارغة
    return { tafsirs: [], translations: [], pages: 0 };
  }
}

/**
 * الحصول على تفسير لآية محددة
 */
export async function getTafsir(tafsirId: string, sura: number, ayah: number): Promise<TafsirData> {
  try {
    const response = await fetch(`${API_BASE_URL}/tafsir/${tafsirId}/${sura}/${ayah}`);
    if (!response.ok) {
      throw new Error(`Error fetching tafsir: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch tafsir for sura ${sura}, ayah ${ayah}:`, error);
    throw error;
  }
}

/**
 * الحصول على ترجمة لآية محددة
 */
export async function getTranslation(translationId: string, sura: number, ayah: number): Promise<TranslationData> {
  try {
    const response = await fetch(`${API_BASE_URL}/translation/${translationId}/${sura}/${ayah}`);
    if (!response.ok) {
      throw new Error(`Error fetching translation: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch translation for sura ${sura}, ayah ${ayah}:`, error);
    throw error;
  }
}

/**
 * الحصول على URL لصورة صفحة القرآن
 */
export function getQuranPageUrl(pageNumber: number): string {
  return `${API_BASE_URL}/page/${pageNumber}`;
}

/**
 * تحقق من توفر واجهة برمجة تطبيقات القرآن
 */
export async function checkQuranApiAvailability(): Promise<boolean> {
  try {
    const response = await fetch(API_BASE_URL, { 
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000) // timeout after 3 seconds
    });
    return response.ok;
  } catch (error) {
    console.error("Quran API is not available:", error);
    return false;
  }
}