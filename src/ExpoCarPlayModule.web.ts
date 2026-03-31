import { registerWebModule, NativeModule } from 'expo';

import { ExpoCarPlayModuleEvents } from './ExpoCarPlay.types';

class ExpoCarPlayModule extends NativeModule<ExpoCarPlayModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoCarPlayModule, 'ExpoCarPlayModule');
