import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';

import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import NotificationsScreen from './SearchScreen';
import MessagesScreen from './MessagesScreen';
import FeedScreen from './FeedScreen';

const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Widget"

      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.92)',
          height: 87,
        },
        swipeEnabled: true,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          let iconSize = size + 5;
          let iconStyle = { marginLeft: 6.5, fontSize:18, top: 40};

          if (route.name === 'Profil') {
            iconName = 'person-outline';
          } else if (route.name === 'Messages') {
            iconName = 'mail-outline';
          } else if (route.name === 'Widget') {
            iconName = 'medkit-outline';
          } else if (route.name === 'Search') {
            iconName = 'search-outline';
          } else if (route.name === 'Paramètres') {
            iconName = 'people-circle-outline';
          }

          return <Ionicons name={iconName} color={color} size={size} style={iconStyle}/>;
        },
      })}
      >
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ tabBarLabel: '' }}/>
      <Tab.Screen name="Messages" component={MessagesScreen} options={{ tabBarLabel: '' }}/>
      <Tab.Screen name="Widget" component={FeedScreen} options={{ tabBarLabel: '' }}/>
      <Tab.Screen name="Search" component={NotificationsScreen} options={{ tabBarLabel: '' }}/>
      <Tab.Screen name="Paramètres" component={SettingsScreen} options={{ tabBarLabel: '' }}/>
      </Tab.Navigator>
  );
};

export default TabNavigator;
