import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { RouteProp, useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types';

type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

const ResultsScreen: React.FC = () => {
  const route = useRoute<ResultsScreenRouteProp>();
  const { correctAnswers, incorrectAnswers, quizName } = route.params; // Ensure quizName is received here
  const navigation = useNavigation();
  const [highScore, setHighScore] = useState<{ score: number; name: string } | null>(null);
  const [name, setName] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const checkAndUpdateHighScore = async () => {
      try {
        const savedHighScore = await AsyncStorage.getItem(`highScore_${quizName}`);
        let currentHighScore = null;
        if (savedHighScore !== null) {
          currentHighScore = JSON.parse(savedHighScore);
          setHighScore(currentHighScore);
        }
        if (currentHighScore === null || correctAnswers >= currentHighScore.score) {
          setModalVisible(true);
        }
      } catch (error) {
        console.error('Failed to load high score.', error);
      }
    };

    checkAndUpdateHighScore();
  }, [correctAnswers, quizName]);

  const handleSaveHighScore = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'Please enter your name to save the high score.');
      return;
    }

    const newHighScore = { score: correctAnswers, name };
    await AsyncStorage.setItem(`highScore_${quizName}`, JSON.stringify(newHighScore));
    setHighScore(newHighScore);
    setModalVisible(false);
  };

  const handleHomePress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resultText}>Quiz Completed!</Text>
      <Text style={styles.resultText}>Correct Answers: {correctAnswers}</Text>
      <Text style={styles.resultText}>Incorrect Answers: {incorrectAnswers}</Text>
      {highScore && (
        <Text style={styles.highScoreText}>
          High Score for {quizName}: {highScore.score} by {highScore.name}
        </Text>
      )}
      <TouchableOpacity style={styles.homeButton} onPress={handleHomePress}>
        <Text style={styles.homeButtonText}>Go to Home</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>New High Score!</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveHighScore}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    marginBottom: 20,
  },
  highScoreText: {
    fontSize: 20,
    marginBottom: 20,
    color: 'blue',
  },
  homeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 24,
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    width: '80%'
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ResultsScreen;