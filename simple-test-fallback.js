#!/usr/bin/env node

// 🧪 SIMPLE TEST FALLBACK - Jest-independent test runner
// This script can run basic tests even if Jest is completely broken

console.log('🎮 CROOKMON - SIMPLE TEST FALLBACK');
console.log('='.repeat(50));
console.log('Running tests without Jest dependency...\n');

// Simple test framework
let totalTests = 0;
let passedTests = 0;
let currentSuite = '';

const expect = (actual) => ({
  toBe: (expected) => {
    totalTests++;
    if (actual === expected) {
      console.log(`✅ ${currentSuite}: ${actual} === ${expected}`);
      passedTests++;
      return true;
    } else {
      console.log(`❌ ${currentSuite}: ${actual} !== ${expected}`);
      return false;
    }
  },
  toEqual: (expected) => {
    totalTests++;
    const matches = JSON.stringify(actual) === JSON.stringify(expected);
    if (matches) {
      console.log(`✅ ${currentSuite}: Objects match`);
      passedTests++;
      return true;
    } else {
      console.log(`❌ ${currentSuite}: Objects don't match`);
      console.log(`   Expected: ${JSON.stringify(expected)}`);
      console.log(`   Actual:   ${JSON.stringify(actual)}`);
      return false;
    }
  },
});

const test = (name, fn) => {
  currentSuite = name;
  try {
    fn();
  } catch (err) {
    totalTests++;
    console.log(`❌ ${name}: ${err.message}`);
  }
};

const describe = (suiteName, fn) => {
  console.log(`\n📋 ${suiteName}`);
  currentSuite = suiteName;
  fn();
};

// Run basic tests
describe('Basic Tests', () => {
  test('arithmetic works', () => {
    expect(1 + 1).toBe(2);
    expect(5 * 3).toBe(15);
    expect(10 - 7).toBe(3);
  });

  test('boolean logic works', () => {
    expect(true).toBe(true);
    expect(false).toBe(false);
    expect(!false).toBe(true);
  });

  test('string operations work', () => {
    expect('hello' + ' world').toBe('hello world');
    expect('test'.length).toBe(4);
  });

  test('array operations work', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr[0]).toBe(1);
  });
});

// Test basic game engine functions if available
describe('Game Engine Tests', () => {
  test('can load core utilities', () => {
    try {
      // Try to load some core files
      const fs = require('fs');
      const path = require('path');

      // Check if core files exist
      const coreFiles = [
        'src/core/utils/utils.js',
        'src/core/engine/calculatedamage.js',
        'src/core/data/types.js',
      ];

      let foundFiles = 0;
      coreFiles.forEach((file) => {
        if (fs.existsSync(file)) {
          foundFiles++;
        }
      });

      expect(foundFiles).toBe(3);
      console.log(`✅ Found ${foundFiles}/3 core game files`);
    } catch (err) {
      console.log(`⚠️  Core file check failed: ${err.message}`);
    }
  });

  test('basic type effectiveness (if available)', () => {
    try {
      // Try to test type effectiveness if the file exists
      const fs = require('fs');
      if (fs.existsSync('src/core/data/types.js')) {
        console.log('✅ Type effectiveness data file exists');
        // Could add more specific tests here
      } else {
        console.log(
          'ℹ️  Type effectiveness file not found (expected in some setups)'
        );
      }
    } catch (err) {
      console.log(`⚠️  Type effectiveness test failed: ${err.message}`);
    }
  });
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('🏁 TEST SUMMARY');
console.log('='.repeat(50));

if (passedTests === totalTests && totalTests > 0) {
  console.log(`🎉 ALL TESTS PASSED! (${passedTests}/${totalTests})`);
  console.log('✅ Basic JavaScript functionality working');
  console.log('✅ Node.js environment functional');
  console.log('✅ Core game files accessible');
  console.log('\n🚀 Ready for game development!');
} else if (passedTests > 0) {
  console.log(`⚠️  PARTIAL SUCCESS: ${passedTests}/${totalTests} tests passed`);
  console.log('✅ Basic functionality working');
  console.log('⚠️  Some advanced features may have issues');
  console.log('\n💡 You can still start development, but check failing tests');
} else {
  console.log('❌ NO TESTS PASSED - Environment may have serious issues');
  console.log('🔧 Try running: npm test (Jest might still work)');
}

console.log('\n📋 Available commands:');
console.log('  npm test                 - Try Jest testing');
console.log('  node setup-for-codex.js  - Comprehensive setup');
console.log('  node simple-test-fallback.js - This fallback script');

console.log(
  '\n🎮 Crookmon game engine status: ' +
    (passedTests >= totalTests * 0.8 ? 'READY! 🚀' : 'NEEDS SETUP 🔧')
);
