// src/screens/QuizScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;

const QuizScreen: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<QuizScreenNavigationProp>();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const storageRef = ref(storage, 'presidents.json');
        const url = await getDownloadURL(storageRef);
        const response = await fetch(url);
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions: ", error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerPress = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === questions[currentQuestionIndex].answer) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      navigation.navigate('Results', { correctAnswers, incorrectAnswers });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (questions.length === 0) {
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
      <Progress.Bar progress={progress} animated={true} width={null} />
      <Text style={styles.question}>{currentQuestion.question}</Text>
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
            <Text style={styles.optionText}>{key}: {value}</Text>
          </TouchableOpacity>
        ))}
      {showResult && (
        <>
          <Text style={styles.result}>
            {selectedAnswer === currentQuestion.answer ? 'Correct!' : 'Incorrect!'}
          </Text>
          <Text style={styles.funFact}>{currentQuestion.funFact}</Text>
        </>
      )}
      {showResult && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
          <Text style={styles.nextButtonText}>Next Question</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  progressBar: {
    marginVertical: 20,
    width: '100%'
  },
  question: {
    fontSize: 20,
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#ddd',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 18,
  },
  correctOption: {
    backgroundColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#f44336',
  },
  result: {
    fontSize: 22,
    marginTop: 20,
    textAlign: 'center',
  },
  funFact: {
    fontSize: 18,
    marginTop: 10,
    fontStyle: 'italic',
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
});

export default QuizScreen;