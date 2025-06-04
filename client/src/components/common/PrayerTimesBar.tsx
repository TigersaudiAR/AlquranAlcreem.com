import { useState } from 'react';

interface Times {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

const defaultTimes: Times = {
  fajr: '04:25',
  dhuhr: '12:30',
  asr: '15:45',
  maghrib: '18:32',
  isha: '20:00'
};

/** شريط أفقي لعرض مواقيت الصلاة واتجاه القبلة */
export default function PrayerTimesBar() {
  const [times] = useState(defaultTimes);
  return (
    <div className="mt-12 mb-4 bg-primary/10 rounded p-2 flex items-center justify-around text-sm">
      {Object.entries({
        الفجر: times.fajr,
        الظهر: times.dhuhr,
        العصر: times.asr,
        المغرب: times.maghrib,
        العشاء: times.isha
      }).map(([name, time]) => (
        <div key={name} className="text-center">
          <div className="font-semibold">{name}</div>
          <div>{time}</div>
        </div>
      ))}
      <div className="text-center">
        <div className="font-semibold">القبلة</div>
        <div>🧭</div>
      </div>
    </div>
  );
}
