import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function SignInScreen() {
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  window.token = '';
  const navigation = useNavigation();

  const handleSignIn = async () => {
    console.log('mail:', Email);
    console.log('pass:', password);
      try {
        const response = await axios.post(
          'https://masurao.fr/api/employees/login',
          {
            email: Email,
            password: password,
          },
          {
            headers: {
              'X-Group-Authorization': 'kwK0fbWlgTGII7SKHn4_4ua7dKZ9pbNF',
            },
          }
        );
        window.token = response.data.access_token;
        navigation.navigate('userux', { token: response.data.access_token });
    } catch (error) {
        console.error('Front error: ', error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>Connexion</Text>
        <View style={styles.contentContainer}>
        <TextInput
          style={[styles.input, { color: 'black' }]}
          placeholder="Mail"
          placeholderTextColor="gray"
          onChangeText={(text) => setEmail(text)}
          value={Email}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="grey"
            secureTextEntry={!isPasswordVisible}
            onChangeText={(text) => setPassword(text)}
            value={password}
            labelStyle={{ color: 'white' }} // Couleur du label
          inputStyle={{ color: 'white' }}
          />
          <TouchableOpacity style={styles.iconContainer} onPress={togglePasswordVisibility}>
            <Icon
              name={isPasswordVisible ? 'eye-slash' : 'eye'}
              size={30}
              color="#000"
            />
          </TouchableOpacity>
        </View>
        <Button title="Sign In!" onPress={handleSignIn} />
      </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginBottom: '80%',
    marginTop: '-350%',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    width: '80%',
  },
  title: {
    fontSize: 30,
    marginTop: '450%',
    marginBottom: '5%',
    color: 'rgb(255, 97, 0)',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
  },
  input: {
    width: '70%',
    height: 40,
    borderColor: 'black',
    borderRadius: 50,
    marginTop: '10%',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    marginLeft: '14.5%',
    color: '#ffffff',
  },
  passwordContainer: {
    color: 'black',
    marginLeft: '14.5%',
    width: '86.5%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    borderRadius: 50,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft: 8,
  },
  iconContainer: {
    padding: 8,
  },
});