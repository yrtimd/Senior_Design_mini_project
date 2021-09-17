import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
//import {Dropdown} from 'react-native-dropdown';

import { IconButton } from '../components';
import Firebase from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';


const auth = Firebase.auth();
var FoodItem = [];
let scannedFoods = [];
let maxCalories = [];

let tempFoodScan = [];

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
          this.fdcId = tempFoodScan.foods[0].fdcId
          //console.log(tempFoodScan)
        }   
      })
      .catch(err => console.error(err));
    } //More functional API QUERRY


function existCheck(SingleItem) {
  const dataType = typeof(SingleItem);
  
  if (typeof scannedFoods !== 'undefined' && typeof SingleItem !== 'undefined') {
    if (typeof SingleItem.description !== 'undefined')
    {
      scannedFoods.push(SingleItem)
    }

    return (
      scannedFoods.map((item, index) =>
        <View style={styles.mapRows} key={index.toString()}>
        <Text>{item.description} </Text>
        <Text>{item.labels.calories.value} </Text>
        </View>
      )
    )
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
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  function clearList() {
  scannedFoods = [];

  return(navigation.navigate('Home'))
}

  function removeLast() {
    scannedFoods.pop();

  return(navigation.navigate('Home'))
  }


  FoodItem = route.params;
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
          <Text>--------- Calories (Cal) {console.log(scannedFoods)}</Text>
        </View>
        {existCheck(FoodItem)} 
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

/*if (typeof FoodItem !== 'undefined'){
        FoodItem.map((item, value) => (
          <View key={value}>
            <Text> item.value </Text>
          </View>
        ))
      }*/