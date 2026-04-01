import { useCarPlay } from 'expo-carplay';
import { SafeAreaView, Text, View } from 'react-native';

export default function App() {
  const { connected } = useCarPlay();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>expo-carplay</Text>
        <Text style={styles.status}>
          CarPlay: {connected ? 'Connected' : 'Not connected'}
        </Text>
      </View>
    </SafeAreaView>
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
