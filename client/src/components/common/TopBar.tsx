import { useState } from 'react';
import { Link } from 'wouter';

/**
 * شريط علوي ثابت لاختيار اللغة مع زر سريع للوصول إلى المصحف.
 * يحافظ على بساطة الواجهة من دون إبراز شعارات أو عناصر مشتتة.
 */
export default function TopBar() {
  const [lang, setLang] = useState('ar');

  return (
    <header className="fixed top-0 inset-x-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="container flex items-center justify-between gap-3 px-4 py-2 text-sm">
        <label className="inline-flex items-center gap-2 text-muted-foreground">
          <span className="hidden sm:inline">اللغة</span>
          <select
            value={lang}
            onChange={(event) => setLang(event.target.value)}
            className="rounded-md border bg-background px-2 py-1 text-foreground shadow-sm"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </label>

        <Link
          href="/quran"
          className="rounded-full bg-primary/10 px-3 py-1 text-primary transition hover:bg-primary/20"
        >
          القرآن الكريم
        </Link>
      </div>
    </header>
  );
}
