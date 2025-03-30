
#!/bin/bash
# Create necessary directories
mkdir -p public/fonts

# Copy font files to public directory if they exist in root
if [ -f "UthmanicHafs.woff" ]; then
  cp UthmanicHafs.woff public/fonts/
fi

if [ -f "UthmanicHafs.woff2" ]; then
  cp UthmanicHafs.woff2 public/fonts/
fi

# Create font CSS file if it doesn't exist
if [ ! -f "public/fonts/UthmanicHafs.css" ]; then
  cat > public/fonts/UthmanicHafs.css << 'EOL'
@font-face {
  font-family: 'UthmanicHafs';
  src: url('UthmanicHafs.woff2') format('woff2'),
       url('UthmanicHafs.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
EOL
fi

echo "Pre-build preparation complete!"
