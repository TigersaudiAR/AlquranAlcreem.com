import { useState } from 'react';
import { Link } from 'wouter';

/** شريط علوي بسيط لاختيار اللغة وزر لفتح المصحف */
export default function TopBar() {
  const [lang, setLang] = useState('ar');

  return (
    <div className="fixed top-0 inset-x-0 bg-background/70 backdrop-blur z-20 border-b flex justify-between items-center px-4 py-2 text-sm">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="border rounded px-2 py-1 bg-background"
      >
        <option value="ar">العربية</option>
        <option value="en">English</option>
      </select>
      <Link
        href="/quran"
        className="text-primary font-medium hover:underline"
      >
        القرآن الكريم
      </Link>
    </div>
  );
}
