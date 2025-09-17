import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the TypeScript constants file and extract the styles object
const constantsPath = path.join(__dirname, '../src/remarkable-ui/styles/styles.constants.ts');

try {
  // Check if the constants file exists
  if (!fs.existsSync(constantsPath)) {
    throw new Error(`Constants file not found: ${constantsPath}`);
  }

  const constantsContent = fs.readFileSync(constantsPath, 'utf8');

  // Extract all the individual style objects
  const extractObject = (content, objectName) => {
    const regex = new RegExp(`const ${objectName} = ({[\\s\\S]*?});`, 'g');
    const match = regex.exec(content);
    if (!match) {
      throw new Error(`Could not find ${objectName} in constants file`);
    }
    return match[1];
  };

  // Extract all style objects
  const stylesColors = extractObject(constantsContent, 'stylesColors');
  const stylesSpacingAndSizes = extractObject(constantsContent, 'stylesSpacingAndSizes');
  const stylesBorders = extractObject(constantsContent, 'stylesBorders');
  const stylesComponents = extractObject(constantsContent, 'stylesComponents');
  const stylesTypography = extractObject(constantsContent, 'stylesTypography');
  const stylesShadow = extractObject(constantsContent, 'stylesShadow');

  // Combine all styles into one object
  const stylesCode = `{
    ...${stylesColors},
    ...${stylesSpacingAndSizes},
    ...${stylesBorders},
    ...${stylesComponents},
    ...${stylesTypography},
    ...${stylesShadow}
  }`;

  const styles = eval(`(${stylesCode})`);

  // Validate that styles object was created successfully
  if (!styles || typeof styles !== 'object') {
    throw new Error('Failed to parse styles object from constants file');
  }

  // Check if we have any styles
  const styleKeys = Object.keys(styles);
  if (styleKeys.length === 0) {
    throw new Error('No styles found in constants file');
  }

  console.log(`✅ Found ${styleKeys.length} CSS variables in constants file`);

  // Generate CSS variables
  const generateCssVariables = (variables) => {
    let cssContent = ':root {\n';
    
    Object.entries(variables).forEach(([key, value]) => {
      cssContent += `  ${key}: ${value};\n`;
    });
    
    cssContent += '}\n';
    return cssContent;
  };

  // Generate the CSS content
  const cssContent = generateCssVariables(styles);

  // Ensure the dist directory exists
  const distDir = path.join(__dirname, '../dist/remarkable-ui/styles');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write the CSS file
  const cssFilePath = path.join(distDir, 'remarkable-ui-variables.css');
  fs.writeFileSync(cssFilePath, cssContent);

  console.log('✅ Generated remarkable-ui-variables.css');
  console.log(`📁 Location: ${cssFilePath}`);

} catch (error) {
  console.error('❌ Error generating CSS variables:');
  console.error(`   ${error.message}`);
  console.error('');
  console.error('Please check:');
  console.error('   1. The constants file exists at: src/remarkable-ui/styles/styles.constants.ts');
  console.error('   2. The file contains the required style objects (stylesColors, stylesSpacingAndSizes, etc.)');
  console.error('   3. The file syntax is valid TypeScript');
  console.error('   4. You have write permissions to the dist directory');
  process.exit(1);
}
