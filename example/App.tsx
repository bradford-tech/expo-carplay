import {
  addBarButtonPressedListener,
  addConnectListener,
  addSearchResultSelectedListener,
  addSearchTextListener,
  addTripStartedListener,
  clearCarPlayRoute,
  createMapTemplate,
  createSearchTemplate,
  popTemplate,
  pushTemplate,
  setCarPlayRoute,
  setRootTemplate,
  showTripPreviews,
  startFollowingUser,
  startNavigation,
  stopFollowingUser,
  stopNavigation,
  updateManeuvers,
  updateSearchResults,
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
    color: 'systemTeal',
  },
  {
    coordinates: [
      { latitude: 37.339, longitude: -122.005 },
      { latitude: 37.341, longitude: -122.004 },
      { latitude: 37.343, longitude: -122.003 },
    ],
    color: 'systemRed',
  },
  {
    coordinates: [
      { latitude: 37.343, longitude: -122.003 },
      { latitude: 37.345, longitude: -122.002 },
    ],
    color: 'systemTeal',
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

// Mock search results
const MOCK_DESTINATIONS = [
  { text: 'Apple Park Visitor Center', detailText: '10600 N Tantau Ave' },
  { text: 'Apple Infinite Loop', detailText: '1 Infinite Loop' },
  { text: 'Apple Store, Stanford', detailText: '340 University Ave' },
];

const SAMPLE_TRIP = {
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
};

export default function App() {
  const { connected } = useCarPlay();

  useEffect(() => {
    const connectSub = addConnectListener(async () => {
      const templateId = await createMapTemplate({
        leadingNavigationBarButtons: [
          { id: 'search', systemImage: 'magnifyingglass' },
        ],
      });
      await setRootTemplate(templateId);
      console.log('CarPlay: map template set as root');
    });

    const barButtonSub = addBarButtonPressedListener(async ({ id }) => {
      if (id === 'search') {
        const searchId = await createSearchTemplate();
        await pushTemplate(searchId);
        console.log('CarPlay: search template pushed');
      }
    });

    return () => {
      connectSub.remove();
      barButtonSub.remove();
    };
  }, []);

  // Handle search events
  useEffect(() => {
    const textSub = addSearchTextListener(async ({ requestId, searchText }) => {
      console.log(`CarPlay search: "${searchText}" (request: ${requestId})`);

      // Filter mock results by search text
      const filtered = MOCK_DESTINATIONS.filter(
        d =>
          searchText.length > 0 &&
          d.text.toLowerCase().includes(searchText.toLowerCase())
      );

      // Simulate async backend delay
      await new Promise(resolve => setTimeout(resolve, 300));

      await updateSearchResults(requestId, filtered);
      console.log(`CarPlay search: sent ${filtered.length} results`);
    });

    const selectSub = addSearchResultSelectedListener(async ({ text }) => {
      console.log(`CarPlay search: selected "${text}"`);
      await popTemplate();
      await setCarPlayRoute(SAMPLE_ROUTE);
      await showTripPreviews([SAMPLE_TRIP]);
      console.log('CarPlay: showing trip preview');
    });

    const tripStartedSub = addTripStartedListener(async ({ tripIndex }) => {
      console.log(`CarPlay: trip started (index: ${tripIndex})`);
      await startFollowingUser();
      const sessionId = await startNavigation(SAMPLE_TRIP);
      console.log('CarPlay: navigation started, session:', sessionId);
      await updateManeuvers(SAMPLE_MANEUVERS);
      await updateTravelEstimates(
        { distanceRemaining: 800, timeRemaining: 120 },
        0
      );
    });

    return () => {
      textSub.remove();
      selectSub.remove();
      tripStartedSub.remove();
    };
  }, []);

  const handleStartNavigation = async () => {
    if (!connected) return;
    await setCarPlayRoute(SAMPLE_ROUTE);
    await showTripPreviews([SAMPLE_TRIP]);
    console.log('CarPlay: showing trip preview');
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
