import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">الصفحة غير موجودة</p>
      <Link href="/">
        <a className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
          العودة إلى الصفحة الرئيسية
        </a>
      </Link>
    </div>
  );
}