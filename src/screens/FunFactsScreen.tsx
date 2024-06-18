import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

const FunFactsScreen: React.FC = () => {
  const [funFact, setFunFact] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFunFact = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
      const data = await response.json();
      setFunFact(data.text);
      setError(null);
    } catch (err) {
      setError('Failed to fetch fun fact');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunFact();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {funFact && <Text style={styles.funFact}>{funFact}</Text>}
      <TouchableOpacity style={styles.button} onPress={fetchFunFact}>
        <Text style={styles.buttonText}>Get New Fun Fact</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  funFact: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FunFactsScreen;