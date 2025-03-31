node http-server.js
#!/bin/bash

# سكريبت انطلاق مبسط
echo "انطلاق تطبيق القرآن الكريم..."

# إيقاف أي عمليات على المنفذ 5000
if lsof -i :5000 -t; then
  echo "إيقاف العمليات الحالية على المنفذ 5000..."
  kill -9 $(lsof -i :5000 -t)
  sleep 1
fi

# تشغيل التطبيق
NODE_ENV=development npm run dev
