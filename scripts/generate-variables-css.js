import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import { execSync } from 'child_process';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compiledPath = path.join(__dirname, '../dist/remarkable-ui/styles/styles.constants.js');

try {
  // Ensure the compiled file exists by running the build
  if (!fs.existsSync(compiledPath)) {
    console.log('Building project...');
    execSync('npm run build', { stdio: 'inherit' });
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

  // Write the CSS file
  const cssFilePath = path.join(__dirname, '../dist/remarkable-ui-variables.css');
  fs.mkdirSync(path.dirname(cssFilePath), { recursive: true });
  fs.writeFileSync(cssFilePath, cssContent);

  console.log('✅ Generated remarkable-ui-variables.css');
  console.log(`📁 Location: ${cssFilePath}`);
} catch (error) {
  // Clean up temporary .cjs file if it exists
  const cjsPath = compiledPath.replace('.js', '.cjs');
  if (fs.existsSync(cjsPath)) {
    fs.unlinkSync(cjsPath);
  }
  
  console.error('❌ Error generating CSS variables:');
  console.error(`   ${error.message}`);
  console.error('');
  console.error('Please check:');
  console.error('   1. The project has been built (npm run build)');
  console.error('   2. The compiled file exists at: dist/remarkable-ui/styles/styles.constants.js');
  console.error('   3. You have write permissions to the dist directory');
  process.exit(1);
}
