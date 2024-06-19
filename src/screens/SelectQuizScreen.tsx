import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

type SelectQuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectQuiz'>;

const SelectQuizScreen: React.FC = () => {
  const navigation = useNavigation<SelectQuizScreenNavigationProp>();
  const [quizzes, setQuizzes] = useState<{ name: string; url: string; completed: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const storage = getStorage();
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
        <Text>Loading quizzes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => handleQuizPress(item.name, item.url)}
          >
            <Text style={styles.quizButtonText}>{item.name}</Text>
            {item.completed && <Icon name="check" size={20} color="green" style={styles.checkIcon} />}
          </TouchableOpacity>
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
  quizButton: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizButtonText: {
    fontSize: 18,
  },
  checkIcon: {
    marginLeft: 10,
  },
});

export default SelectQuizScreen;