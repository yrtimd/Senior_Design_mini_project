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
let maxCalories = 0;

function writeUserData(userID, scannedFoods) {
  database.ref('users/' + userID).set({
      list: scannedFoods
  });
}

function addRecipe(SingleItem) {
  //const dataType = typeof(SingleItem);
  var noDuplicate = true;
  
  if (typeof scannedFoods !== 'undefined' && typeof SingleItem !== 'undefined') {
    if (typeof SingleItem.description !== 'undefined')
    {
      scannedFoods.map(function(item, index)  { 
        console.log(item.quantity)
        console.log(SingleItem.quantity)
        if (item.description === SingleItem.description) {
          item.quantity += SingleItem.quantity
          
          noDuplicate = false
        }
      })

      console.log(noDuplicate)
      console.log(noDuplicate)
      if (noDuplicate === true) {
        console.log('OOOpps')
        scannedFoods.push(SingleItem)
      }
    }
    writeUserData(userID, scannedFoods);
    return (null);
  }
}

function countCalories() {

  maxCalories = 0
  if(typeof scannedFoods !== 'undefined' && typeof scannedFoods[0] !== 'undefined'){
    scannedFoods.map((item, index) => 
      maxCalories += item.labels.calories.value * item.quantity
    )
    maxCalories = Math.round(maxCalories * 100) / 100
  }

  return(maxCalories)
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
  addRecipe(FoodItem);
  //countCalories();
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
          <Text>Total Calories {countCalories()} </Text>
        </View>
        <View style={styles.tableHeaders} >
          <Text style={{width: '33%'}}> Description </Text>
          <Text style={{width: '33%'}}> Calories (Cal) </Text>
          <Text style={{width: '33%'}}> Quantity </Text>
        </View>
          {scannedFoods.map((item, index) =>
          <View style={styles.mapRows} key={index.toString()}>
          <Text numberOfLines={1} style={{ width: 250 }}>{item.description} </Text>
          <Text>{item.labels.calories.value} </Text>
          <Text>{item.quantity} </Text>
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
  },
  tableHeaders: {
    flexDirection: 'row',
    //flex: 1,
    justifyContent: 'center',
    alignItems : 'stretch',
    //paddingHorizontal: 70
    alignContent : 'stretch'
  }
});