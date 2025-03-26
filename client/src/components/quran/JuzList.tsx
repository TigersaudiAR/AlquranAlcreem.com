import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JuzListProps {
  onSelectJuz: (juzNumber: number) => void;
  currentJuz?: number;
}

const JuzList = ({ onSelectJuz, currentJuz }: JuzListProps) => {
  // إنشاء مصفوفة من 1 إلى 30 للأجزاء
  const juzs = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="juz-list-container p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">الأجزاء</h3>
      
      <ScrollArea className="h-[300px] rounded border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-2">
          {juzs.map(juzNumber => (
            <Button
              key={juzNumber}
              variant={currentJuz === juzNumber ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectJuz(juzNumber)}
            >
              الجزء {juzNumber}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default JuzList;