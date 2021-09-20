import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { StyleSheet, TextInput,Text, View, Keyboard, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';
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
let Foodname = [];

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



let tempFoodScan = [];
let fdcId = [];

const firstURL = 'https://api.nal.usda.gov/fdc/v1/foods/search?pageSize=2&api_key=IdOC1aXnE1eBrwNf7OzdqKdA4Flk5ib03AmyuGDo&format=abridged';
const secondURL = 'https://api.nal.usda.gov/fdc/v1/food/';
const secondURL_v2 = '?pageSize=1&api_key=IdOC1aXnE1eBrwNf7OzdqKdA4Flk5ib03AmyuGDo';


const callAPI = async (barcode_data, opt) => {
    var baseURL;
    if (opt == 1) {
      baseURL = secondURL.concat(barcode_data, secondURL_v2);
    } else {
      baseURL = firstURL;
    }

    await axios
      .get(baseURL, {
      params: {
        query: barcode_data
      }
    })
    .then((response) => {

      if (opt == 1) {
        tempFoodScan = {
          "description" : response.data.description,
          "labels" : response.data.labelNutrients,
          "ingredients" : response.data.ingredients
        }
        //scannedFoods.push(tempFoodScan)
      } else {
        tempFoodScan = response.data,
        fdcId = tempFoodScan.foods[0].fdcId
        //console.log(tempFoodScan)
      }   
    })
    .catch(err => console.error(err));
  } //More functional API QUERRY

const handleNameChange = (name) => {
  Foodname = name;
};

const HandleAPI = async () => {
      await callAPI(Foodname, 0);
      await callAPI(fdcId, 1);
      addRecipe(tempFoodScan);

};









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
        <TextInput
          style={styles.textInput}
          placeholder="Food Name"
          maxLength={20}
          onBlur={Keyboard.dismiss}
          //value = 
          onChangeText={handleNameChange}
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => HandleAPI()}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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