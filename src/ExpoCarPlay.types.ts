import type { StyleProp } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type ExpoCarPlayModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type ExpoCarPlayViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp;
};
