import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

type FancyButtonProps = {
  text: string;
  onPress: () => void;
  completed?: boolean;
};

const FancyButton: React.FC<FancyButtonProps> = ({ text, onPress, completed }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      friction: 4,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 300,
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
          colors={['#ffc0cb', '#d3d3d3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.text}>{text}</Text>
          {completed && <MaterialIcons name="check" size={20} color="green" style={styles.checkIcon} />}
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
    flexDirection: 'row',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 10,
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
    animation: 'shimmer .5s infinite',
  },
});

export default FancyButton;