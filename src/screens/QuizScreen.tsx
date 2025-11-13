import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase';
import ConfettiCannon from 'react-native-confetti-cannon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Paths, File } from 'expo-file-system';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;
type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

const QuizScreen: React.FC = () => {
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const route = useRoute<QuizScreenRouteProp>();
  const { quizData, quizName } = route.params;  // Ensure quizName is passed as a parameter

  const [questions, setQuestions] = useState<any[]>(quizData || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [allPlayMode, setAllPlayMode] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [streak, setStreak] = useState(0);
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    const fetchAllPlayMode = async () => {
      const storedAllPlayMode = await AsyncStorage.getItem('allPlayMode');
      if (storedAllPlayMode !== null) {
        setAllPlayMode(JSON.parse(storedAllPlayMode));
      }
    };

    const fetchOfflineMode = async () => {
      const storedOfflineMode = await AsyncStorage.getItem('offlineMode');
      if (storedOfflineMode !== null) {
        setOfflineMode(JSON.parse(storedOfflineMode));
      }
    };

    fetchAllPlayMode();
    fetchOfflineMode();

    if (offlineMode) {
      fetchQuizFromLocalStorage();
    } else {
      setQuestions(quizData || []);
    }
  }, []);

  const fetchQuizFromLocalStorage = async () => {
    try {
      const file = new File(Paths.document, 'api', 'uploaded', `${quizName}.json`);
      const fileContent = await file.text();
      const localQuestions = JSON.parse(fileContent);
      setQuestions(localQuestions);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to load quiz from local storage. ${errorMessage}`);
      console.error('Failed to load quiz from local storage.', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerPress = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === questions[currentQuestionIndex].answer) {
      setCorrectAnswers(correctAnswers + 1);
      setStreak(streak + 1);
      if (confettiRef.current) {
        confettiRef.current.start();
      }
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHints(false);
    } else {
      navigation.navigate('Results', { correctAnswers, incorrectAnswers, quizName });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!questions.length) {
    return (
      <View style={styles.container}>
        <Text>No questions available.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / questions.length;

  return (
    <View style={styles.container}>
      <Progress.Bar progress={progress} animated={true} width={null} style={styles.progressBar} />
      <Text style={styles.streak}>Streak: {streak}</Text>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.question}>{currentQuestion.question}</Text>
        {allPlayMode ? (
          <>
            <TouchableOpacity
              style={styles.revealButton}
              onPress={() => setShowResult(true)}
            >
              <Text style={styles.revealButtonText}>Reveal Answer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hintButton}
              onPress={() => setShowHints(true)}
            >
              <Text style={styles.hintButtonText}>Need a Hint?</Text>
            </TouchableOpacity>
            {showResult && (
              <>
                <Text style={styles.result}>
                  Answer: {currentQuestion[currentQuestion.answer]}
                </Text>
                <Text style={styles.funFact}>{currentQuestion.funFact}</Text>
                <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                  <Text style={styles.nextButtonText}>Next Question</Text>
                </TouchableOpacity>
              </>
            )}
            {showHints && !showResult && (
              <>
                {Object.entries(currentQuestion)
                  .filter(([key]) => key.match(/[A-D]/))
                  .map(([key, value]) => (
                    <TouchableOpacity
                      key={key}
                      style={styles.option}
                      onPress={() => handleAnswerPress(key)}
                    >
                      <Text style={styles.optionText}>{String(value)}</Text>
                    </TouchableOpacity>
                  ))}
              </>
            )}
          </>
        ) : (
          <>
            {Object.entries(currentQuestion)
              .filter(([key]) => key.match(/[A-D]/))
              .map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.option,
                    showResult && selectedAnswer === key && key !== currentQuestion.answer && styles.incorrectOption,
                    showResult && selectedAnswer === key && key === currentQuestion.answer && styles.correctOption
                  ]}
                  onPress={() => handleAnswerPress(key)}
                  disabled={showResult}
                >
                  <Text style={styles.optionText}>{key}: {String(value)}</Text>
                </TouchableOpacity>
              ))}
            {showResult && (
              <View style={styles.resultContainer}>
                <Text style={styles.result}>
                  {selectedAnswer === currentQuestion.answer ? 'Correct!' : 'Incorrect!'}
                </Text>
                {selectedAnswer !== currentQuestion.answer && (
                  <Text style={styles.correctAnswer}>
                    The correct answer is: {currentQuestion[currentQuestion.answer]}
                  </Text>
                )}
                <Text style={styles.funFact}>{currentQuestion.funFact}</Text>
                <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                  <Text style={styles.nextButtonText}>Next Question</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        {selectedAnswer === currentQuestion.answer && (
          <ConfettiCannon ref={confettiRef} count={200} origin={{ x: -10, y: 0 }} fadeOut />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  progressBar: {
    marginVertical: 20,
    width: '100%',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  streak: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  question: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },
  option: {
    backgroundColor: '#ddd',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#f44336',
  },
  resultContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  result: {
    fontSize: 22,
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
  correctAnswer: {
    fontSize: 18,
    marginTop: 10,
    color: '#4CAF50',
    textAlign: 'center',
  },
  funFact: {
    fontSize: 18,
    marginTop: 10,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#333',
  },
  nextButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  revealButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    alignItems: 'center',
  },
  revealButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  hintButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFC107',
    borderRadius: 5,
    alignItems: 'center',
  },
  hintButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default QuizScreen;