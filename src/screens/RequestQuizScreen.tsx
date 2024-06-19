import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as MailComposer from 'expo-mail-composer';

const RequestQuizScreen: React.FC = () => {
  const [topic, setTopic] = useState('');

  const handleRequestQuiz = () => {
    if (topic.trim() === '') {
      Alert.alert('Error', 'Please enter a quiz topic.');
      return;
    }

    MailComposer.composeAsync({
      subject: 'Quiz Topic Request',
      recipients: ['your_email@example.com'],
      body: `I would like to request a quiz on the following topic: ${topic}`,
    }).then(result => {
      if (result.status === MailComposer.MailComposerStatus.SENT) {
        Alert.alert('Success', 'Your quiz request has been sent.');
        setTopic('');
      } else {
        Alert.alert('Error', 'Could not send email. Please try again later.');
      }
    }).catch(error => {
      Alert.alert('Error', 'Could not send email. Please try again later.');
      console.error('Failed to send email:', error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Request a Quiz Topic</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter quiz topic"
        value={topic}
        onChangeText={setTopic}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleRequestQuiz}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  submitButton: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default RequestQuizScreen;