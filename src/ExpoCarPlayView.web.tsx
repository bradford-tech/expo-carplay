import * as React from 'react';

import { ExpoCarPlayViewProps } from './ExpoCarPlay.types';

export default function ExpoCarPlayView(props: ExpoCarPlayViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
