import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import { execSync } from 'child_process';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  // Step 1: Generate CSS variables from TypeScript constants
  const compiledPath = path.join(__dirname, '../../../../dist/remarkable-ui/styles/styles.constants.js');
  
  // Ensure the compiled file exists by running TypeScript compilation
  if (!fs.existsSync(compiledPath)) {
    console.log('Compiling TypeScript...');
    execSync('tsc', { stdio: 'inherit' });
  }

  // Temporarily rename the file to .cjs to force CommonJS interpretation
  const cjsPath = compiledPath.replace('.js', '.cjs');
  fs.copyFileSync(compiledPath, cjsPath);
  
  // Use createRequire to import CommonJS module in ES module context
  const require = createRequire(import.meta.url);
  const { styles } = require(cjsPath);
  
  // Clean up the temporary .cjs file
  fs.unlinkSync(cjsPath);

  // Validate and generate CSS
  const styleCount = Object.keys(styles).length;
  if (styleCount === 0) {
    throw new Error('No styles found in constants file');
  }

  console.log(`✅ Found ${styleCount} CSS variables in constants file`);

  // Generate CSS content
  const cssContent = `:root {\n${Object.entries(styles).map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}`;

  // Step 2: Merge variables into the main CSS file
  const mainCssPath = path.join(__dirname, '../../../../dist/remarkable-ui.css');
  
  if (!fs.existsSync(mainCssPath)) {
    throw new Error('Main CSS file not found. Run embeddable buildPackage first.');
  }
  
  // Read the main CSS file
  const mainCss = fs.readFileSync(mainCssPath, 'utf8');
  
  // Merge: variables first, then main CSS
  const mergedCss = cssContent + '\n' + mainCss;
  
  // Write the merged CSS back to the main file
  fs.writeFileSync(mainCssPath, mergedCss);
  
  console.log('✅ Successfully merged CSS variables into remarkable-ui.css');
  console.log(`📁 Final CSS: ${mainCssPath}`);
  
} catch (error) {
  // Clean up temporary .cjs file if it exists
  const cjsPath = path.join(__dirname, '../../../../dist/remarkable-ui/styles/styles.constants.cjs');
  if (fs.existsSync(cjsPath)) {
    fs.unlinkSync(cjsPath);
  }
  
  console.error('❌ Error processing CSS variables:');
  console.error(`   ${error.message}`);
  console.error('');
  console.error('Please check:');
  console.error('   1. The project has been built (npm run build)');
  console.error('   2. The compiled file exists at: dist/remarkable-ui/styles/styles.constants.js');
  console.error('   3. The main CSS file exists at: dist/remarkable-ui.css');
  console.error('   4. You have write permissions to the dist directory');
  process.exit(1);
}
