import {
  addConnectListener,
  clearCarPlayRoute,
  createMapTemplate,
  setCarPlayRoute,
  setRootTemplate,
  startFollowingUser,
  startNavigation,
  stopFollowingUser,
  stopNavigation,
  updateManeuvers,
  updateTravelEstimates,
  useCarPlay,
} from '@bradford-tech/expo-carplay';
import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Sample route with colored segments near Apple Park
const SAMPLE_ROUTE = [
  {
    coordinates: [
      { latitude: 37.335, longitude: -122.009 },
      { latitude: 37.336, longitude: -122.008 },
      { latitude: 37.337, longitude: -122.006 },
      { latitude: 37.339, longitude: -122.005 },
    ],
    color: 'systemTeal', // LSV-legal segment
  },
  {
    coordinates: [
      { latitude: 37.339, longitude: -122.005 },
      { latitude: 37.341, longitude: -122.004 },
      { latitude: 37.343, longitude: -122.003 },
    ],
    color: 'systemRed', // Non-LSV-legal segment
  },
  {
    coordinates: [
      { latitude: 37.343, longitude: -122.003 },
      { latitude: 37.345, longitude: -122.002 },
    ],
    color: 'systemTeal', // LSV-legal again
  },
];

const SAMPLE_MANEUVERS = [
  {
    instructionVariants: ['Head northeast on Infinite Loop'],
    symbolImage: { systemName: 'arrow.up' },
    distanceRemaining: 800,
    timeRemaining: 120,
  },
  {
    instructionVariants: ['Turn right onto N De Anza Blvd'],
    symbolImage: { systemName: 'arrow.turn.up.right' },
    distanceRemaining: 400,
    timeRemaining: 60,
  },
  {
    instructionVariants: ['Arrive at destination'],
    symbolImage: { systemName: 'mappin.circle.fill' },
    distanceRemaining: 0,
    timeRemaining: 0,
  },
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

  const handleStartNavigation = async () => {
    if (!connected) return;

    // 1. Set the route polyline on the map
    await setCarPlayRoute(SAMPLE_ROUTE);

    // 2. Start native location tracking
    await startFollowingUser();

    // 3. Start the CarPlay navigation session
    const sessionId = await startNavigation({
      origin: SAMPLE_ROUTE[0].coordinates[0],
      destination:
        SAMPLE_ROUTE[SAMPLE_ROUTE.length - 1].coordinates[
          SAMPLE_ROUTE[SAMPLE_ROUTE.length - 1].coordinates.length - 1
        ],
      routeChoices: [
        {
          summaryVariants: ['Via Infinite Loop', 'Fastest route'],
          additionalInformationVariants: ['0.5 mi — 2 min'],
        },
      ],
    });
    console.log('CarPlay: navigation started, session:', sessionId);

    // 4. Set the turn-by-turn maneuvers
    await updateManeuvers(SAMPLE_MANEUVERS);
    console.log('CarPlay: maneuvers set');

    // 5. Set initial travel estimates
    await updateTravelEstimates(
      { distanceRemaining: 800, timeRemaining: 120 },
      0
    );
  };

  const handleStopNavigation = async () => {
    await stopNavigation();
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
              <Button
                title="Start Navigation"
                onPress={handleStartNavigation}
              />
              <Button title="Stop Navigation" onPress={handleStopNavigation} />
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
