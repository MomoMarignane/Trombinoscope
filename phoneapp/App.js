import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './home/HomeScreen';
import SignInScreen from './routes/SignInScreen';
import UserUx from './userUx/UserUx';
import LoadingPage from './routes/Screenapp';
import TalkingScreen from './userUx/TalkingScreen';
import MessagesScreen from './userUx/MessagesScreen';

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
          component={TalkingScreen}
          options={{
              headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
