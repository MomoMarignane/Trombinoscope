import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback, ScrollView, Image, ImageBackground } from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [userDataWithImages, setUserDataWithImages] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        'https://masurao.fr/api/employees',
        {
          headers: {
            'accept': 'application/json',
            'X-Group-Authorization': 'kwK0fbWlgTGII7SKHn4_4ua7dKZ9pbNF',
            'Authorization': 'Bearer ' + window.token,
          },
        }
      );
      const usersData = response.data;

      const userDataWithImagesPromises = usersData.map(async (user) => {
        try {
          const imageResponse = await axios.get(
            `https://masurao.fr/api/employees/${user.id}/image`,
            {
              headers: {
                'accept': 'image/png',
                'X-Group-Authorization': 'kwK0fbWlgTGII7SKHn4_4ua7dKZ9pbNF',
                'Authorization': 'Bearer ' + window.token,
              },
              responseType: 'arraybuffer',
            }
          );

          const imageBuffer = imageResponse.data;
          // const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
          // const imageUri = URL.createObjectURL(imageBlob);
          const base64Image = Buffer.from(imageBuffer, 'binary').toString('base64');
          const imageUri = `data:image/png;base64,${base64Image}`;
          return {
            ...user,
            imageUri,
          };
        } catch (error) {
          console.error(`Erreur lors de la récupération de l'image pour l'utilisateur ${user.id}`, error);
          // Gérez les erreurs ici, par exemple, en assignant une URL d'image par défaut
          return {
            ...user,
            imageUri: 'URL_PAR_DEFAUT',
          };
        }
      });

      const userDataWithImages = await Promise.all(userDataWithImagesPromises);
      setUserDataWithImages(userDataWithImages);
    } catch (error) {
      console.error('user error', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = userDataWithImages.filter((user) => {
    const userName = user.name.toLowerCase();
    return userName.includes(searchText.toLowerCase());
  });

  return (
    <ImageBackground
    source={require('../assets/backgroundApp.png')} // Spécifiez le chemin de votre image
    style={{ flex: 1, position: 'fixed'}}
   >

    <ScrollView style={styles.userList}>
      <Text style={styles.title}>Search 🔍</Text>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.input}
              placeholder="Search..."
              onChangeText={(text) => setSearchText(text)}
              value={searchText}
              />
          </View>
          {
            searchText !== '' ? (
              filteredUsers.map((user, index) => (
                <View style={styles.cardContainer} key={user.id}>
                  <View style={styles.card}>
                    <Image source={{ uri: user.imageUri.toString() }} style={{ width: 150, height: 150, borderRadius: 75 }} />
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.age}>{user.email} email: </Text>
                    <Text style={styles.age}>{user.surname} surname: </Text>
                  </View>
                </View>
              ))) : null
            }
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    width: '100%',
    top: 40,
    marginBottom: 240,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    top: 20, // Ajustez cette valeur selon vos besoins
    left: 168
  },
  userItem: {
    fontSize: 18,
    marginVertical: 8,
    bottom: 200,
    height: 300,
    textAlign:'center',
  },
  userList: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    // minHeight: '100%',
  },

  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //height:
  },

  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 10,
    //height: '0%',
    width: '0%',
    padding: 50,
    marginBottom: 170,
  },

});

export default SearchScreen;
