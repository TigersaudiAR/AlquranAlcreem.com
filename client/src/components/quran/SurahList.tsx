import { useState } from 'react';
import { SURAH_NAMES } from '../../lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SurahListProps {
  onSelectSurah: (surahNumber: number) => void;
  currentSurah?: number;
}

const SurahList = ({ onSelectSurah, currentSurah }: SurahListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // تصفية السور بناءً على مصطلح البحث
  const filteredSurahs = SURAH_NAMES.filter(surah => 
    surah.name.includes(searchTerm) || 
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.number.toString().includes(searchTerm)
  );

  return (
    <div className="surah-list-container p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">قائمة السور</h3>
      
      {/* حقل البحث */}
      <Input
        type="text"
        placeholder="ابحث عن سورة..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3 text-right dir-rtl"
      />
      
      {/* قائمة السور مع التمرير */}
      <ScrollArea className="h-[400px] rounded border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
          {filteredSurahs.map(surah => (
            <Button
              key={surah.number}
              variant={currentSurah === surah.number ? "default" : "outline"}
              size="sm"
              className="justify-between text-right rtl"
              onClick={() => onSelectSurah(surah.number)}
            >
              <span className="text-xs opacity-75">{surah.number}</span>
              <span>{surah.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SurahList;