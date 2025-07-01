import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate the complete HTML document with embedded styles and scripts
 */
export function generateHtmlDocument(bodyHtml: string): string {
  const stylesPath = join(__dirname, 'styles.css');
  const scriptsPath = join(__dirname, 'scripts.js');
  
  // Read the CSS and JS files
  const styles = readFileSync(stylesPath, 'utf8');
  const scripts = readFileSync(scriptsPath, 'utf8');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SARIF Report Viewer</title>
    <style>
        ${styles}
    </style>
</head>
<body>
    <div id="root">${bodyHtml}</div>
    
    <script>
        ${scripts}
    </script>
</body>
</html>`;
} 