
#!/bin/bash

# سكريبت لبدء تشغيل التطبيق
echo "بدء تشغيل تطبيق القرآن الكريم..."

# التحقق من عمليات تشغيل سابقة وإيقافها
echo "التحقق من العمليات الجارية..."
RUNNING_PROCS=$(lsof -i :5000 -t)
if [ ! -z "$RUNNING_PROCS" ]; then
  echo "إيقاف العمليات الجارية على المنفذ 5000..."
  kill -9 $RUNNING_PROCS
fi

# تثبيت أو تحديث الحزم إذا لزم الأمر
if [ ! -d "node_modules" ]; then
  echo "تثبيت حزم Node.js..."
  npm install
fi

# تشغيل التطبيق
echo "بدء تشغيل الخادم..."
npm run dev
