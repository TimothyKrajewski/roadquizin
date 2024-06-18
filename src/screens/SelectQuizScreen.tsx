import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { listAll, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import FancyButton from '../components/FancyButton';

type SelectQuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectQuiz'>;

const SelectQuizScreen: React.FC = () => {
  const [quizFiles, setQuizFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<SelectQuizScreenNavigationProp>();

  useEffect(() => {
    const fetchQuizFiles = async () => {
      try {
        const listRef = ref(storage, ''); // Adjust path to your quizzes folder
        const res = await listAll(listRef);
        const files = res.items.map(itemRef => itemRef.name);
        setQuizFiles(files);
        setLoading(false);
      } catch (error) {
        console.error("Error listing quiz files: ", error);
        setLoading(false);
      }
    };

    fetchQuizFiles();
  }, []);

  const handleQuizSelect = async (fileName: string) => {
    try {
      const fileRef = ref(storage, `${fileName}`);
      const url = await getDownloadURL(fileRef);
      const response = await fetch(url);
      const data = await response.json();
      navigation.navigate('Quiz', { quizData: data, quizId: fileName });
    } catch (error) {
      console.error("Error fetching quiz data: ", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Quiz</Text>
      <FlatList
        data={quizFiles}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <FancyButton text={item} onPress={() => handleQuizSelect(item)} />
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default SelectQuizScreen;