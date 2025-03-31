
#!/bin/bash

# سكريبت لتنظيف الملفات المتكررة غير الضرورية
echo "بدء عملية تنظيف الملفات المتكررة..."

# 1. إنشاء نسخة احتياطية من الملفات المهمة التي سيتم الاحتفاظ بها
echo "إنشاء نسخة احتياطية من الملفات المهمة..."
mkdir -p backup/public/data/translations

# نسخ الملفات المهمة إلى النسخة الاحتياطية
if [ -d "public/data/translations" ]; then
  cp -r public/data/translations/* backup/public/data/translations/
fi

# 2. حذف المجلدات المتكررة
echo "حذف المجلدات المتكررة..."

# قائمة المجلدات المتكررة التي سيتم حذفها
DUPLICATE_FOLDERS=(
  "quran_api_extracted"
  "extracted/quranforall-V5"
)

for folder in "${DUPLICATE_FOLDERS[@]}"; do
  if [ -d "$folder" ]; then
    echo "حذف المجلد: $folder"
    rm -rf "$folder"
  fi
done

# 3. حذف الملفات غير الضرورية
echo "حذف الملفات غير الضرورية..."
UNNECESSARY_FILES=(
  "duplicate_files.txt"
  "basic-server.mjs"
  "direct-server.js"
  "http-server.js"
  "index.js"
  "micro-server.js"
  "replit-server.js"
  "server-direct.js"
  "server.js"
  "simple-script.js"
  "simple-server.js"
  "start-server.js"
  "workflow-debug.js"
)

for file in "${UNNECESSARY_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "حذف الملف: $file"
    rm -f "$file"
  fi
done

echo "تم الانتهاء من تنظيف الملفات المتكررة."
