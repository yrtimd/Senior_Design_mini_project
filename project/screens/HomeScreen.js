import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
//import {Dropdown} from 'react-native-dropdown';

import { IconButton } from '../components';
import Firebase from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

var userID;
const auth = Firebase.auth();
const database = Firebase.database();
var FoodItem = [];
let scannedFoods = [];
let maxCalories = [];

function writeUserData(userID, scannedFoods) {
  database.ref('users/' + userID).set({
      list: scannedFoods
  });
}

function existCheck(SingleItem) {
  const dataType = typeof(SingleItem);
  
  if (typeof scannedFoods !== 'undefined' && typeof SingleItem !== 'undefined') {
    if (typeof SingleItem.description !== 'undefined')
    {
      scannedFoods.push(SingleItem)
    }
    writeUserData(userID, scannedFoods);
    return (null);
  }
}

function countCalories() {

  maxCalories = 0
  if(typeof scannedFoods !== undefined && typeof scannedFoods.description !== 'undefined'){
    scannedFoods.map((item, index) => 
      maxCalories += tem.labels.calories.value
    )
  console.log(maxCalories)
  return(null)
  }
}

function saveRecipe(fileName) {
  //var fs = require('react-native-fs')
  //fs.writeFile("test.json", scannedFoods);
  //return (null)
}





export default function HomeScreen({ route, navigation }) {
  const { user } = useContext(AuthenticatedUserContext);
  userID = user.uid;
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  function clearList() {
  scannedFoods = [];
  writeUserData(userID, scannedFoods);
  return(navigation.navigate('Home'))
  }

  function removeLast() {
    scannedFoods.pop();
    writeUserData(userID, scannedFoods);
    return(navigation.navigate('Home'))
  }


  FoodItem = route.params;
  existCheck(FoodItem);
  return (

    <View style={styles.container}>
      <StatusBar style='dark-content' />
      <View style={styles.row}>
        <Text style={styles.title}>Welcome {user.email}!</Text>
        <IconButton
          name='logout'
          size={24}
          // color='#fff'
          onPress={handleSignOut}
        />
      </View>
     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <Text>Home Screen</Text>
        <Button
          title="Scan a Barcode"
          onPress={() => navigation.navigate('Scan')}
        />
        <Button
          title="Clear Current List"
          onPress={() => clearList()}
        />
        <Button
          title="Remove Last Food Item"
          onPress={() => removeLast()}
        />
        <View style={styles.row} >
          <Text>Description ------</Text>
          <Text>--------- Calories (Cal)</Text>
        </View>
        {scannedFoods.map((item, index) =>
        <View style={styles.mapRows} key={index.toString()}>
        <Text>{item.description} </Text>
        <Text>{item.labels.calories.value} </Text>
        </View>
        )} 
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  mapRows: {
    flexDirection: 'row',
    //flex: 1,
    justifyContent: 'space-around',
    alignItems : 'flex-start',
    backgroundColor: 'steelblue',
    alignContent : 'flex-start'
  }
});