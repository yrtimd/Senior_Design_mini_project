import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import HomeScreenApp from '../screens/HomeScreenApp';
import BarcodeScreen from '../screens/BarcodeScreen'
import TestHome from '../screens/TestHome'

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator headerShown='false'>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='HomeApp' component={HomeScreenApp} />
      <Stack.Screen name='Test' component={TestHome} />
      <Stack.Screen name='Scan' component={BarcodeScreen} />
    </Stack.Navigator>
  );
}