// Simple Jest verification script
const { execSync } = require('child_process');

console.log('🧪 Testing Jest Setup...\n');

try {
  // Run Jest with explicit output
  console.log('Running: npx jest --passWithNoTests --verbose');
  const output = execSync('npx jest --passWithNoTests --verbose', {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  console.log('✅ Jest Output:');
  console.log(output);

  console.log('\n🔍 Checking test files...');
  const listTests = execSync('npx jest --listTests', {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  console.log('📋 Test files found:');
  console.log(listTests || 'No test files listed');
} catch (error) {
  console.error('❌ Jest Error:', error.message);
  console.error('📜 Error Details:', error.stdout || error.stderr);
}

console.log('\n📦 Checking Jest installation...');
try {
  const jestVersion = execSync('npx jest --version', { encoding: 'utf8' });
  console.log('Jest version:', jestVersion.trim());
} catch (e) {
  console.error('Jest not found:', e.message);
}
