import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ImageBackground, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { ref, push, onValue, getDatabase, remove } from 'firebase/database'; // Importez remove pour supprimer un message
import { initializeApp } from "firebase/app"; // Importez initializeApp directement
import { getAnalytics } from "firebase/analytics";
import Icon from 'react-native-vector-icons/FontAwesome';

// Votre configuration Firebase
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
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const db = getDatabase(); // Utilisez getDatabase pour accéder à la base de données Firebase

  useEffect(() => {
    // Écoutez les modifications de la base de données Firebase en temps réel
    onValue(ref(db, 'messages'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data);
        setMessages(messageList);
      }
    });
  }, []);

  const sendMessage = () => {
    if (messageText.trim() !== '') {
      // Envoyez le message à la base de données Firebase
      push(ref(db, 'messages'), {
        text: messageText,
        timestamp: Date.now(),
      });
      setMessageText('');
    }
  };

  const deleteMessage = (message) => {
    // Utilisez la clé unique du message pour le supprimer de la base de données
    remove(ref(db, `messages/${message.key}`))
      .then(() => {
        // Mettez à jour l'état messages après la suppression réussie
        setMessages((prevMessages) => prevMessages.filter((m) => m.key !== message.key));
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du message : ", error);
      });
  };

  return (
    <ImageBackground
    source={require('../assets/backgroundApp.png')} // Spécifiez le chemin de votre image
    style={{ flex: 1, position: 'fixed'}}
   >
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding" // Ce comportement permet de faire monter la vue lors de l'affichage du clavier
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 50 })} // Ajustez la valeur selon vos besoins
    >
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.timestamp.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteMessage(item)}>
              <Icon name="trash-o" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
        />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tapez votre message..."
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
          />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
          </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
  </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 22,
    top: 15,
  },
  messageContainer: {
    top: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    left: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputContainer: {
    bottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height: 50,
    width: 403,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    right: 4,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MessagesScreen;
