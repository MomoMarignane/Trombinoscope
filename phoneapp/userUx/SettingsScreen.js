// SettingsScreen.js

import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const SettingsScreen = () => {
  return (
    <ImageBackground
    source={require('../assets/backgroundApp.png')} // Spécifiez le chemin de votre image
    style={{ flex: 1, position: 'fixed'}}
   >

    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {/* Ajoutez le contenu des paramètres ici */}
    </View>
   </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
