import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [offlineMode, setOfflineMode] = useState(false);
  const [allPlayMode, setAllPlayMode] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const storedOfflineMode = await AsyncStorage.getItem('offlineMode');
      if (storedOfflineMode !== null) {
        setOfflineMode(JSON.parse(storedOfflineMode));
      }

      const storedAllPlayMode = await AsyncStorage.getItem('allPlayMode');
      if (storedAllPlayMode !== null) {
        setAllPlayMode(JSON.parse(storedAllPlayMode));
      }
    };
    fetchSettings();
  }, []);

  const toggleOfflineMode = async () => {
    setOfflineMode((previousState) => !previousState);
    await AsyncStorage.setItem('offlineMode', JSON.stringify(!offlineMode));
  };

  const toggleAllPlayMode = async () => {
    setAllPlayMode((previousState) => !previousState);
    await AsyncStorage.setItem('allPlayMode', JSON.stringify(!allPlayMode));
  };

  const handleNavigateToQuizHistory = () => {
    navigation.navigate('QuizHistory');
  };

  const handleNavigateToRequestQuiz = () => {
    navigation.navigate('RequestQuiz');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enable Offline Mode</Text>
      <Switch
        value={offlineMode}
        onValueChange={toggleOfflineMode}
      />
      <Text style={styles.label}>Enable All Play Mode</Text>
      <Switch
        value={allPlayMode}
        onValueChange={toggleAllPlayMode}
      />
      <TouchableOpacity style={styles.historyButton} onPress={handleNavigateToQuizHistory}>
        <Text style={styles.historyButtonText}>Quiz History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.requestButton} onPress={handleNavigateToRequestQuiz}>
        <Text style={styles.requestButtonText}>Request a Quiz Topic</Text>
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
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  historyButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  requestButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default SettingsScreen;