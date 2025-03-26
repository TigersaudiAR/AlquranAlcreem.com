
import { useState } from 'react';
import { Link } from 'wouter';
import { QuranData } from '../../types/quran';

interface JuzListProps {
  quranData: QuranData;
  fontFamily: string;
  fontSize: number;
}

export default function JuzList({ quranData, fontFamily, fontSize }: JuzListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // إنشاء مصفوفة الأجزاء
  const juzs = Array.from({ length: 30 }, (_, i) => i + 1);
  
  const filteredJuzs = juzs.filter(juz => 
    juz.toString().includes(searchQuery)
  );

  // إيجاد معلومات الجزء (السور المتضمنة وأرقام الآيات)
  const getJuzInfo = (juzNumber: number) => {
    const juzSurahs = quranData.surahs.filter(surah => {
      return surah.ayahs.some(ayah => ayah.juz === juzNumber);
    });

    return juzSurahs.map(surah => {
      const juzAyahs = surah.ayahs.filter(ayah => ayah.juz === juzNumber);
      return {
        surahNumber: surah.number,
        surahName: surah.name,
        firstAyah: juzAyahs[0]?.number || 0,
        lastAyah: juzAyahs[juzAyahs.length - 1]?.number || 0
      };
    });
  };

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="ابحث عن جزء..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJuzs.map((juz) => (
          <JuzCard 
            key={juz} 
            juzNumber={juz} 
            juzInfo={getJuzInfo(juz)} 
            fontFamily={fontFamily}
            fontSize={fontSize}
          />
        ))}
      </div>
    </div>
  );
}

interface JuzInfo {
  surahNumber: number;
  surahName: string;
  firstAyah: number;
  lastAyah: number;
}

interface JuzCardProps {
  juzNumber: number;
  juzInfo: JuzInfo[];
  fontFamily: string;
  fontSize: number;
}

function JuzCard({ juzNumber, juzInfo, fontFamily, fontSize }: JuzCardProps) {
  const firstSurah = juzInfo[0];
  
  return (
    <Link href={`/quran/juz/${juzNumber}`}>
      <a className="block bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg p-4 transition duration-150 ease-in-out">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="bg-primary-600 text-white w-8 h-8 flex items-center justify-center rounded-full ml-2">
              {juzNumber}
            </div>
            <div>
              <h3 className="font-bold text-lg">الجزء {juzNumber}</h3>
              {firstSurah && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  يبدأ من سورة {firstSurah.surahName}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-center" style={{ fontFamily: fontFamily, fontSize: `${fontSize}px` }}>
          {firstSurah && (
            <span>الجزء {juzNumber}</span>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          {juzInfo.length > 0 && (
            <ul className="divide-y divide-gray-200 dark:divide-gray-600">
              {juzInfo.map((info) => (
                <li key={info.surahNumber} className="py-1">
                  سورة {info.surahName}: من الآية {info.firstAyah} إلى الآية {info.lastAyah}
                </li>
              ))}
            </ul>
          )}
        </div>
      </a>
    </Link>
  );
}
