import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase';
import ConfettiCannon from 'react-native-confetti-cannon';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;
type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

const QuizScreen: React.FC = () => {
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const route = useRoute<QuizScreenRouteProp>();
  const { quizData } = route.params;

  const [questions, setQuestions] = useState<any[]>(quizData || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(false);
  const confettiRef = useRef<any>();

  const handleAnswerPress = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === questions[currentQuestionIndex].answer) {
      setCorrectAnswers(correctAnswers + 1);
      if (confettiRef.current) {
        confettiRef.current.start();
      }
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

  if (!questions.length) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / questions.length;

  return (
    <View style={styles.container}>
      <Progress.Bar progress={progress} animated={true} width={null} style={styles.progressBar} />
      <ScrollView contentContainerStyle={styles.content}>
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
          <View style={styles.resultContainer}>
            <Text style={styles.result}>
              {selectedAnswer === currentQuestion.answer ? 'Correct!' : 'Incorrect!'}
            </Text>
            <Text style={styles.funFact}>{currentQuestion.funFact}</Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
              <Text style={styles.nextButtonText}>Next Question</Text>
            </TouchableOpacity>
          </View>
        )}
        {selectedAnswer === currentQuestion.answer && (
          <ConfettiCannon ref={confettiRef} count={200} origin={{x: -10, y: 0}} fadeOut />
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
  resultContainer: {
    marginTop: 'auto',
    alignItems: 'center',
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
    textAlign: 'center',
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