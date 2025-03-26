
import { useEffect, useState } from 'react';
import { useQuranData } from '@/hooks/useQuranData';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import SurahList from './SurahList';
import JuzList from './JuzList';

interface UniqueQuranFetcherProps {
  viewMode: 'surah' | 'juz';
  fontFamily: string;
  fontSize: number;
}

export default function UniqueQuranFetcher({ viewMode, fontFamily, fontSize }: UniqueQuranFetcherProps) {
  const { quranData, loading, error } = useQuranData();
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    if (quranData && !processed) {
      // هنا يمكن إضافة معالجة إضافية للبيانات إذا لزم الأمر
      setProcessed(true);
    }
  }, [quranData, processed]);

  if (loading) {
    return <LoadingSpinner message="جاري تحميل بيانات القرآن..." />;
  }

  if (error || !quranData) {
    return <ErrorDisplay message={error || 'حدث خطأ غير معروف'} />;
  }

  if (viewMode === 'surah') {
    return <SurahList quranData={quranData} fontFamily={fontFamily} fontSize={fontSize} />;
  } else {
    return <JuzList quranData={quranData} fontFamily={fontFamily} fontSize={fontSize} />;
  }
}
