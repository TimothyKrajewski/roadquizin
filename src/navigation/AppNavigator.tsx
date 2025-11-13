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
import RequestQuizScreen from '../screens/RequestQuizScreen';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen 
          name="SelectQuiz" 
          component={SelectQuizScreen}
          options={{ title: 'Choose a Quiz' }}
        />
        <Stack.Screen 
          name="Quiz" 
          component={QuizScreen}
          options={{ headerBackTitle: 'Back to Quizzes' }}
        />
        <Stack.Screen name="FunFacts" component={FunFactsScreen}  options={{ title: 'Pull a fun fact!' }} />
        <Stack.Screen name="Settings" component={SettingsScreen}  options={{ title: 'Settings' }} />
        <Stack.Screen 
          name="QuizHistory" 
          component={QuizHistoryScreen}
          options={{ title: 'Quiz History' }}
        />
        <Stack.Screen name="RequestQuiz" component={RequestQuizScreen}  options={{ title: 'Request A Quiz Topic' }}/>
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