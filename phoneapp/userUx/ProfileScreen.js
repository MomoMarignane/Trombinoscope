import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const ProfileScreen = () => {
  Icon.loadFont(); // Chargez la police FontAwesome
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
      const path = `https://masurao.fr/api/employees/${userData.id}/image`;
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
    <ImageBackground source={require('../assets/backgroundApp.png')} style={styles.backgroundImage}>
    <View style={styles.container}>
      <View style={styles.container2}>
        {userData ? (
          <>
            {imageData && (
              <View>
                <Image source={{ uri: imageData }} style={styles.image} />
              </View>
            )}
            <Text style={styles.surname}>{userData.surname} {userData.name}</Text>
            <View style={styles.genderContainer}>
            <Icon name="user" size={20} color="black" style={styles.genderIcon} />
              <View style = {{
              borderColor: 'black',
              borderRadius: 15,
              borderWidth : 3,
              width: '100%',
              left : 27,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              marginLeft : 30,
            }}>
            <Text style={styles.genderText}>{userData.gender}</Text>
              </View>
            </View>
            <View style={styles.emailContainer}>
              <Icon name="envelope" size={20} color="black" style={styles.emailIcon}/>
              <View style = {{
              borderColor: 'black',
              borderRadius: 15,
              borderWidth : 3,
              width: '100%',
              left : 50,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
              <Text style={styles.emailText}>{userData.email}</Text>
              </View>
            </View>
            <View style={styles.birthdayContainer}>
            <Icon name="birthday-cake" size={20} color="black" style={styles.birthdayIcon}/>
            <View style = {{
              borderColor: 'black',
              borderRadius: 15,
              borderWidth : 3,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              left : 50,
              // backgroundColor : "red",
            }}>
            <Text style={styles.birthdayText}>{userData.birth_date}</Text>
            </View>
            </View>
            <View style={styles.workContainer}>
            <Icon name="briefcase" size={18} color="black" style={styles.workIcon} />
            <View style = {{
              borderColor: 'black',
              borderRadius: 15,
              borderWidth : 3,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              height: '100%',
              // backgroundColor : "blue",
            }}>
            <Text style={styles.workText}>{userData.work}</Text>
            </View>
            </View>
            <View>
              {userData.subordinates.length === 0 ? (
                <View style={styles.subordinatesContainer}>
                  <Icon name="group" size={18} color="black" style={styles.subordinatesIcon} />
                  <View style={{
                  borderColor: 'black',
                  borderRadius: 15,
                  borderWidth : 3,
                  width: '75%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 0, 0, 0.5)',
                  height: '60%',
                  left : 53,
                  }}>
                  <View style={styles.subordinatesTextContainer}>
                    <Text style={styles.subordinatesText}>No subordinates found.</Text>
                  </View>
                  </View>
                </View>
              ) : (
                userData.subordinates.map((subordinate, index) => (
                  <View style={styles.subordinatesContainer} key={index}>
                    <Icon name="group" size={18} color="black" style={styles.subordinatesIcon} />
                    <View style={styles.subordinatesTextContainer}>
                      <Text style={styles.subordinatesText}>{`Subordinates: ${subordinate}`}</Text>
                    </View>
                  </View>
                ))
                )}
            </View>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    marginTop: '10%',
    marginBottom: '40%',
    height: '20%',
    borderRadius: 30,
    backgroundColor: 'rgba(10, 10, 50, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    top: '25%',
  },
  surname: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    top: '7%',
    // marginBottom: 20,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    left : -120,
    // backgroundColor : 'yellow',
    top : 30,
    marginTop: 50,
    marginBottom: 10,
    width : '20%',
    height : '7.5%',
  },
  genderIcon: {
    left : 4,
    marginRight: 5,
    marginLeft: 5,
  },
  genderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    // backgroundColor: 'white',
  },
  gender: {
    fontSize: 18,
    textAlign: 'center',
    bottom: 40,
    // marginBottom: 15,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    left: -41,
    width : '60%',
    height : '7.5%',
    top : 45,
    // backgroundColor: 'blue',
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  emailIcon: {
    marginRight: 5,
    marginLeft: 5,
  },
  birthdayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    left : -90,
    width : '35%',
    height : '7.5%',
    top : 58,
    // backgroundColor: 'green',
  },
  birthdayIcon: {
    marginRight: 5,
    marginLeft: 5,
  },
  birthdayTextContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
  birthdayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  age: {
    fontSize: 18,
    textAlign: 'center',
    },
  workContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    width : '55%',
    height : '7.5%',
    top : 70,
  },
  workIcon: {
    left : -51,
    marginRight: 5,
    marginLeft: 5,
  },
  workText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  noSubordinates: {
    fontSize: 18,
    textAlign: 'center',
  },
  subordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top : 80,
  },
  subordinatesIcon: {
    left : 3.5,
    marginRight: 5,
    marginLeft: 5,
  },
  subordinatesTextContainer: {
    padding: 5,
    borderRadius: 5,
  },
  subordinatesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ProfileScreen;
