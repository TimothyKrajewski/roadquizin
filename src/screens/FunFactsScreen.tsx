// FunFactsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FunFactsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Fun Facts Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FunFactsScreen;