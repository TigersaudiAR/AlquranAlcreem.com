import { useProgress } from "../../context/ProgressContext";

const ReadingProgress = () => {
  const { versesRead, timeSpent } = useProgress();
  const minutes = Math.floor(timeSpent / 60);
  const suggestion =
    versesRead < 10
      ? "حاول قراءة 10 آيات على الأقل يومياً"
      : "أحسنت، واصل التقدم!";

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold text-primary mb-2">تقدم القراءة</h3>
      <p className="text-sm mb-1">عدد الآيات المقروءة: {versesRead}</p>
      <p className="text-sm mb-2">الوقت المستغرق: {minutes} دقيقة</p>
      <div className="text-sm text-primary">{suggestion}</div>
    </div>
  );
};

export default ReadingProgress;
