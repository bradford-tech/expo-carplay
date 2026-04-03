import {
  addConnectListener,
  clearCarPlayRoute,
  createMapTemplate,
  setCarPlayRoute,
  setRootTemplate,
  startFollowingUser,
  stopFollowingUser,
  useCarPlay,
} from 'expo-carplay';
import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Sample route: a short segment near Apple Park, Cupertino
const SAMPLE_ROUTE = [
  { latitude: 37.335, longitude: -122.009 },
  { latitude: 37.336, longitude: -122.008 },
  { latitude: 37.337, longitude: -122.006 },
  { latitude: 37.339, longitude: -122.005 },
  { latitude: 37.341, longitude: -122.004 },
  { latitude: 37.343, longitude: -122.003 },
  { latitude: 37.345, longitude: -122.002 },
];

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

  const startNavigation = async () => {
    if (!connected) return;
    await setCarPlayRoute(SAMPLE_ROUTE);
    await startFollowingUser();
    console.log('CarPlay: navigation started (native location tracking)');
  };

  const stopNavigation = async () => {
    await stopFollowingUser();
    await clearCarPlayRoute();
    console.log('CarPlay: navigation stopped');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>expo-carplay</Text>
          <Text style={styles.status}>
            CarPlay: {connected ? 'Connected' : 'Not connected'}
          </Text>
          {connected && (
            <View style={styles.buttons}>
              <Button title="Start Navigation" onPress={startNavigation} />
              <Button title="Stop Navigation" onPress={stopNavigation} />
            </View>
          )}
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
    marginBottom: 16,
  },
  buttons: {
    gap: 8,
  },
};
