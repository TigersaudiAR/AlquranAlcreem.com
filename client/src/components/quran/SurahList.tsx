import { useState } from 'react';
import { useLocation } from 'wouter';
import { QuranData, Surah } from '@/types/quran';

interface SurahListProps {
  quranData: QuranData;
  fontFamily: string;
  fontSize: number;
}

export default function SurahList({ quranData, fontFamily, fontSize }: SurahListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSurahs = quranData.surahs.filter(surah => 
    surah.name.includes(searchQuery) || 
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    surah.number.toString().includes(searchQuery)
  );

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="ابحث عن سورة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurahs.map((surah) => (
          <SurahCard key={surah.number} surah={surah} fontFamily={fontFamily} fontSize={fontSize} />
        ))}
      </div>
    </div>
  );
}

interface SurahCardProps {
  surah: Surah;
  fontFamily: string;
  fontSize: number;
}

function SurahCard({ surah, fontFamily, fontSize }: SurahCardProps) {
  const [, navigate] = useLocation();
  
  // تحديد الصفحة إذا كانت متوفرة، وإلا استخدام رقم السورة للتنقل
  const pageNumber = (surah as any).page;
  const targetUrl = pageNumber ? `/quran/page/${pageNumber}` : `/quran/surah/${surah.number}`;

  return (
    <div 
      className="block bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg p-4 transition duration-150 ease-in-out cursor-pointer" 
      onClick={() => navigate(targetUrl)}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="bg-primary-600 text-white w-8 h-8 flex items-center justify-center rounded-full ml-2">
            {surah.number}
          </div>
          <div>
            <h3 className="font-bold text-lg">{surah.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{surah.englishName}</p>
          </div>
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
        </div>
      </div>
      <div className="mt-4 text-center" style={{ 
        fontFamily: 'HafsSmart, Hafs, UthmanicHafs, serif', 
        fontSize: `${fontSize}px`,
        color: '#705C3B',
        letterSpacing: '0.02em',
        lineHeight: '1.8'
      }}>
        {surah.number !== 1 && surah.number !== 9 ? 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ' : ''}
      </div>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex justify-between">
        <span>عدد الآيات: {surah.numberOfAyahs || '-'}</span>
        <span>الصفحة: {(surah as any).page || surah.number}</span>
      </div>
    </div>
  );
}