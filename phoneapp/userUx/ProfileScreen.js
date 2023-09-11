import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import axios from 'axios';

const ProfileScreen = () => {
  const [userData, setUserData] = useState({ subordinates: [] });
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const dataUser = await axios.get(
          'https://masurao.fr/api/employees/me',
          {
            headers: {
              'X-Group-Authorization': 'kwK0fbWlgTGII7SKHn4_4ua7dKZ9pbNF',
              'Authorization': 'Bearer ' + window.token,
            },
          });
        const userData = dataUser.data;
        setUserData(userData);
        fetchUserImg(userData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    const fetchUserImg = async (userData) => {
      const path =
      `https://masurao.fr/api/employees/${userData.id}/image`;
      try {
        await axios.get(path, {
          headers: {
            'accept': 'image/png',
            'X-Group-Authorization': 'kwK0fbWlgTGII7SKHn4_4ua7dKZ9pbNF',
            'Authorization': 'Bearer ' + window.token,
          },
          responseType: 'arraybuffer',
        });
        setImageData(`https://masurao.fr/api/employees/${userData.id}/image`);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {userData ? (
        <>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.surname}>{`Surname: ${userData.surname}`}</Text>
          {imageData && (
            <View>
              <Image source={{ uri: imageData }} style={styles.image} />
            </View>
          )}
          <Text style={styles.gender}>Gender{'\n'}{userData.gender}</Text>
          <Text style={styles.email}>E-mail user{'\n'}{userData.email}</Text>
          <Text style={styles.age}>{`Birthday\n${userData.birth_date}`}</Text>
          <Text style={styles.work}>Working in{'\n'}{userData.work}</Text>
          <View>
            {userData.subordinates.length === 0 ? (
              <Text style={styles.noSubordinates}>No subordinates found.</Text>
            ) : (
              userData.subordinates.map((subordinate, index) => (
                <Text style={styles.subordinates} key={index}>Subordinates: {subordinate}</Text>
              ))
            )}
          </View>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'grey',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    bottom: 160,
    justifyContent: 'center',
  },
  name: {
    bottom: 150,
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  email: {
    fontSize: 25,
    textAlign: 'center',
    bottom: 140,
  },
  age: {
    bottom: 125,
    fontSize: 25,
    textAlign: 'center',
  },
  surname: {
    top: 3,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gender: {
    top: '6%',
    fontSize: 25,
    textAlign: 'center',
  },
  work: {
    bottom: 40,
    fontSize: 25,
    textAlign: 'center',
  },
  noSubordinates: {
    top: '-9%',
    fontSize: 25,
    textAlign: 'center',
  },
  subordinates: {
    top: '20%',
    fontSize: 25,
    textAlign: 'center',
  }
});

export default ProfileScreen;