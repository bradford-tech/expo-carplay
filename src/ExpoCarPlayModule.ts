import { NativeModule, requireNativeModule } from 'expo';

declare class ExpoCarPlayModule extends NativeModule {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoCarPlayModule>('ExpoCarPlay');
