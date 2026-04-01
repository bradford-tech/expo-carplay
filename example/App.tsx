import {
  addConnectListener,
  createMapTemplate,
  setRootTemplate,
  useCarPlay,
} from 'expo-carplay';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const { connected } = useCarPlay();

  useEffect(() => {
    const subscription = addConnectListener(async () => {
      const templateId = await createMapTemplate();
      await setRootTemplate(templateId);
      console.log('CarPlay: map template set as root');
    });
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>expo-carplay</Text>
          <Text style={styles.status}>
            CarPlay: {connected ? 'Connected' : 'Not connected'}
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center' as const,
  },
  title: {
    fontSize: 24,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: '#666',
  },
};
