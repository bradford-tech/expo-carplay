import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'expo-carplay-example',
  slug: 'expo-carplay-example',
  platforms: ['ios'],
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  plugins: [
    '@bradford-tech/expo-carplay',
    [
      'expo-build-properties',
      {
        ios: {
          deploymentTarget: '16.4',
        },
      },
    ],
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'expo.modules.carplay.example',
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'This app needs your location for CarPlay navigation.',
    },
  },
});
