// Reexport the native module. On web, it will be resolved to ExpoCarPlayModule.web.ts
// and on native platforms to ExpoCarPlayModule.ts
export { default } from './ExpoCarPlayModule';
export { default as ExpoCarPlayView } from './ExpoCarPlayView';
export * from  './ExpoCarPlay.types';
