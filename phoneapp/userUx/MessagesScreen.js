import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { ref, onValue, getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { useNavigation } from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

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
  const [user, setUser] = useState(null);
  const [newSenderName, setNewSenderName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Ajout de l'état selectedItem

  const db = getDatabase();
  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    const messagesRef = ref(db, 'messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data);
        setMessages(messageList);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [db]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [auth]);

  const loginUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'ugdfrtb@masurao.jp',
        'password'
      );
      const user = userCredential.user;
      setUser(user);
    } catch (error) {
      console.error('Erreur de connexion : ', error);
    }
  };

  const handleModalSubmit = () => {
    if (selectedItem) {
      // Mettez à jour selectedItem.senderName avec le nouveau nom saisi
      const newItem = { ...selectedItem, senderName: newSenderName };
      navigation.navigate('TalkingScreen', { item: newItem });
      setIsModalVisible(false);
    }
  };

  return (
    <ImageBackground source={require('../assets/backgroundApp.png')} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Messages</Text>
        <View style={{ backgroundColor: 'black', top: 13, left: 20 }}>
          {user ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
              }}
              style={styles.sendMessageButton}
            >
              <FontAwesomeIcon name="plus-circle" size={45} color="rgba(0, 0, 255, 0.55)" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={loginUser} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Se connecter</Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.timestamp.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedItem(item); // Mettre à jour selectedItem
                setIsModalVisible(true); // Ouvrir le modal pour modifier le nom
              }}
            >
              <View style={styles.messageContainer}>
                <Text style={styles.senderName}>
                  <Text style={{ fontWeight: 'bold' }}>{item.senderName}: </Text>
                  <Text>{item.text}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Entrez le nom de l'expéditeur :</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Nom"
            value={newSenderName}
            onChangeText={(text) => setNewSenderName(text)}
          />
          <Button title="Valider" onPress={handleModalSubmit} />
        </View>
      </Modal>
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
    textAlign: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 20,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 20,
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 16,
  },
  modalInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    marginBottom: 16,
  },
});

export default MessagesScreen;
