import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchRandomQuote } from '../API/CallQuoteApi'; // Assurez-vous d'importer la fonction fetchRandomQuote

const QuoteButton = ({ onPress }) => {
  const [quoteIsClicked, setQuoteIsClicked] = useState(false);

  useEffect(() => {
    // Au chargement du composant, vérifiez si l'état précédent est stocké en AsyncStorage
    AsyncStorage.getItem('quoteIsClicked')
      .then((value) => {
        if (value !== null) {
          setQuoteIsClicked(value === 'true');
        }
      })
      .catch((error) => {
        console.error('Error reading AsyncStorage:', error);
      });
  }, []);

  const handlePress = async () => {
    setQuoteIsClicked(!quoteIsClicked);
    // Appel de la fonction fetchRandomQuote pour récupérer les données de l'API Quote
    try {
      const data = await fetchRandomQuote();
      onPress(!quoteIsClicked, data); // Passez l'état actuel inversé au parent et les données Quote
    } catch (error) {
      console.error('Error fetching Quote data', error);
    }

    // Sauvegardez l'état actuel dans AsyncStorage
    AsyncStorage.setItem('quoteIsClicked', JSON.stringify(!quoteIsClicked))
      .catch((error) => {
        console.error('Error writing AsyncStorage:', error);
      });
  };

  const buttonColor = quoteIsClicked ? 'green' : 'blue';

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.button, { backgroundColor: buttonColor }]}>
      <Text style={styles.buttonText}>Quote</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    top: 21,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default QuoteButton;
