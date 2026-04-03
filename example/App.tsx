import {
  addConnectListener,
  clearCarPlayRoute,
  createMapTemplate,
  setCarPlayRoute,
  setRootTemplate,
  updateCarPlayLocation,
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

  const simulateNavigation = async () => {
    if (!connected) return;

    // Set the route polyline
    await setCarPlayRoute(SAMPLE_ROUTE);
    console.log('CarPlay: route set');

    // Simulate driving along the route
    for (let i = 0; i < SAMPLE_ROUTE.length; i++) {
      const point = SAMPLE_ROUTE[i];
      const next = SAMPLE_ROUTE[Math.min(i + 1, SAMPLE_ROUTE.length - 1)];

      // Approximate course from current to next point
      const dLon = next.longitude - point.longitude;
      const dLat = next.latitude - point.latitude;
      const course = (Math.atan2(dLon, dLat) * 180) / Math.PI;

      await updateCarPlayLocation({
        latitude: point.latitude,
        longitude: point.longitude,
        course: course >= 0 ? course : course + 360,
        speed: 13.4, // ~30 mph
      });

      // Wait 2 seconds between updates
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('CarPlay: simulation complete');
  };

  const clearRoute = async () => {
    await clearCarPlayRoute();
    console.log('CarPlay: route cleared');
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
              <Button
                title="Simulate Navigation"
                onPress={simulateNavigation}
              />
              <Button title="Clear Route" onPress={clearRoute} />
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
