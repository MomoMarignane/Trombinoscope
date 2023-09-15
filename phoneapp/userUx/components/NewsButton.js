import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchNewsData } from '../API/CallNewsApi'; // Assurez-vous d'importer la fonction fetchNewsData

const NewsButton = ({ onPress }) => {
  const [NewsisClicked, setNewsIsClicked] = useState(false);

  useEffect(() => {
    // Au chargement du composant, vérifiez si l'état précédent est stocké en AsyncStorage
    AsyncStorage.getItem('NewsisClicked')
      .then((value) => {
        if (value !== null) {
          setNewsIsClicked(value === 'true');
        }
      })
      .catch((error) => {
        console.error('Error reading AsyncStorage:', error);
      });
  }, []);

  const handlePress = async () => {
    setNewsIsClicked(!NewsisClicked);
    // Appel de la fonction fetchNewsData pour récupérer les données de l'API News
    try {
      const data = await fetchNewsData();
      onPress(!NewsisClicked, data); // Passez l'état actuel inversé au parent et les données News
    } catch (error) {
      console.error('Error fetching News data', error);
    }

    // Sauvegardez l'état actuel dans AsyncStorage
    AsyncStorage.setItem('NewsisClicked', JSON.stringify(!NewsisClicked))
      .catch((error) => {
        console.error('Error writing AsyncStorage:', error);
      });
  };

  const buttonColor = NewsisClicked ? 'green' : 'blue';

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.button, { backgroundColor: buttonColor }]}>
      <Text style={styles.buttonText}>News</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    top: 14,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default NewsButton;
