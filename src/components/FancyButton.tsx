import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type FancyButtonProps = {
  text: string;
  onPress: () => void;
};

const FancyButton: React.FC<FancyButtonProps> = ({ text, onPress }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={styles.button}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#ffc4ec', '#efdbfd', '#ffedd6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.text}>{text}</Text>
          <View style={styles.shimmer}></View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ rotate: '45deg' }],
    opacity: 0.5,
    width: '200%',
    left: '-50%',
    height: '300%',
    top: '-100%',
    animation: 'shimmer 1.5s infinite',
  },
});

export default FancyButton;