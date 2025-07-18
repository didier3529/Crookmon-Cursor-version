// Direct test runner for Codex
const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 CODEX TEST RUNNER - Jest Setup Verification\n');

// Check Node version
console.log('📋 Environment Check:');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js: ${nodeVersion.trim()}`);
} catch (e) {
  console.error('❌ Node.js not found');
}

// Check npm version
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' });
  console.log(`✅ npm: ${npmVersion.trim()}`);
} catch (e) {
  console.error('❌ npm not found');
}

// List test files manually
console.log('\n📁 Test Files Found:');
const fs = require('fs');
const testDir = '__tests__';
if (fs.existsSync(testDir)) {
  const files = fs.readdirSync(testDir, { recursive: true });
  files.forEach((file) => {
    if (file.includes('.test.') || file.includes('.spec.')) {
      console.log(`  ✅ ${file}`);
    }
  });
} else {
  console.log('  ❌ __tests__ directory not found');
}

// Run specific test
console.log('\n🧪 Running Basic Tests:');
try {
  const result = execSync(
    'npx jest __tests__/basic.test.js --verbose --no-cache',
    {
      encoding: 'utf8',
      stdio: 'pipe',
    }
  );
  console.log('✅ Test Results:');
  console.log(result);
} catch (error) {
  console.error('❌ Test Error:');
  console.error('STDOUT:', error.stdout);
  console.error('STDERR:', error.stderr);
  console.error('Message:', error.message);
}

console.log('\n📊 Summary for Codex:');
console.log('- To run tests: npm test');
console.log('- To run specific test: npx jest __tests__/basic.test.js');
console.log('- Test config: jest.config.js');
console.log('- Babel config: babel.config.js');
