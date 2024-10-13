import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Text, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onContinue }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowContinue(true);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Ionicons name="folder" size={60} color="#eb6e6e" />
        <Text style={styles.appName}>Jottera</Text>
      </Animated.View>
      {showContinue && (
        <Pressable 
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continueButtonPressed
          ]}
          onPress={onContinue}
        >
          {({ pressed }) => (
            <Text style={[styles.continueText, pressed && styles.continueTextPressed]}>
              Continue
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  continueButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#eb6e6e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: width * 0.8,
    alignItems: 'center',
  },
  continueButtonPressed: {
    backgroundColor: '#d55d5d', // Darker shade when pressed
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueTextPressed: {
    color: '#F0F0F0', // Slightly darker text when pressed
  },
});

export default SplashScreen;