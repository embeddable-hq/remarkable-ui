import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const constantsPath = path.join(__dirname, '../src/remarkable-ui/styles/styles.constants.ts');

try {
  // Check if the constants file exists
  if (!fs.existsSync(constantsPath)) {
    throw new Error(`Constants file not found: ${constantsPath}`);
  }

  const constantsContent = fs.readFileSync(constantsPath, 'utf8');

  // Extract and parse style objects safely using a more robust approach
  const extractObject = (content, objectName) => {
    // Find the start of the object declaration
    const objectStartRegex = new RegExp(`const\\s+${objectName}\\s*=\\s*\\{`);
    const startMatch = objectStartRegex.exec(content);
    if (!startMatch) {
      throw new Error(`Could not find ${objectName} declaration in constants file`);
    }
    
    const startIndex = startMatch.index + startMatch[0].length;
    let braceCount = 1;
    let currentIndex = startIndex;
    let objectContent = '';
    
    // Find the matching closing brace
    while (currentIndex < content.length && braceCount > 0) {
      const char = content[currentIndex];
      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
      }
      if (braceCount > 0) {
        objectContent += char;
      }
      currentIndex++;
    }
    
    if (braceCount !== 0) {
      throw new Error(`Could not find matching closing brace for ${objectName}`);
    }
    
    // Parse key-value pairs more robustly
    const parsedObject = {};
    
    // Handle both single and double quotes, and various spacing
    const keyValueRegex = /(['"`])([^'"`]+)\1\s*:\s*(['"`])([^'"`]+)\3/g;
    let keyValueMatch;
    while ((keyValueMatch = keyValueRegex.exec(objectContent)) !== null) {
      const [, , key, , value] = keyValueMatch;
      parsedObject[key] = value;
    }
    
    return parsedObject;
  };

  // Extract and combine all style objects
  const styleObjects = ['stylesColors', 'stylesSpacingAndSizes', 'stylesBorders', 'stylesComponents', 'stylesTypography', 'stylesShadow'];
  const styles = Object.assign({}, ...styleObjects.map(name => extractObject(constantsContent, name)));

  // Validate and generate CSS
  const styleCount = Object.keys(styles).length;
  if (styleCount === 0) {
    throw new Error('No styles found in constants file');
  }

  console.log(`✅ Found ${styleCount} CSS variables in constants file`);

  // Generate CSS content
  const cssContent = `:root {\n${Object.entries(styles).map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}`;

  // Write the CSS file
  const cssFilePath = path.join(__dirname, '../dist/remarkable-ui-variables.css');
  fs.mkdirSync(path.dirname(cssFilePath), { recursive: true });
  fs.writeFileSync(cssFilePath, cssContent);

  console.log('✅ Generated remarkable-ui-variables.css');
  console.log(`📁 Location: ${cssFilePath}`);
} catch (error) {
  console.error('❌ Error generating CSS variables:');
  console.error(`   ${error.message}`);
  console.error('');
  console.error('Please check:');
  console.error('   1. The constants file exists at: src/remarkable-ui/styles/styles.constants.ts');
  console.error(
    '   2. The file contains the required style objects (stylesColors, stylesSpacingAndSizes, etc.)',
  );
  console.error('   3. The file syntax is valid TypeScript');
  console.error('   4. You have write permissions to the dist directory');
  process.exit(1);
}
