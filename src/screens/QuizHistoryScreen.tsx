import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuizHistoryScreen: React.FC = () => {
  const [highScores, setHighScores] = useState<{ quizName: string; score: number; name: string }[]>([]);

  useEffect(() => {
    const fetchHighScores = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const highScoreKeys = keys.filter(key => key.startsWith('highScore_'));
        const highScores = await AsyncStorage.multiGet(highScoreKeys);
        const parsedScores = highScores.map(([key, value]) => {
          if (value) {
            const quizName = key.replace('highScore_', '');
            const { score, name } = JSON.parse(value);
            return { quizName, score, name };
          }
          return null;
        }).filter(item => item !== null);
        setHighScores(parsedScores as any[]);
      } catch (error) {
        console.error('Failed to load high scores.', error);
      }
    };

    fetchHighScores();
  }, []);

  const handleDeleteHighScore = async (quizName: string) => {
    try {
      await AsyncStorage.removeItem(`highScore_${quizName}`);
      setHighScores(prevScores => prevScores.filter(score => score.quizName !== quizName));
      Alert.alert('High Score Deleted', `High score for ${quizName} has been deleted.`);
    } catch (error) {
      console.error('Failed to delete high score.', error);
      Alert.alert('Error', 'Failed to delete high score.');
    }
  };

  const renderItem = ({ item }: { item: { quizName: string; score: number; name: string } }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.quizName} - {item.score} by {item.name}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteHighScore(item.quizName)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz History</Text>
      <FlatList
        data={highScores}
        renderItem={renderItem}
        keyExtractor={item => item.quizName}
        ListEmptyComponent={<Text style={styles.noHighScoresText}>No high scores available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noHighScoresText: {
    fontSize: 18,
    color: '#888',
  },
});

export default QuizHistoryScreen;