import React, { Component } from 'react';
import { View, Text, ScrollView, Animated, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importez useNavigation depuis @react-navigation/native
import SignInScreen from '../routes/SignInScreen';

export default function HomeScreen() {
  const scrollY = new Animated.Value(0);
  const navigation = useNavigation(); // Initialisez la navigation

  const signInOpacity = scrollY.interpolate ({
    inputRange: [330, 480],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const textOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const textSize = scrollY.interpolate({
    inputRange: [0, 850, 900],
    outputRange: [40, 20, 20],
    extrapolate: 'clamp',
  });

  return (
  <ImageBackground
    source={require('../assets/backgroundApp.png')} // Spécifiez le chemin de votre image
    style={{ flex: 1 }}
   >
    <ScrollView
      style={styles.container}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
    >
      <View style={{flex: 1, borderRadius: 15}}>

    <Animated.View style={[styles.parallaxText, { opacity: textOpacity }]}>
      <Animated.Text style={[{ fontSize: textSize }, styles.infoText]}>
          Welcome to Trombini !{'\n'}The future of business experience.
      </Animated.Text>
    </Animated.View>
    <Animated.View style={[{ opacity: signInOpacity }]}>
      <SignInScreen />
    </Animated.View>
      </View>
  </ScrollView>
</ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  parallaxText: {
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  infoText: {
    borderRadius: 15,
    width: 400,
    marginTop: '50%',
    fontSize: 40,
    color: 'rgba(60, 0, 8, 1)',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
