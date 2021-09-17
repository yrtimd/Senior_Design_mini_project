import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import BarcodeScreen from '../screens/BarcodeScreen'

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator headerShown='false'>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Scan' component={BarcodeScreen} />
    </Stack.Navigator>
  );
}