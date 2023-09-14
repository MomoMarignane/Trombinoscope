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
              'X-Group-Authorization': 'eea91ccb2471865fb7ba3b96b138815c',
              'Authorization': 'Bearer' + token,
            },
          }
        );
        window.token = response.data.access_token;
        navigation.navigate('loadingpage', { token: response.data.access_token });
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
          style={[styles.input, { color: 'rgba(255, 255, 255, 0.9)' }]}
          placeholder="Mail"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          onChangeText={(text) => setEmail(text)}
          value={Email}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
        <Button title="Sign In!" onPress={handleSignIn} style={{color: 'white', textDecorationLine: 'underline'}}/>
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
    color: 'white',
  },
  contentContainer: {
    backgroundColor: 'rgba(60, 38, 80, 0.9)',
    borderRadius: 20,
    padding: 16,
    width: '77%',
  },
  title: {
    fontSize: 40,
    marginTop: '450%',
    marginBottom: '5%',
    color: 'rgba(60, 38, 80, 1))',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: 'black',
    borderRadius: 50,
    marginTop: '10%',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    marginLeft: '5.5%',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  passwordContainer: {
    color: 'black',
    marginLeft: '5%',
    width: '95%',
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
    color: 'white',
  },
  iconContainer: {
    padding: 8,
  },
});