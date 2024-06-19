import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import SelectQuizScreen from '../screens/SelectQuizScreen';
import QuizScreen from '../screens/QuizScreen';
import FunFactsScreen from '../screens/FunFactsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ResultsScreen from '../screens/ResultsScreen';
import QuizHistoryScreen from '../screens/QuizHistoryScreen';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SelectQuiz" component={SelectQuizScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="FunFacts" component={FunFactsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="QuizHistory" component={QuizHistoryScreen} />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ headerLeft: () => null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;