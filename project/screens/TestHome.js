import axios from 'axios';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


//import React, { Component } from 'react'
/*import {
  //StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native'*/


class TestHome extends Component {
  state = {
    count: 0
  }

  onPress = () => {
    this.setState({
      count: this.state.count + 1
    })
  }

 render() {
 	const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
         style={styles.button}
         onPress={this.onPress}
        >
         <Text>Click me</Text>
        </TouchableOpacity>
        <View>
          <Text>
            You clicked { this.state.count }  times
          </Text>
        </View>
        <Button
          title="Go to Test"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10
  }
})

export default function(props) {
  const navigation = useNavigation();

  return <TestHome {...props} navigation={navigation} />;
}