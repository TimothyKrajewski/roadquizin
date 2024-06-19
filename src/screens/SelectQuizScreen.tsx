// src/screens/SelectQuizScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FancyButton from '../components/FancyButton';
import LoadingIndicator from '../components/LoadingIndicator';

type SelectQuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectQuiz'>;

const SelectQuizScreen: React.FC = () => {
  const navigation = useNavigation<SelectQuizScreenNavigationProp>();
  const [quizzes, setQuizzes] = useState<{ name: string; url: string; completed: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    const fetchOfflineMode = async () => {
      const storedOfflineMode = await AsyncStorage.getItem('offlineMode');
      if (storedOfflineMode !== null) {
        setOfflineMode(JSON.parse(storedOfflineMode));
      }
    };

    const fetchQuizzes = async () => {
      try {
        if (offlineMode) {
          const localFiles = require.context('../../api/uploaded', true, /\.json$/);
          const quizzes = localFiles.keys().map((key) => {
            const name = key.replace('./', '');
            const url = localFiles(key);
            return { name, url, completed: false };
          });
          const highScorePromises = quizzes.map(async (quiz) => {
            const highScore = await AsyncStorage.getItem(`highScore_${quiz.name}`);
            return {
              ...quiz,
              completed: highScore !== null,
            };
          });
          const updatedQuizzes = await Promise.all(highScorePromises);
          setQuizzes(updatedQuizzes);
        } else {
          const listRef = ref(storage, '');
          const res = await listAll(listRef);
          const quizPromises = res.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const highScore = await AsyncStorage.getItem(`highScore_${itemRef.name}`);
            return {
              name: itemRef.name,
              url,
              completed: highScore !== null,
            };
          });
          const quizzes = await Promise.all(quizPromises);
          setQuizzes(quizzes);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch quizzes.', error);
        setLoading(false);
      }
    };

    fetchOfflineMode().then(fetchQuizzes);
  }, [offlineMode]);

  const handleQuizPress = async (quizName: string, quizUrl: string) => {
    const response = await fetch(quizUrl);
    const quizData = await response.json();
    navigation.navigate('Quiz', { quizData, quizName });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <FancyButton
            text={item.name}
            onPress={() => handleQuizPress(item.name, item.url)}
            completed={item.completed}
          />
        )}
        scrollEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectQuizScreen;