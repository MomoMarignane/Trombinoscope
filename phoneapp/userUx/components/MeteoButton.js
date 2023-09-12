import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MeteoButton = ({ onPress }) => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // Au chargement du composant, vérifiez si l'état précédent est stocké en AsyncStorage
    AsyncStorage.getItem('isClicked')
      .then((value) => {
        if (value !== null) {
          setIsClicked(value === 'true');
        }
      })
      .catch((error) => {
        console.error('Error reading AsyncStorage:', error);
      });
  }, []);

  const handlePress = () => {
    setIsClicked(!isClicked);
    // Sauvegardez l'état actuel dans AsyncStorage
    AsyncStorage.setItem('isClicked', JSON.stringify(!isClicked))
      .then(() => {
        onPress(!isClicked); // Passez l'état actuel inversé au parent
      })
      .catch((error) => {
        console.error('Error writing AsyncStorage:', error);
      });
  };

  const buttonColor = isClicked ? 'green' : 'blue';

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.button, { backgroundColor: buttonColor }]}>
      <Text style={styles.buttonText}>Météo</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default MeteoButton;
