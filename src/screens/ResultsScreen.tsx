// src/screens/ResultsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

const ResultsScreen: React.FC = () => {
  const route = useRoute<ResultsScreenRouteProp>();
  const { correctAnswers, incorrectAnswers } = route.params;
  const navigation = useNavigation();

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
      <TouchableOpacity style={styles.homeButton} onPress={handleHomePress}>
        <Text style={styles.homeButtonText}>Go to Home</Text>
      </TouchableOpacity>
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
});

export default ResultsScreen;