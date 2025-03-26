import PrayerTimesDetailed from '../components/prayer/PrayerTimesDetailed';
import QiblaDirection from '../components/prayer/QiblaDirection';
import MonthlyPrayerCalendar from '../components/prayer/MonthlyPrayerCalendar';

const Prayer = () => {
  return (
    <section className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">مواقيت الصلاة</h2>
        
        <PrayerTimesDetailed />
        <QiblaDirection />
        <MonthlyPrayerCalendar />
      </div>
    </section>
  );
};

export default Prayer;
