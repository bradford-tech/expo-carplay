// Required by the expo-module-scripts jest preset — jest-expo's transform
// resolves the babel config from the project root, and react-native's own
// jest setup files carry Flow syntax that only babel-preset-expo can parse.
module.exports = {
  presets: ['babel-preset-expo'],
};
