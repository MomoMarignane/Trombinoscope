import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, TextInput, ImageBackground } from 'react-native';
import axios from 'axios';
import MeteoButton from './components/MeteoButton';
import MapsButton from './components/MapsButton';
import BistroButton from './components/BistroButton';
import fetchWeatherData from './API/CallWeatherApi';
import MapView, { Marker } from 'react-native-maps';

const FeedScreen = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [mapsClicked, setMapsClicked] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Marseille');
  const [showWeatherText, setShowWeatherText] = useState(false);
  const [showMapsText, setShowMapsText] = useState(false);
  const [userCity, setUserCity] = useState('');
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);

  const location = {
    coords: {
      latitude: 43.296482,
      longitude: 5.369780,
    },
  };

  const handleAddAPI = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (isClicked) {
      fetchWeatherData(city)
        .then((data) => {
          setWeatherData(data);
          setShowWeatherText(true);
        })
        .catch((error) => {
          console.error('Error fetching weather data', error);
        });
    }
  }, [isClicked, city]);

  const handleWidgetSelection = async (widgetType) => {
    if (widgetType === 'Météo') {
      try {
        const data = await fetchWeatherData(city);
        setIsClicked(!isClicked);
        setWeatherData(data);
        setShowWeatherText(!isClicked);
      } catch (error) {
        console.error('Error fetching weather data', error);
      }
    } else if (widgetType === 'Maps') {
      setMapsClicked(!mapsClicked);
      setShowMapsText(!mapsClicked);
    } else if (widgetType == 'Bistro') {
      setMapsClicked(!mapsClicked);

    }
  };

  const handleBistroSelection = async (widgetType) => {
    if (widgetType === 'Météo') {
      try {
         setIsClicked(!isClicked);
      } catch (error) {
        console.error('Error fetching weather data', error);
      }
    } else if (widgetType === 'Maps') {

    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleOpenCityModal = () => {
    setIsCityModalVisible(true);
  };

  return (
    <ImageBackground
    source={require('../assets/backgroundApp.png')}
    style={{ flex: 1, position: 'fixed'}}
   >
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleAddAPI}>
        <Text style={styles.buttonText}>add Widget 📲</Text>
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.widgetsContainer}>
          {showWeatherText && (
            <View style={styles.weatherWidget}>
              <Text style={styles.weatherText}>{`Météo à ${city}: ${weatherData?.weather[0].description || ''}`}</Text>
              <TouchableOpacity onPress={handleOpenCityModal}>
                <Text style={styles.changeCityText}>Changer de ville</Text>
              </TouchableOpacity>
            </View>
          )}
          {showMapsText && (
            <View style={styles.mapsWidget}>
              <MapView
              style={{ width: '100%', height: '100%', borderRadius: 15}}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
                <Marker coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }} />
              </MapView>
            </View>
          )}
        </View>
      </ScrollView>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleWidget}>Select Widgets:</Text>
              <MeteoButton onPress={() => handleWidgetSelection('Météo')} />
              <MapsButton onPress={() => handleWidgetSelection('Maps')} setShowMapsText={setShowMapsText} />
              <BistroButton onPress={() => handleBistroSelection('Bistro')} setShowMapsText={setShowMapsText} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Boîte de dialogue modale de la ville */}
      <Modal
        visible={isCityModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCityModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsCityModalVisible(false)}>
          <View style={styles.cityModalContainer}>
            <View style={styles.cityModal}>
              <Text style={styles.cityModalTitle}>Entrez le nom de la ville:</Text>
              <TextInput
                style={styles.cityInput}
                value={userCity}
                onChangeText={(text) => setUserCity(text)}
                placeholder="Nom de la ville"
              />
              <View style={styles.cityModalButtons}>
                <TouchableOpacity
                  style={styles.cityModalButton}
                  onPress={() => setIsCityModalVisible(false)}
                >
                  <Text style={styles.cityModalButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cityModalButton}
                  onPress={() => {
                    setCity(userCity);
                    setIsCityModalVisible(false);
                  }}
                >
                  <Text style={styles.cityModalButtonText}>Confirmer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  button: {
    backgroundColor: 'rgba(60, 38, 80, 0.8)',
    paddingTop: 20,
    paddingLeft: 18,
    borderRadius: 15,
    alignSelf: 'flex-start',
    left: 135,
    height: 60,
    width: 150,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  titleWidget: {
    bottom: 5,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  titleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 10,
    width: 200,
    height: 300,
    left: 106,
    bottom: 450,
    borderRadius: 20,
  },
  widgetsContainer: {
    flexDirection: 'row', // Alignement horizontal
    flexWrap: 'wrap', // Passage à la ligne automatique
    justifyContent: 'flex-start', // Commence à gauche
  },
  weatherWidget: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    padding: 16,
    height: 190,
    width: 190, // Largeur de 45% pour laisser de l'espace entre les widgets
    margin: 5, // Marge entre les widgets
    left: 6,
  },
  mapsWidget: {
    left: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    padding: 16,
    height: 190,
    width: 190, // Largeur de 45% pour laisser de l'espace entre les widgets
    margin: 5, // Marge entre les widgets
  },
  weatherText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  changeCityText: {
    color: 'blue',
    marginTop: 5,
  },
  // Styles pour la boîte de dialogue modale de la ville
  cityModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cityModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    width: '80%',
  },
  cityModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cityInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  cityModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cityModalButton: {
    marginLeft: 10,
  },
  cityModalButtonText: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default FeedScreen;
