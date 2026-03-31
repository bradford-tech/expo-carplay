import { NativeModule, requireNativeModule } from 'expo';

import { ExpoCarPlayModuleEvents } from './ExpoCarPlay.types';

declare class ExpoCarPlayModule extends NativeModule<ExpoCarPlayModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoCarPlayModule>('ExpoCarPlay');
