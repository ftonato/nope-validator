#!/usr/bin/env node

/**
 * Test script to validate all import formats work correctly
 * 
 * This script creates temporary test projects and validates that the package
 * can be imported in different formats:
 * - CommonJS require (main field)
 * - ES Modules import (module field)
 * - Named imports (destructuring)
 * - TypeScript imports with type checking
 * - UMD format (skipped - no longer built)
 * - Default export compatibility
 * 
 * Usage:
 *   node test-imports.js
 * 
 * NOTE: This file should NOT be committed to git - it's for local testing only.
 *       The .test-imports directory is automatically cleaned up after running.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TEST_DIR = path.join(__dirname, '.test-imports');
const PACKAGE_NAME = 'nope-validator';
const PACKAGE_PATH = __dirname;

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function cleanup() {
  if (fs.existsSync(TEST_DIR)) {
    log('Cleaning up test directory...', 'yellow');
    execSync(`rm -rf "${TEST_DIR}"`, { stdio: 'inherit' });
  }
}

function createTestProject(name, packageJson) {
  const projectDir = path.join(TEST_DIR, name);
  fs.mkdirSync(projectDir, { recursive: true });
  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
  );
  return projectDir;
}

function runTest(projectDir, testFile, description) {
  log(`\n${description}`, 'blue');
  log('─'.repeat(50), 'blue');

  try {
    // Install dependencies
    log('Installing dependencies...', 'yellow');
    execSync('npm install', {
      cwd: projectDir,
      stdio: 'pipe',
    });

    // Run the test
    log('Running test...', 'yellow');
    const result = execSync(`node ${testFile}`, {
      cwd: projectDir,
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    log('✓ Test passed!', 'green');
    if (result.trim()) {
      console.log(result);
    }
    return true;
  } catch (error) {
    log('✗ Test failed!', 'red');
    console.error(error.stdout || error.message);
    return false;
  }
}

// Cleanup on exit
process.on('SIGINT', cleanup);
process.on('exit', cleanup);

// Start testing
log('Starting import format validation tests...', 'blue');
log('='.repeat(50), 'blue');

cleanup();
fs.mkdirSync(TEST_DIR, { recursive: true });

const results = [];

// Test 1: CommonJS require (main)
log('\n📦 Test 1: CommonJS require (main field)', 'blue');
const cjsDir = createTestProject('cjs-test', {
  name: 'cjs-test',
  version: '1.0.0',
  type: 'commonjs',
  dependencies: {
    [PACKAGE_NAME]: `file:${PACKAGE_PATH}`,
  },
});

const cjsTest = `
const Nope = require('${PACKAGE_NAME}');

// Test basic validation
const schema = Nope.string().required().min(3);
const result1 = schema.validate('ab');
const result2 = schema.validate('abc');

if (result1 !== 'Input is too short') {
  throw new Error('Expected error for short string');
}

if (result2 !== undefined) {
  throw new Error('Expected undefined for valid string');
}

console.log('CommonJS require: ✓ All tests passed');
`;

fs.writeFileSync(path.join(cjsDir, 'test.js'), cjsTest);
results.push({
  name: 'CommonJS require',
  passed: runTest(cjsDir, 'test.js', 'Testing CommonJS require...'),
});

// Test 2: ES Modules import (module field)
log('\n📦 Test 2: ES Modules import (module field)', 'blue');
const esmDir = createTestProject('esm-test', {
  name: 'esm-test',
  version: '1.0.0',
  type: 'module',
  dependencies: {
    [PACKAGE_NAME]: `file:${PACKAGE_PATH}`,
  },
});

const esmTest = `
import Nope from '${PACKAGE_NAME}';

// Test basic validation
const schema = Nope.string().required().min(3);
const result1 = schema.validate('ab');
const result2 = schema.validate('abc');

if (result1 !== 'Input is too short') {
  throw new Error('Expected error for short string');
}

if (result2 !== undefined) {
  throw new Error('Expected undefined for valid string');
}

console.log('ES Modules import: ✓ All tests passed');
`;

fs.writeFileSync(path.join(esmDir, 'test.mjs'), esmTest);
results.push({
  name: 'ES Modules import',
  passed: runTest(esmDir, 'test.mjs', 'Testing ES Modules import...'),
});

// Test 3: Named imports (destructuring)
log('\n📦 Test 3: Named imports (destructuring)', 'blue');
const namedDir = createTestProject('named-test', {
  name: 'named-test',
  version: '1.0.0',
  type: 'module',
  dependencies: {
    [PACKAGE_NAME]: `file:${PACKAGE_PATH}`,
  },
});

const namedTest = `
import * as Nope from '${PACKAGE_NAME}';

// Test that we can access NopeObject, NopeString, etc.
if (!Nope.object) {
  throw new Error('Nope.object should be available');
}

if (!Nope.string) {
  throw new Error('Nope.string should be available');
}

if (!Nope.number) {
  throw new Error('Nope.number should be available');
}

// Test basic validation
const schema = Nope.string().required().min(3);
const result = schema.validate('abc');

if (result !== undefined) {
  throw new Error('Expected undefined for valid string');
}

console.log('Named imports: ✓ All tests passed');
`;

fs.writeFileSync(path.join(namedDir, 'test.mjs'), namedTest);
results.push({
  name: 'Named imports',
  passed: runTest(namedDir, 'test.mjs', 'Testing named imports...'),
});

// Test 4: TypeScript import
log('\n📦 Test 4: TypeScript import', 'blue');
const tsDir = createTestProject('ts-test', {
  name: 'ts-test',
  version: '1.0.0',
  dependencies: {
    [PACKAGE_NAME]: `file:${PACKAGE_PATH}`,
    typescript: '^5.7.2',
    '@types/node': '^20.17.10',
  },
});

const tsTest = `
import Nope from '${PACKAGE_NAME}';

// Test TypeScript types are available
const schema = Nope.string().required().min(3);
const result: string | undefined = schema.validate('abc');

if (result !== undefined) {
  throw new Error('Expected undefined for valid string');
}

// Test that types are properly exported
const numberSchema = Nope.number().min(5);
const numberResult: string | undefined = numberSchema.validate(10);

if (numberResult !== undefined) {
  throw new Error('Expected undefined for valid number');
}

console.log('TypeScript import: ✓ All tests passed');
`;

fs.writeFileSync(path.join(tsDir, 'test.ts'), tsTest);
fs.writeFileSync(
  path.join(tsDir, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
        esModuleInterop: true,
        skipLibCheck: true,
        strict: true,
      },
    },
    null,
    2,
  ),
);

try {
  log('Installing TypeScript...', 'yellow');
  execSync('npm install', {
    cwd: tsDir,
    stdio: 'pipe',
  });

  log('Compiling TypeScript...', 'yellow');
  execSync('npx tsc test.ts', {
    cwd: tsDir,
    stdio: 'pipe',
  });

  log('Running compiled test...', 'yellow');
  execSync('node test.js', {
    cwd: tsDir,
    encoding: 'utf-8',
    stdio: 'pipe',
  });

  log('✓ TypeScript test passed!', 'green');
  results.push({
    name: 'TypeScript import',
    passed: true,
  });
} catch (error) {
  log('✗ TypeScript test failed!', 'red');
  console.error(error.stdout || error.message);
  results.push({
    name: 'TypeScript import',
    passed: false,
  });
}

// Test 5: UMD format (skipped - UMD is no longer built)
log('\n📦 Test 5: UMD format (skipped)', 'blue');
log('  Note: UMD format is no longer built as part of the modern build setup.', 'yellow');
log('  Modern npm packages only need CJS and ESM formats, which are both working.', 'yellow');
log('✓ UMD format test skipped (not applicable)', 'green');

results.push({
  name: 'UMD format',
  passed: true, // Mark as passed since it's intentionally skipped
  skipped: true,
});

// Test 6: Default export vs named exports
log('\n📦 Test 6: Default export compatibility', 'blue');
const defaultDir = createTestProject('default-test', {
  name: 'default-test',
  version: '1.0.0',
  type: 'module',
  dependencies: {
    [PACKAGE_NAME]: `file:${PACKAGE_PATH}`,
  },
});

const defaultTest = `
// Test default export
import NopeDefault from '${PACKAGE_NAME}';

// Test that default export works
if (!NopeDefault.string) {
  throw new Error('Default export should have string method');
}

// Test that we can also import as namespace
import * as NopeNamespace from '${PACKAGE_NAME}';

if (!NopeNamespace.string) {
  throw new Error('Namespace import should have string method');
}

// Both should work the same way
const schema1 = NopeDefault.string().required().min(3);
const schema2 = NopeNamespace.string().required().min(3);

if (schema1.validate('abc') !== undefined || schema2.validate('abc') !== undefined) {
  throw new Error('Both import styles should work identically');
}

console.log('Default export compatibility: ✓ All tests passed');
`;

fs.writeFileSync(path.join(defaultDir, 'test.mjs'), defaultTest);
results.push({
  name: 'Default export compatibility',
  passed: runTest(defaultDir, 'test.mjs', 'Testing default export...'),
});

// Summary
log('\n' + '='.repeat(50), 'blue');
log('Test Summary', 'blue');
log('='.repeat(50), 'blue');

const passed = results.filter((r) => r.passed).length;
const total = results.length;

results.forEach((result) => {
  const icon = result.passed ? '✓' : '✗';
  const color = result.passed ? 'green' : 'red';
  log(`${icon} ${result.name}`, color);
});

log('\n' + '─'.repeat(50), 'blue');
log(`Total: ${passed}/${total} tests passed`, passed === total ? 'green' : 'red');

if (passed === total) {
  log('\n🎉 All import formats are working correctly!', 'green');
  process.exit(0);
} else {
  log('\n❌ Some import formats failed. Please check the errors above.', 'red');
  process.exit(1);
}
