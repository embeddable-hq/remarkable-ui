import fs from 'fs';
import path from 'path';
import process from 'process';
import { execSync } from 'child_process';
import { createRequire } from 'module';

// Configuration
const sourcePath = path.join(process.cwd(), 'src/remarkable-ui/styles/styles.constants.ts');
const mainCssPath = path.join(process.cwd(), 'dist/remarkable-ui.css');
const tempDir = path.join(process.cwd(), 'temp-css-vars');

// Cleanup function
const cleanup = () => {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('🧹 Cleaned up temporary files');
  }
};

try {
  // Validate source file exists
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found: ${sourcePath}`);
  }

  // Create temp directory and compile TypeScript
  fs.mkdirSync(tempDir, { recursive: true });
  console.log('Compiling TypeScript constants...');

  execSync(
    `npx tsc "${sourcePath}" --outDir "${tempDir}" --target es2022 --module commonjs --esModuleInterop`,
    {
      stdio: 'inherit',
    },
  );

  // Import compiled module
  const tempCompiledPath = path.join(tempDir, 'styles.constants.js');
  const tempCjsPath = tempCompiledPath.replace('.js', '.cjs');
  fs.renameSync(tempCompiledPath, tempCjsPath);

  const require = createRequire(import.meta.url);
  const { styles } = require(tempCjsPath);

  // Validate and process styles
  if (!styles || typeof styles !== 'object' || Object.keys(styles).length === 0) {
    throw new Error('No valid styles found in constants file');
  }

  console.log(`✅ Found ${Object.keys(styles).length} CSS variables`);

  // Generate CSS variables
  const cssVariables = `:root, :host {\n${Object.entries(styles)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')}\n}`;

  // Merge with main CSS file
  if (!fs.existsSync(mainCssPath)) {
    throw new Error('Main CSS file not found. Run embeddable buildPackage first.');
  }

  const mainCss = fs.readFileSync(mainCssPath, 'utf8');
  fs.writeFileSync(mainCssPath, cssVariables + '\n' + mainCss);

  console.log('✅ Successfully merged CSS variables into remarkable-ui.css');
  console.log(`📁 Final CSS: ${mainCssPath}`);
} catch (error) {
  console.error('❌ Error processing CSS variables:');
  console.error(`   ${error.message}`);
  console.error('');
  console.error('Please check:');
  console.error('   1. Source file exists: src/remarkable-ui/styles/styles.constants.ts');
  console.error('   2. Main CSS file exists: dist/remarkable-ui.css');
  console.error('   3. Write permissions to dist directory');
  console.error('   4. TypeScript is installed');
  process.exit(1);
} finally {
  cleanup();
}
