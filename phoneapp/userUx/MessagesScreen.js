import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import { ref, onValue, getDatabase } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import TalkingScreen from './TalkingScreen';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const firebaseConfig = {
  apiKey: "AIzaSyAen2RafQ1J31a5yocRTBKQ-q2XrKD7Ym4",
  authDomain: "messagerieepitech.firebaseapp.com",
  databaseURL: "https://messagerieepitech-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "messagerieepitech",
  storageBucket: "messagerieepitech.appspot.com",
  messagingSenderId: "179932330242",
  appId: "1:179932330242:web:46b19eecb35327e2776a1b",
  measurementId: "G-ZRCRSS9TJ5"
};

const app = initializeApp(firebaseConfig);

const MessagesScreen = () => {
  const [messages, setMessages] = useState([]);
  const db = getDatabase();
  const navigation = useNavigation();

  useEffect(() => {
    const messagesRef = ref(db, 'messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data);
        setMessages(messageList);
      }
    });

    // Nettoyez le gestionnaire d'abonnement lors du démontage du composant
    return () => {
      unsubscribe();
    };
  }, [db]);

  return (
    <ImageBackground
      source={require('../assets/backgroundApp.png')}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Messages</Text>
        <View style={{backgroundColor: 'black', top: 13, left: 20}}>

        <TouchableOpacity
            onPress={() => {
              navigation.navigate('TalkingScreen');
            }}
            style={styles.sendMessageButton}
          >
            <FontAwesomeIcon name="plus-circle" size={45} color="rgba(0, 0, 255, 0.6)" style={{}} />
          </TouchableOpacity>
          </View>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.timestamp.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('TalkingScreen', { item });
              }}
            >
              <View style={styles.messageContainer}>
                <Text style={styles.senderName}>{item.senderName}</Text>
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 22,
    marginTop: 15,
    bottom: 5,
    textAlign: 'center', // Centrer le titre
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
  },
  sendMessageButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Couleur de fond du bouton
    borderRadius: 20, // Assurez-vous qu'il s'agit d'un cercle pour un aspect Apple-like
    width: 60, // Largeur du bouton
    height: 60, // Hauteur du bouton
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagesScreen;
