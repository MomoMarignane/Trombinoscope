import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoadingScreen = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);

  // Mettez à jour la barre de progression à intervalles réguliers
  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress(progress + 1); // Augmentez la progression d'1% à chaque intervalle
      } else {
        clearInterval(interval);
        navigation.navigate('userux',);
      }
    }, 25); // Mettez à jour la barre environ toutes les 60 millisecondes

    // Nettoyez l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, [progress]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/splash.png')} style={styles.logo} />
      <View style={styles.progressBar}>
        <View style={{ ...styles.progress, width: `${progress}%`, backgroundColor: '#000' }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100, // Ajustez la largeur et la hauteur de votre logo selon vos besoins
    height: 100,
    resizeMode: 'contain', // Ajustez le mode de redimensionnement selon vos besoins
    marginBottom: 20, // Espacement par rapport à la barre de progression
  },
  progressBar: {
    width: '80%',
    height: 5, // Hauteur fine de la barre
    backgroundColor: '#ccc', // Couleur grise
    borderRadius: 5, // Coins arrondis
  },
  progress: {
    height: '100%',
    backgroundColor: '#0000ff', // Couleur de la progression (bleu)
    borderRadius: 5, // Coins arrondis
  },
});

export default LoadingScreen;
