import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-amber-50 dark:bg-slate-900">
      <Card className="w-full max-w-md mx-4 border-amber-200 dark:border-slate-700 shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center mb-4 gap-4">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-amber-50 font-amiri">
              404 - الصفحة غير موجودة
            </h1>
          </div>

          <p className="mt-4 text-center text-gray-600 dark:text-gray-300 font-amiri text-lg">
            نأسف، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pb-6">
          <Button 
            variant="outline" 
            asChild
            className="border-amber-500 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900 dark:text-amber-100"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              العودة للصفحة الرئيسية
            </Link>
          </Button>
          <Button 
            asChild
            className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800"
          >
            <Link href="/quran">
              الذهاب للقرآن الكريم
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
