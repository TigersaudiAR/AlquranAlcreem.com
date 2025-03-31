#!/bin/bash
set -e # Exit immediately if any command fails

echo "====== DEPLOYMENT FIX SCRIPT ======"
echo "This script prepares the environment for deployment"

# Make this script executable
chmod +x deploy_fix.sh

# Create necessary directories
mkdir -p public/fonts
mkdir -p public/assets
mkdir -p public/images
mkdir -p dist

echo "Created directories structure"

# Ensure the pre-build.sh script is executable
chmod +x pre-build.sh
echo "Made pre-build.sh executable"

# Copy font files if they exist
if [ -f "UthmanicHafs.woff" ]; then
  cp UthmanicHafs.woff public/fonts/
  echo "Copied UthmanicHafs.woff to public/fonts/"
fi

if [ -f "UthmanicHafs.woff2" ]; then
  cp UthmanicHafs.woff2 public/fonts/
  echo "Copied UthmanicHafs.woff2 to public/fonts/"
fi

# Create a simple HTML file in the public directory to confirm it's working
cat > public/deployment-test.html << 'EOL'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تطبيق القرآن الكريم - اختبار النشر</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      text-align: center;
      margin: 50px;
      direction: rtl;
    }
    .success {
      color: green;
      font-size: 24px;
      margin: 20px 0;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>اختبار النشر</h1>
    <p class="success">✓ تم تحميل الصفحة بنجاح!</p>
    <p>إذا كنت ترى هذه الصفحة، فهذا يعني أن خادم الويب يعمل بشكل صحيح ويمكن الوصول إلى الملفات الثابتة.</p>
    <p>الوقت الحالي: <span id="current-time"></span></p>
  </div>

  <script>
    document.getElementById('current-time').textContent = new Date().toLocaleString('ar-SA');
  </script>
</body>
</html>
EOL

echo "Created deployment test page at public/deployment-test.html"

# Verify source files exist
if [ ! -f "client/src/main.tsx" ]; then
  echo "ERROR: client/src/main.tsx not found!"
  exit 1
fi

if [ ! -f "client/index.html" ]; then
  echo "ERROR: client/index.html not found!"
  exit 1
fi

echo "Verified source files exist"

# Display summary of files in key directories
echo "Directory structure:"
echo "- client:"
ls -la client/
echo "- client/src:"
ls -la client/src/
echo "- public:"
ls -la public/

echo "====== DEPLOYMENT FIX COMPLETE ======"
echo "Run this script before attempting deployment."