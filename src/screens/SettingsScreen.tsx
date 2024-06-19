import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [allPlayMode, setAllPlayMode] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const storedAllPlayMode = await AsyncStorage.getItem('allPlayMode');
      if (storedAllPlayMode !== null) {
        setAllPlayMode(JSON.parse(storedAllPlayMode));
      }
    };
    fetchSettings();
  }, []);

  const toggleAllPlayMode = async () => {
    setAllPlayMode((previousState) => !previousState);
    await AsyncStorage.setItem('allPlayMode', JSON.stringify(!allPlayMode));
  };

  const handleNavigateToQuizHistory = () => {
    navigation.navigate('QuizHistory');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enable All Play Mode</Text>
      <Switch
        value={allPlayMode}
        onValueChange={toggleAllPlayMode}
      />
      <TouchableOpacity style={styles.historyButton} onPress={handleNavigateToQuizHistory}>
        <Text style={styles.historyButtonText}>Quiz History</Text>
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
});

export default SettingsScreen;