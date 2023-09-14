import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './home/HomeScreen';
import SignInScreen from './routes/SignInScreen';
import UserUx from './userUx/UserUx';
import LoadingPage from './routes/Screenapp';
import TalkingScreen from './userUx/TalkingScreen';
import firebaseApp from './config/firebaseConfig';
import MessagesScreen from './userUx/MessagesScreen';
import DatabaseScreen from './userUx/TalkingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="TROMBINI"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
          />
        <Stack.Screen
          name="SignInScreen"
          component={SignInScreen}
          options={{
            headerShown: false,
          }}
          />
        <Stack.Screen
          name="userux"
          component={UserUx}
          options={{
              headerShown: false,
          }}
          initialParams={{ firebaseApp }}
        />
        <Stack.Screen
          name="loadingpage"
          component={LoadingPage}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="TalkingScreen"
          component={DatabaseScreen}
          options={{
              headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
