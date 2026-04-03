const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals');

module.exports = defineConfig([
  { ignores: ['node_modules/', '.expo/'] },
  expoConfig,
  {
    files: ['babel.config.js', 'metro.config.js', 'webpack.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
