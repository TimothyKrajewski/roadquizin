// src/screens/QuizScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import presidents from '../../api/presidents.json';
import ConfettiCannon from 'react-native-confetti-cannon';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;
const questions = presidents;

const QuizScreen: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const navigation = useNavigation<QuizScreenNavigationProp>();
  const confettiRef = useRef(null);

  const handleAnswerPress = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === questions[currentQuestionIndex].answer) {
      setCorrectAnswers(correctAnswers + 1);
      setShowConfetti(true);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowConfetti(false);
    } else {
      navigation.navigate('Results', { correctAnswers, incorrectAnswers });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / questions.length;

  return (
    <View style={styles.container}>
      <Progress.Bar progress={progress} animated={true} width={null} style={styles.progressBar} />
      <View style={styles.contentContainer}>
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
      </View>
      {showResult && (
        <View style={styles.footer}>
          <Text style={styles.result}>
            {selectedAnswer === currentQuestion.answer ? 'Correct!' : 'Incorrect!'}
          </Text>
          <Text style={styles.funFact}>{currentQuestion.funFact}</Text>
          <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
            <Text style={styles.nextButtonText}>Next Question</Text>
          </TouchableOpacity>
        </View>
      )}
      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{x: -10, y: 0}}
          fadeOut={true}
          ref={confettiRef}
          explosionSpeed={350}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  progressBar: {
    marginVertical: 20,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
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
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  result: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
  },
  funFact: {
    fontSize: 18,
    marginBottom: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  nextButton: {
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