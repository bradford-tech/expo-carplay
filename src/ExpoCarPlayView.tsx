import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoCarPlayViewProps } from './ExpoCarPlay.types';

const NativeView: React.ComponentType = requireNativeView('ExpoCarPlay');

export default function ExpoCarPlayView(props: ExpoCarPlayViewProps) {
  return <NativeView {...props} />;
}
