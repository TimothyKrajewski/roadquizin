import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen: React.FC = () => {
  const [highScores, setHighScores] = useState<{ quizName: string, score: number, name: string }[]>([]);

  useEffect(() => {
    const fetchHighScores = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const quizHighScores = keys.filter(key => key.startsWith('highScore_'));
        const highScoreEntries = await AsyncStorage.multiGet(quizHighScores);
        const highScoresList = highScoreEntries.map(([key, value]) => {
          const { score, name } = JSON.parse(value!);
          return { quizName: key.replace('highScore_', ''), score, name };
        });
        setHighScores(highScoresList);
      } catch (error) {
        console.error('Failed to load high scores.', error);
      }
    };

    fetchHighScores();
  }, []);

  const handleDeleteHighScore = async (quizName: string) => {
    try {
      await AsyncStorage.removeItem(`highScore_${quizName}`);
      setHighScores(highScores.filter(score => score.quizName !== quizName));
      Alert.alert('Deleted', `High score for ${quizName} has been deleted.`);
    } catch (error) {
      console.error('Failed to delete high score.', error);
    }
  };

  const renderHighScore = ({ item }: { item: { quizName: string, score: number, name: string } }) => (
    <View style={styles.highScoreContainer}>
      <Text style={styles.highScoreText}>
        {item.quizName}: {item.score} by {item.name}
      </Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteHighScore(item.quizName)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>High Scores</Text>
      {highScores.length === 0 ? (
        <Text style={styles.noHighScoresText}>No high scores available.</Text>
      ) : (
        <FlatList
          data={highScores}
          renderItem={renderHighScore}
          keyExtractor={item => item.quizName}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  noHighScoresText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  highScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  highScoreText: {
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default SettingsScreen;