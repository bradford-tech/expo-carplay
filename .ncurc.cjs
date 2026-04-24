/** @type {import('npm-check-updates').RcOptions } */
module.exports = {
  target: name => {
    if (
      name === 'expo' ||
      name === '@types/node' ||
      name === 'eslint' ||
      name === '@eslint/js' ||
      name === '@react-native-async-storage/async-storage' ||
      name === 'expo-router' ||
      name === 'typescript'
    )
      return 'minor';
    if (name === '@sentry/react-native') return 'patch';
    return 'latest';
  },
  reject: ['@types/react', 'prettier', 'react-native'],
};
