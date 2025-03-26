import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

interface LastRead {
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  text: string;
  timestamp: string;
  description?: string;
}

export function useQuranData() {
  // In a real app, this would come from an API/database
  const getLastReadFromStorage = useCallback((): LastRead => {
    const storedData = localStorage.getItem('quranLastRead');
    
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    // Default last read data if none exists
    return {
      surahName: 'سورة البقرة',
      surahNumber: 2,
      ayahNumber: 255,
      pageNumber: 42,
      text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
      timestamp: new Date().toISOString(),
      description: 'آية الكرسي'
    };
  }, []);
  
  const { data: lastRead, isLoading, error, refetch } = useQuery({
    queryKey: ['quranLastRead'],
    queryFn: getLastReadFromStorage,
    staleTime: 60000, // 1 minute
  });
  
  const refetchLastRead = useCallback(() => {
    refetch();
  }, [refetch]);
  
  const updateLastRead = useCallback((newLastRead: LastRead) => {
    localStorage.setItem('quranLastRead', JSON.stringify({
      ...newLastRead,
      timestamp: new Date().toISOString()
    }));
    refetchLastRead();
  }, [refetchLastRead]);
  
  return {
    lastRead: lastRead || getLastReadFromStorage(),
    isLoading,
    error: error ? (error as Error).message : null,
    refetchLastRead,
    updateLastRead
  };
}
