import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import axios from 'axios';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const SettingsScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [imageData, setImageData] = useState(null);

      if (currentIndex == 1) { //load the first profile
        console.log('first ' + currentIndex);
        axios
          .get('https://masurao.fr/api/employees/' + (currentIndex + 1), {
            headers: {
              'accept': 'application/json',
              'X-Group-Authorization': 'kwK0fbWlgTGII7SKHn4_4ua7dKZ9pbNF',
              'Authorization': 'Bearer ' + window.token,
            },
          })
          .then(function (response) {
            setProfiles(response.data);
            console.log('profiles: ' + profiles.subordinates.length);
            console.log('resp: ' + response.data.birthdate);
            axios
              .get('https://masurao.fr/api/employees/' + (currentIndex + 1) + '/image', {
                responseType: 'arraybuffer',
                headers: {
                  'accept': 'application/json',
                  'X-Group-Authorization': 'kwK0fbWlgTGII7SKHn4_4ua7dKZ9pbNF',
                  'Authorization': 'Bearer ' + window.token,
                },
              })
              .then(function (response) {
                setImageData('https://masurao.fr/api/employees/' + (currentIndex + 1) + '/image');
                // console.log('https://masurao.fr/api/employees/' + (currentIndex + 1) + '/image');
              })
              .catch(function (error) {
                console.log('Error', error);
              });
          })
          .catch(function (error) {
            console.log('Error', error);
          });
        setCurrentIndex(currentIndex + 1); // Use modulo to loop
      }

  const [profiles, setProfiles] = useState({
    id: 1,
    email: '',
    name: '',
    surname: '',
    birth_date: '',
    gender: '',
    work: '',
    subordinates: [
      0
    ],
  });

  const [animation] = useState(new Animated.Value(0)); // Initialize the animation value
  const cardStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 500], // Adjust the distance you want to move the card
        }),
      },
    ],
  };

  const handleSwipeRight = () => {
    // Trigger a right swipe animation
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      handleDislike();
      animation.resetAnimation();
    });
  };

  const handleSwipeLeft = () => {
    Animated.timing(animation, {
      toValue: -1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      handleDislike();
      animation.resetAnimation();
    });
  };

  const handleDislike = () => {
    console.log(currentIndex);
    axios
      .get('https://masurao.fr/api/employees/' + (currentIndex + 1), {
        headers: {
          'accept': 'application/json',
          'X-Group-Authorization': 'kwK0fbWlgTGII7SKHn4_4ua7dKZ9pbNF',
          'Authorization': 'Bearer ' + window.token,
        },
      })
      .then(function (response) {
        setProfiles(response.data);
        console.log('profiles: ' + profiles.subordinates.length);
        console.log('resp: ' + response.data.birthdate);
        axios
          .get('https://masurao.fr/api/employees/' + (currentIndex + 1) + '/image', {
            responseType: 'arraybuffer',
            headers: {
              'accept': 'application/json',
              'X-Group-Authorization': 'kwK0fbWlgTGII7SKHn4_4ua7dKZ9pbNF',
              'Authorization': 'Bearer ' + window.token,
            },
          })
          .then(function (response) {
            setImageData('https://masurao.fr/api/employees/' + (currentIndex + 1) + '/image');
            // console.log('https://masurao.fr/api/employees/' + (currentIndex + 1) + '/image');
          })
          .catch(function (error) {
            console.log('Error', error);
          });
      })
      .catch(function (error) {
        console.log('Error', error);
      });
    setCurrentIndex(currentIndex + 1); // Use modulo to loop
  };

  const handleLike = () => {
    // Handle the "Like" action here
    // You can send a request to your server or update the UI
    // For this example, we'll just move to the next profile
    handleDislike();
    //setCurrentIndex(currentIndex + 1); // Use modulo to loop
  };


  return (
    <ImageBackground source={require('../assets/backgroundApp.png')} style={{ flex: 1 }}>
      <View style={styles.container_discovery}>
        {profiles && (
          <Animated.View style={[styles.card, cardStyle]}>
            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', height: 230, top: 130, width: 340, borderRadius: 15}}>
            <Image style={styles.image} source={{ uri: imageData }} />
            <FontAwesome5Icon name="user" style={{bottom: 249.5, fontSize: 30, left: 11}} />
            {profiles.name && (
              <Text style={styles.name}>{profiles.name} {profiles.age}</Text>
              )}
            <FontAwesome5Icon name="venus-mars" style={[{bottom: 270, color: 'rgba(255, 255, 255, 0.6)'}, styles.icon]} />
            {profiles.gender && (
              <Text style={{bottom: 297, fontSize: 26, textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)'}}>{profiles.gender}</Text>
              )}
            <FontAwesome5Icon name="briefcase" style={[{bottom: 275.5, color: 'rgba(255, 255, 255, 0.6)'}, styles.icon]} />
            {profiles.work && (
              <Text style={{bottom: 305, fontSize: 26, textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)'}}>{profiles.work}</Text>
              )}
            <FontAwesome5Icon name="envelope" style={[{bottom: 279, color: 'rgba(255, 255, 255, 0.6)'}, styles.icon]} />
            {profiles.email && (
              <Text style={{bottom: 305, fontSize: 24, textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)'}}>{profiles.email}</Text>
              )}
              <FontAwesome5Icon name="birthday-cake" style={[{bottom: 279, color: 'rgba(255, 255, 255, 0.9)'}, styles.icon]} />
            {profiles.birth_date && (
              <Text style={{bottom: 302, fontSize: 26, textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)'}}>{profiles.birth_date}</Text>
              )}
              </View>
          </Animated.View>
        )}
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleSwipeLeft} style={styles.dislikeButton}>
            <Text>Dislike</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSwipeRight} style={styles.likeButton}>
            <Text>Like</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  imageButton: {
    backgroundColor: '#666666',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  imageIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  container_discovery: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(10, 10, 50, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '90%',
    height: '70%',
    borderRadius: 20, // Added border radius to make the card more visually appealing
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    bottom: 280,
    left: 70,
  },
  name: {
    fontSize: 44,
    fontWeight: 'bold',
    marginVertical: 10,
    bottom: 295,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  dislikeButton: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 50,
    marginHorizontal: 20,
  },
  likeButton: {
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 50,
    marginHorizontal: 20,
  },
  icon: {
    fontSize: 25,
    left: 8,
  },
});

export default SettingsScreen;
