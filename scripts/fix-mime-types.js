const fs = require('fs');
const path = require('path');

// Path to the main.js file in the output directory
const distPath = path.resolve(__dirname, '../dist');
const indexJsPath = path.resolve(distPath, 'index.js');
const indexHtmlPath = path.resolve(distPath, 'index.html');

// Fix JavaScript file
if (fs.existsSync(indexJsPath)) {
  console.log('Processing index.js...');
  let content = fs.readFileSync(indexJsPath, 'utf8');
  
  // Add the mime type comment to the beginning of the file
  if (!content.startsWith('/* application/javascript */')) {
    content = '/* application/javascript */\n' + content;
    fs.writeFileSync(indexJsPath, content);
    console.log('✅ MIME type header added to index.js');
  }
}

// Fix HTML file if it exists
if (fs.existsSync(indexHtmlPath)) {
  console.log('Processing index.html...');
  let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Update script tags to include type="application/javascript"
  const updatedHtml = htmlContent.replace(
    /<script([^>]*)>/g, 
    (match, attrs) => {
      if (!attrs.includes('type=')) {
        return `<script${attrs} type="application/javascript">`;
      }
      return match;
    }
  );
  
  fs.writeFileSync(indexHtmlPath, updatedHtml);
  console.log('✅ Script tags updated in index.html');
}

console.log('MIME type fixing completed!'); 