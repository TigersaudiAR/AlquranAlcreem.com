import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a time string to a 12-hour format with am/pm
 * @param timeString a 24-hour format time string (HH:MM)
 * @returns a formatted time string in 12-hour format (H:MM AM/PM)
 */
export function formatTimeToAMPM(timeString: string): string {
  if (!timeString || !timeString.includes(':')) return timeString;
  
  const [hours, minutes] = timeString.split(':').map(Number);
  const period = hours >= 12 ? 'م' : 'ص';
  const displayHours = hours % 12 || 12;
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Formats a countdown timer to hh:mm:ss
 * @param totalSeconds Total seconds to format
 * @returns A string in the format hh:mm:ss
 */
export function formatCountdown(totalSeconds: number): string {
  if (isNaN(totalSeconds)) return '--:--:--';
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

/**
 * Convert degrees to radians
 * @param deg Degrees
 * @returns Radians
 */
export function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Get compass direction based on degrees
 * @param degrees Direction in degrees
 * @returns Compass direction in Arabic
 */
export function getCompassDirection(degrees: number): string {
  const directions = [
    "شمال",
    "شمال شرق",
    "شرق",
    "جنوب شرق",
    "جنوب",
    "جنوب غرب",
    "غرب",
    "شمال غرب"
  ];
  
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

/**
 * Format Gregorian date to Arabic format
 * @param date Date object or string
 * @returns Formatted date string
 */
export function formatGregorianDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a date for display in a relative time format (e.g., "2 days ago")
 * @param dateString ISO date string
 * @returns Relative time string in Arabic
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      if (diffMinutes === 0) {
        return 'الآن';
      }
      return `منذ ${diffMinutes} دقيقة${diffMinutes > 10 ? '' : diffMinutes > 2 ? '' : diffMinutes === 1 ? '' : 'ة'}`;
    }
    return `منذ ${diffHours} ساع${diffHours > 10 ? 'ة' : diffHours > 2 ? 'ات' : diffHours === 1 ? 'ة' : 'ات'}`;
  } else if (diffDays === 1) {
    return 'بالأمس';
  } else if (diffDays < 7) {
    return `منذ ${diffDays} أيام`;
  } else if (diffDays < 30) {
    const diffWeeks = Math.floor(diffDays / 7);
    return `منذ ${diffWeeks} أسبوع${diffWeeks > 1 ? '' : ''}`;
  } else if (diffDays < 365) {
    const diffMonths = Math.floor(diffDays / 30);
    return `منذ ${diffMonths} شهر${diffMonths > 1 ? '' : ''}`;
  } else {
    const diffYears = Math.floor(diffDays / 365);
    return `منذ ${diffYears} سنة${diffYears > 1 ? '' : ''}`;
  }
}

/**
 * Shuffle an array (useful for randomizing questions/answers)
 * @param array The array to shuffle
 * @returns A new shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Debounce a function call
 * @param func The function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
