import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, TextInput, ImageBackground, Linking } from 'react-native';
import axios from 'axios';
import MeteoButton from './components/MeteoButton';
import MapsButton from './components/MapsButton';
import NewsButton from './components/NewsButton';
import { fetchNewsData } from './API/CallNewsApi'; // Importez correctement la fonction
import fetchWeatherData from './API/CallWeatherApi';
import MapView, { Marker } from 'react-native-maps';
import { fetchRandomQuote } from './API/CallQuoteApi'; // Assurez-vous d'importer la fonction fetchRandomQuote
import QuoteButton from './components/QuoteButton';

const FeedScreen = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [mapsClicked, setMapsClicked] = useState(false);
  const [quoteClicked, setQuoteClicked] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [quoteData, setQuoteData] = useState(null); // Changez "QuoteData" en "quoteData"
  const [newsData, setNewsData] = useState([]); // Changez "NewsData" en "newsData"
  const [calculette, setCalculetteClicked] = useState(false);
  const [city, setCity] = useState('Marseille');
  const [showWeatherText, setShowWeatherText] = useState(false);
  const [showMapsText, setShowMapsText] = useState(false);
  const [showNewsText, setShowNewsText] = useState(false);
  const [userCity, setUserCity] = useState('');
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const [newsClicked, setNewsClicked] = useState(false);
  const [showQuoteText, setShowQuoteText] = useState(false);

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
    } else if (widgetType === 'News') {
      try {
        const data = await fetchNewsData(); // Utilisez la fonction importée correctement
        setNewsClicked(!newsClicked);
        setNewsData(data); // Utilisez setNewsData pour stocker les données
        setShowNewsText(!newsClicked);
      } catch (error) {
        console.error('Error fetching News data', error);
      }
    } else if (widgetType === 'Quote') {
      try {
        const data = await fetchRandomQuote(); // Utilisez la fonction pour obtenir une citation aléatoire
        setQuoteClicked(!quoteClicked);
        setQuoteData(data); // Stockez les données de la citation
        setShowQuoteText(!quoteClicked);
      } catch (error) {
        console.error('Error fetching Quote data', error);
      }
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
      style={{ flex: 1, backgroundColor: 'rgba(94, 0, 0, 0.6)' }}
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
                  style={{ width: '100%', height: '100%', borderRadius: 15 }}
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
            {showNewsText && (
              <View style={styles.newsWidget}>
                <ScrollView style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 10 }}>
                  {newsData.map((news, index) => (
                    <TouchableOpacity key={index} onPress={() => Linking.openURL(news.url)}>
                      <Text>{news.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            {showQuoteText && (
              <View style={styles.quoteWidget}>
                <Text style={styles.quoteText}>{quoteData?.content}</Text>
                <Text style={styles.authorText}>- {quoteData?.author}</Text>
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
                <NewsButton onPress={() => handleWidgetSelection('News')} />
                <QuoteButton onPress={() => handleWidgetSelection('Quote')} />
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
  },
  button: {
    backgroundColor: 'rgba(60, 38, 80, 0.9)',
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
    width: 190,
    margin: 5,
    left: 6,
  },
  mapsWidget: {
    left: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    padding: 16,
    height: 190,
    width: 190,
    margin: 5,
  },
  newsWidget: {
    left: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    padding: 16,
    height: 190,
    width: 190,
    margin: 5,
  },
  quoteWidget: {
    left: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    padding: 16,
    height: 190,
    width: 190,
    margin: 5,
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
