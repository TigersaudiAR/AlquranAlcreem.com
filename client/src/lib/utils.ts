import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * تنسيق التاريخ بالعربية
 */
export function formatArabicDate(date: Date): string {
  return date.toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * اختصار النص إذا كان طويلاً
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * تحويل أرقام إنجليزية إلى أرقام عربية
 */
export function convertToArabicNumbers(num: number | string): string {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (w) => arabicNumbers[+w]);
}

/**
 * تحويل من الأرقام العربية إلى الإنجليزية
 */
export function convertToEnglishNumbers(num: string): string {
  return num.replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => {
    return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  });
}

/**
 * استخراج رقم الآية من رابط أو نص
 */
export function extractAyahNumber(text: string): number | null {
  const match = text.match(/(\d+):(\d+)/);
  if (match && match[2]) {
    return parseInt(match[2], 10);
  }
  return null;
}

/**
 * استخراج رقم السورة من رابط أو نص
 */
export function extractSurahNumber(text: string): number | null {
  const match = text.match(/(\d+):(\d+)/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
}