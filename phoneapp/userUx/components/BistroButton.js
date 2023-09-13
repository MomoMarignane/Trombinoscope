import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BistroButton = ({ onPress, setShowMapsText }) => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('bistroButtonClicked')
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
    setShowMapsText(!isClicked);
    AsyncStorage.setItem('bistroButtonClicked', JSON.stringify(!isClicked))
      .then(() => {
        onPress(!isClicked);
      })
      .catch((error) => {
        console.error('Error writing AsyncStorage:', error);
      });
  };

  const buttonColor = isClicked ? 'green' : 'blue';

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.button, { backgroundColor: buttonColor }]}>
      <Text style={styles.buttonText}>Calculatruce</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    top: 14,
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

export default BistroButton;
