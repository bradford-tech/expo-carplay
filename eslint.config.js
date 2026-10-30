// expo-module-scripts 56 no longer ships an ESLint base config or the eslint
// binary, so the module lints with the same eslint-config-expo flat config the
// example app uses.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals');

module.exports = defineConfig([
  {
    ignores: [
      'node_modules/',
      'build/',
      'plugin/build/',
      'example/',
      '.superpowers/',
    ],
  },
  expoConfig,
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // Jest module isolation (`jest.isolateModules` + `require`) is the
    // supported way to re-import a module under a fresh mock state.
    files: ['**/__tests__/**'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);
