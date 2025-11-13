import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getQuizTitle } from '../utils/quizTitles';

const QuizHistoryScreen: React.FC = () => {
  const [highScores, setHighScores] = useState<{ quizName: string; quizTitle: string; score: number; name: string }[]>([]);

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
            const quizTitle = getQuizTitle(quizName);
            return { quizName, quizTitle, score, name };
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
      const quizTitle = getQuizTitle(quizName);
      Alert.alert('High Score Deleted', `High score for ${quizTitle} has been deleted.`);
    } catch (error) {
      console.error('Failed to delete high score.', error);
      Alert.alert('Error', 'Failed to delete high score.');
    }
  };

  const handleDeleteAll = () => {
    if (highScores.length === 0) {
      Alert.alert('No History', 'There are no quiz histories to delete.');
      return;
    }

    Alert.alert(
      'Delete All Quiz Histories',
      `Are you sure you want to delete all ${highScores.length} quiz history entries? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              const highScoreKeys = keys.filter(key => key.startsWith('highScore_'));
              await AsyncStorage.multiRemove(highScoreKeys);
              setHighScores([]);
              Alert.alert('Success', 'All quiz histories have been deleted.');
            } catch (error) {
              console.error('Failed to delete all high scores.', error);
              Alert.alert('Error', 'Failed to delete all quiz histories.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: { quizName: string; quizTitle: string; score: number; name: string } }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.quizTitle} - {item.score} by {item.name}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteHighScore(item.quizName)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Quiz History</Text>
        {highScores.length > 0 && (
          <TouchableOpacity style={styles.deleteAllButton} onPress={handleDeleteAll}>
            <Text style={styles.deleteAllButtonText}>Delete All</Text>
          </TouchableOpacity>
        )}
      </View>
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
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  deleteAllButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5,
  },
  deleteAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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