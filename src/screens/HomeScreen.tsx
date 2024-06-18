import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Welcome to Road Quizin!</Title>
      <Image
        style={styles.img}
        source={require('../../assets/RoadQuizinIcon.png')}
      />
      <Card style={styles.card} onPress={() => navigation.navigate('SelectQuiz')}>
        <Card.Content>
          <Title>Start Quiz</Title>
          <Paragraph>Test your knowledge with fun quizzes!</Paragraph>
        </Card.Content>
      </Card>
      <Card style={styles.card} onPress={() => navigation.navigate('FunFacts')}>
        <Card.Content>
          <Title>Fun Facts</Title>
          <Paragraph>Learn new and interesting facts!</Paragraph>
        </Card.Content>
      </Card>
      <Card style={styles.card} onPress={() => navigation.navigate('Settings')}>
        <Card.Content>
          <Title>Settings</Title>
          <Paragraph>Adjust your preferences</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  img: {
      flex:1,
      height: 200,
      width: '100%'
  },
  card: {
    width: '100%',
    marginBottom: 16,
  },
});

export default HomeScreen;