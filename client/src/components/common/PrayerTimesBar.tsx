import { useState, useEffect } from "react";

interface Times {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

const defaultTimes: Times = {
  fajr: "04:25",
  dhuhr: "12:30",
  asr: "15:45",
  maghrib: "18:32",
  isha: "20:00",
};

/** شريط أفقي لعرض مواقيت الصلاة واتجاه القبلة */
export default function PrayerTimesBar() {
  const [times] = useState(defaultTimes);
  const [angle, setAngle] = useState(0);

  const updateLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const kaabaLat = 21.4225;
      const kaabaLon = 39.8262;
      const toRad = (d: number) => (d * Math.PI) / 180;
      const qibla = Math.atan2(
        Math.sin(toRad(kaabaLon - longitude)),
        Math.cos(toRad(latitude)) * Math.tan(toRad(kaabaLat)) -
          Math.sin(toRad(latitude)) * Math.cos(toRad(kaabaLon - longitude)),
      );
      setAngle((qibla * 180) / Math.PI);
    });
  };

  useEffect(() => {
    updateLocation();
  }, []);

  return (
    <div className="mt-12 mb-4 bg-primary/10 rounded p-2 flex items-center justify-around text-sm">
      {Object.entries({
        الفجر: times.fajr,
        الظهر: times.dhuhr,
        العصر: times.asr,
        المغرب: times.maghrib,
        العشاء: times.isha,
      }).map(([name, time]) => (
        <div key={name} className="text-center">
          <div className="font-semibold">{name}</div>
          <div>{time}</div>
        </div>
      ))}
      <div className="text-center">
        <div className="font-semibold">القبلة</div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-6" style={{ transform: `rotate(${angle}deg)` }}>
            🧭
          </div>
          <button className="text-xs mt-1 underline" onClick={updateLocation}>
            تحديث الموقع
          </button>
        </div>
      </div>
    </div>
  );
}
