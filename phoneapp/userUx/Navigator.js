import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MessagesScreen from './MessagesScreen';
import TalkingScreen from './TalkingScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Messages">
        <Stack.Screen
          name="Messages"
          component={MessagesScreen}
          options={{ title: 'Liste des Conversations' }}
        />
        <Stack.Screen
          name="Talking"
          component={TalkingScreen}
          options={({ route }) => ({ title: route.params.userName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;