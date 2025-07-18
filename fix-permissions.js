#!/usr/bin/env node

// 🚀 CODEX PERMISSIONS FIX - Cross-platform Node.js script
// This script fixes executable permissions for Jest and other binaries

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing executable permissions for Codex environment...');
console.log('📁 Processing node_modules/.bin/*');

const binDir = path.join(__dirname, 'node_modules', '.bin');

try {
  // Check if .bin directory exists
  if (!fs.existsSync(binDir)) {
    console.error('❌ ERROR: node_modules/.bin directory not found');
    process.exit(1);
  }

  // Get all files in .bin directory
  const binFiles = fs.readdirSync(binDir);
  let fixedCount = 0;

  binFiles.forEach((file) => {
    const filePath = path.join(binDir, file);
    const stats = fs.statSync(filePath);

    // Only process regular files (not .cmd or .ps1 files)
    if (stats.isFile() && !file.endsWith('.cmd') && !file.endsWith('.ps1')) {
      try {
        // Use chmod on Unix systems
        if (process.platform !== 'win32') {
          fs.chmodSync(filePath, 0o755); // rwxr-xr-x
          fixedCount++;
        }
      } catch (err) {
        console.warn(
          `⚠️  Warning: Could not fix permissions for ${file}: ${err.message}`
        );
      }
    }
  });

  if (process.platform === 'win32') {
    console.log('ℹ️  Windows detected - permissions fix not needed');
  } else {
    console.log(`✅ Fixed permissions for ${fixedCount} binary files`);
  }

  // Test Jest specifically
  const jestPath = path.join(binDir, 'jest');
  if (fs.existsSync(jestPath)) {
    try {
      const stats = fs.statSync(jestPath);
      if (process.platform !== 'win32' && stats.mode & 0o111) {
        console.log('✅ Jest binary is now executable');
      } else if (process.platform === 'win32') {
        console.log('✅ Jest binary ready (Windows)');
      } else {
        console.log('❌ Jest binary may still not be executable');
      }
    } catch (err) {
      console.error('❌ Error checking Jest binary:', err.message);
    }
  }

  // Test Jest execution
  console.log('\n🧪 Testing Jest execution...');
  try {
    const jestVersion = execSync('./node_modules/.bin/jest --version', {
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim();
    console.log(`✅ Jest version: ${jestVersion}`);
  } catch (err) {
    console.error('❌ Jest execution test failed:', err.message);
    console.log('\n💡 Try running: npm run setup:codex');
    process.exit(1);
  }

  console.log('\n🚀 Running test suite to verify everything works...');
  try {
    execSync('npm test', { stdio: 'inherit' });
    console.log('\n🎉 SUCCESS! All tests are working properly.');
    console.log('📝 You can now use: npm test, npm run test:coverage, etc.');
  } catch (err) {
    console.error('\n❌ Tests failed. Check the output above for details.');
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Unexpected error:', err.message);
  process.exit(1);
}
