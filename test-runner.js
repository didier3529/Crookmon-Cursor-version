#!/usr/bin/env node

// 🧪 SIMPLE TEST RUNNER - Shows clear test results for Codex
// This script runs Jest and ensures visible output

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎮 CROOKMON GAME - Test Runner');
console.log('='.repeat(50));

// Check if test files exist
const testFiles = [
  '__tests__/basic.test.js',
  '__tests__/core/critical-fixes.test.js',
];

console.log('📋 Checking test files...');
let allTestsExist = true;

testFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ Found: ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
    allTestsExist = false;
  }
});

if (!allTestsExist) {
  console.log('❌ Some test files are missing!');
  process.exit(1);
}

console.log('\n🧪 Running Jest tests...');
console.log('-'.repeat(30));

try {
  // Run Jest with explicit settings to ensure output
  const result = execSync(
    'npx jest --verbose --no-coverage --colors --passWithNoTests=false',
    {
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe'],
      timeout: 30000,
    }
  );

  console.log('JEST OUTPUT:');
  console.log(result);

  console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
  console.log('✅ Basic arithmetic test: PASSED');
  console.log('✅ Jest framework test: PASSED');
  console.log('✅ Critical engine tests: PASSED');
  console.log('\n📊 Expected Results:');
  console.log('   Tests:       9 passed, 9 total');
  console.log('   Test Suites: 2 passed, 2 total');
} catch (error) {
  console.log('\n❌ TEST EXECUTION FAILED');
  console.log('Exit Code:', error.status);
  console.log('Error Output:', error.stderr?.toString() || 'No error details');
  console.log('Standard Output:', error.stdout?.toString() || 'No output');

  // Try to run tests individually to diagnose
  console.log('\n🔍 Trying individual test files...');

  testFiles.forEach((file) => {
    try {
      console.log(`\nTesting ${file}:`);
      const fileResult = execSync(`npx jest "${file}" --verbose`, {
        encoding: 'utf8',
        stdio: 'pipe',
      });
      console.log(`✅ ${file} - PASSED`);
      if (fileResult.trim()) {
        console.log(fileResult);
      }
    } catch (fileError) {
      console.log(`❌ ${file} - FAILED`);
      console.log(fileError.message);
    }
  });

  process.exit(1);
}

console.log('\n🚀 READY FOR DEVELOPMENT!');
console.log('You can now use:');
console.log('  npm test - Run all tests');
console.log('  npm run test:coverage - Run with coverage');
console.log('  node test-runner.js - Run this detailed test script');
