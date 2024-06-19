import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIndicator from '../components/LoadingIndicator';
import FancyButton from '../components/FancyButton';

type SelectQuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectQuiz'>;

const SelectQuizScreen: React.FC = () => {
  const navigation = useNavigation<SelectQuizScreenNavigationProp>();
  const [quizzes, setQuizzes] = useState<{ name: string; url: string; completed: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
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
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch quizzes.', error);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleQuizPress = async (quizName: string, quizUrl: string) => {
    const response = await fetch(quizUrl);
    const quizData = await response.json();
    navigation.navigate('Quiz', { quizData, quizName });
  };

  if (loading) {
    return (
      <View style={styles.container}>
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
});

export default SelectQuizScreen;