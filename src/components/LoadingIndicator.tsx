import React from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const LoadingIndicator: React.FC = () => {
  const rotation = new Animated.Value(0);

  Animated.loop(
    Animated.timing(rotation, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <MaterialIcons name="edit" size={50} color="black" />
      </Animated.View>
      <View style={styles.paper}>
        <MaterialIcons name="assignment" size={100} color="gray" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    position: 'absolute',
    top: 20,
    left: 30,
  },
});

export default LoadingIndicator;