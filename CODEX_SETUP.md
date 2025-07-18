# 🧪 CODEX JEST SETUP GUIDE

## Quick Start for Testing

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests (Multiple Options)

**Option A: Standard npm test**
```bash
npm test
```

**Option B: Direct Jest (more verbose)**
```bash
npx jest --verbose
```

**Option C: Specific test file**
```bash
npx jest __tests__/basic.test.js --verbose
```

**Option D: Coverage report**
```bash
npm run test:coverage
```

### 3. Verification Script for Codex
```bash
node run-tests.js
```

## 📋 Test Status

✅ **Jest Version**: 29.7.0
✅ **Test Files Found**:
- `__tests__/basic.test.js` (2 tests)
- `__tests__/core/critical-fixes.test.js` (7 tests)

✅ **Configuration Files**:
- `jest.config.js` - Jest configuration
- `babel.config.js` - TypeScript/React support
- `package.json` - Test scripts

## 🔧 Configuration Details

### Jest Config (`jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  transform: { '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest' },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  verbose: true,
};
```

### Babel Config (`babel.config.js`)
```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: ['@babel/plugin-transform-class-properties']
};
```

## 🎯 Expected Test Results

**Basic Tests**: 2 passing
- Simple arithmetic validation
- Jest framework validation

**Critical Fixes**: 7 passing
- Jest setup validation
- Type effectiveness logic
- RNG functionality
- Damage calculation
- Core engine validation

## 🚨 Troubleshooting for Codex

If `npm test` doesn't show output:

1. **Try direct Jest**:
   ```bash
   npx jest --verbose --no-cache
   ```

2. **Run verification script**:
   ```bash
   node run-tests.js
   ```

3. **Check specific file**:
   ```bash
   npx jest __tests__/basic.test.js
   ```

4. **Ensure dependencies installed**:
   ```bash
   npm install
   ```

## 📦 Required Dependencies

All included in `package.json`:
- jest: ^29.7.0
- @babel/preset-typescript
- @babel/preset-react
- @babel/plugin-transform-class-properties

## ✅ Verification Checklist for Codex

- [ ] Clone repository from GitHub
- [ ] Run `npm install`
- [ ] Run `npm test` or `npx jest --verbose`
- [ ] See test results showing 9/9 tests passing
- [ ] Run `node run-tests.js` for detailed verification

**All configuration files are committed to GitHub and ready for Codex!**
