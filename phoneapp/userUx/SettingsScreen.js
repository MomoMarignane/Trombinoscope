import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import axios from 'axios';

const SettingsScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [imageData, setImageData] = useState(null);
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
      duration: 300, // Adjust the duration of the animation
      easing: Easing.linear,
      useNativeDriver: false, // Important: You must set this to false for transform animations
    }).start(() => {
      // Animation is complete, you can perform any additional actions here
      handleDislike();
      animation.resetAnimation(); // Call handleDislike after the animation is complete
    });
    //Animated.reset();

  };

  const handleSwipeLeft = () => {
    // Trigger a left swipe animation
    Animated.timing(animation, {
      toValue: -1,
      duration: 300, // Adjust the duration of the animation
      easing: Easing.linear,
      useNativeDriver: false, // Important: You must set this to false for transform animations
    }).start(() => {
      // Animation is complete, you can perform any additional actions here
      handleDislike();
      animation.resetAnimation();
       // Call handleDislike after the animation is complete
    });
    //animation.reset();
  };

  const handleDislike = () => {
    // Handle the "Dislike" action here
    // You can send a request to your server or update the UI
    // For this example, we'll just move to the next profile
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
            <Image style={styles.image} source={{ uri: imageData }} />
            {profiles.name && (
              <Text style={styles.name}>{profiles.name}, {profiles.age}</Text>
            )}
            {profiles.gender && profiles.work && (
              <Text style={styles.details}>{profiles.gender} - {profiles.work}</Text>
            )}
            {profiles.email && (
              <Text style={styles.details}>{profiles.email}</Text>
            )}
            {profiles.birth_date && (
              <Text style={styles.details}>Birth Date: {profiles.birth_date}</Text>
            )}
            {profiles.subordinates && profiles.subordinates.length > 0 && currentIndex !== 1 && (
              <Text style={styles.details}>Subordinates: {profiles.subordinates.join(', ')}</Text>
            )}
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
        {/* Add your settings content here */}
      </View>

      {/* Bottom toolbar */}

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
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
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
    marginBottom: 10, // Separation between image and profile details
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  details: {
    fontSize: 20,
    marginBottom: 5, // Added margin to separate details
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
});

export default SettingsScreen;
