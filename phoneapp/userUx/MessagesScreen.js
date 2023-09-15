import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import { ref, push, getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

// Initialisez Firebase avec votre configuration

// Initialisez Firebase avec votre configuration

const MessagesScreen = () => {
  const route = useRoute();
  const { firebaseApp } = route.params;
  const [message, setMessage] = useState('');
  const [recipientID, setRecipientID] = useState('');
  const [userID, setUserID] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');

  // Initialisez Firebase avec la configuration
  // if (!firebase.apps.length) {
  //   initializeApp(firebaseApp);
  // }

  const auth = getAuth();
  const db = getDatabase();
  const navigation = useNavigation();


  useEffect(() => {
    // Vérifiez si l'utilisateur est déjà connecté
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // L'utilisateur est connecté, vous pouvez accéder à user.uid ici
        setUser(user);
      } else {
        // L'utilisateur n'est pas connecté
        setUser(null);
      }
    });

    // Assurez-vous de vous désabonner lorsque le composant est démonté
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      setUser(currentUser);

      // Redirigez l'utilisateur vers DatabaseScreen (TalkingScreen) après la connexion
      navigation.navigate('TalkingScreen', { userName: userName }); // Assurez-vous Xd'avoir la bonne clé d'écran ici
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
    }
  };

  const signUp = async () => {
    try {
      // Créez un compte avec l'e-mail et le mot de passe prédéfinis par le développeur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      setUser(currentUser);
      setUserID(currentUser.uid); // Stockez l'ID de l'utilisateur ici
    } catch (error) {
      console.error('Erreur lors de la création du compte :', error);
    }
  };

  const NavigateIntoConversations = async () => {
    navigation.navigate('TalkingScreen', { userName: userName });
  }

  const sendMessage = async () => {
    // Vérifiez si le message et l'ID du destinataire sont saisis
    if (message && recipientID) {
      try {
        // Vérifiez si l'utilisateur est connecté
        if (auth.currentUser) {
          // Si l'utilisateur est connecté, obtenez son UID
          const currentUser = auth.currentUser;
          const currentUserID = currentUser.uid;
          setUserID(currentUserID);

          // Créez une nouvelle référence pour le message
          const messageRef = push(ref(db, `messages/${recipientID}`), {
            text: message,
            senderID: currentUserID,
            timestamp: Date.now(),
          });

          // Effacez le champ de texte après l'envoi
          setMessage('');
        } else {
          console.error('L\'utilisateur n\'est pas connecté.');
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message :', error);
      }
    } else {
      console.error('Le message ou l\'ID du destinataire est manquant.');
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        // L'utilisateur est connecté, affichez le formulaire d'envoi de message
        <>
          <Text style={styles.title}>Envoyer un Message Privé</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre message"
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="ID du Destinataire"
            value={recipientID}
            onChangeText={(text) => setRecipientID(text)}
          />
          <Button title="Envoyer" onPress={sendMessage} />
          <Button title="Voir vos conversations" onPress={NavigateIntoConversations} />
        </>
      ) : (
        // L'utilisateur n'est pas connecté, affichez le formulaire de connexion et d'inscription
        <>
          <Text style={styles.title}>Connexion</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={userName}
            onChangeText={(text) => setUserName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          <Button title="Se connecter" onPress={signIn} />
          <Button title="S'inscrire" onPress={signUp} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 0, 0, 0.6)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'rgba(0, 0, 0, 1)',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default MessagesScreen;