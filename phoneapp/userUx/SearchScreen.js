import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback, ScrollView, Image, ImageBackground, Animated } from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import Icon from 'react-native-vector-icons/FontAwesome';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [userDataWithImages, setUserDataWithImages] = useState([]);
  const [cardOpacities, setCardOpacities] = useState([]);

  const scrollY = new Animated.Value(0);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        'https://masurao.fr/api/employees',
        {
          headers: {
            'accept': 'application/json',
            'X-Group-Authorization': 'eea91ccb2471865fb7ba3b96b138815c',
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
                'X-Group-Authorization': 'eea91ccb2471865fb7ba3b96b138815c',
                'Authorization': 'Bearer ' + window.token,
              },
              responseType: 'arraybuffer',
            }
          );

          const imageBuffer = imageResponse.data;
          const base64Image = Buffer.from(imageBuffer, 'binary').toString('base64');
          const imageUri = `data:image/png;base64,${base64Image}`;
          return {
            ...user,
            imageUri,
          };
        } catch (error) {
          console.error(`Erreur lors de la récupération de l'image pour l'utilisateur ${user.id}`, error);
          return {
            ...user,
            imageUri: 'URL_PAR_DEFAUT',
          };
        }
      });

      const userDataWithImages = await Promise.all(userDataWithImagesPromises);
      setUserDataWithImages(userDataWithImages);

      // Mettez à jour le tableau d'opacités chaque fois que les données d'utilisateur changent
      const newOpacities = userDataWithImages.map(() => new Animated.Value(1));
      setCardOpacities(newOpacities);
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

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <ImageBackground
      source={require('../assets/backgroundApp.png')}
      style={{ flex: 1, position: 'fixed' }}
    >
      <ScrollView
        style={styles.userList}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
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
            {searchText !== '' ? (
              filteredUsers.map((user, index) => (
                <Animated.View
                  style={[styles.cardContainer, { opacity: cardOpacities[index] }]}
                  key={user.id}
                >
                  <View style={styles.card}>
                    <Image
                      source={{ uri: user.imageUri.toString() }}
                      style={{ width: 100, height: 100, borderRadius: 25, right: 38, bottom: 35 }}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', bottom: 120 }}>
                      <Icon name="user" size={20} color="white" style={{left: 49, bottom: 15}}/>
                      <Text style={{ bottom: 15, left: 55, color: 'white', fontSize: 20, textAlign: 'center' }}>{user.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', bottom: 120 }}>
                      <Icon name="id-card" size={20} color="white" style={{left: 49}}/>
                      <Text style={{ left: 55, color: 'white', fontSize: 20, textAlign: 'center' }}>{user.surname}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', bottom: 120 }}>
                      <Icon name="envelope" size={20} color="white" style={{left: 49, top: 15}}/>
                      <Text style={{ top: 15, left: 55, color: 'white', fontSize: 20, textAlign: 'center' }}>{user.email}</Text>
                    </View>
                  </View>
                </Animated.View>
              ))
            ) : null}
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
    marginBottom: 90,
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
    top: 20,
    left: 168
  },
  userList: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 25,
    width: 375,
    height: 133,
    padding: 50,
    marginBottom: 50,
  },
});

export default SearchScreen;
