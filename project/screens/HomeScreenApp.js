import { StatusBar } from 'expo-status-bar';
import React, { Component, useContext } from 'react';
import { StyleSheet, TextInput,Text, View, Keyboard, Button, TouchableOpacity } from 'react-native';
//import {Dropdown} from 'react-native-dropdown';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import { IconButton } from '../components';
import Firebase from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';


const auth = Firebase.auth();
var FoodItem = [];
let scannedFoods = [];
let maxCalories = [];

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

/*function countCalories() {

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
}*/


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                      Main function                                                 //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class HomeScreenApp extends Component {
    constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  static userContext = AuthenticatedUserContext

  //const user = useContext(AuthenticatedUserContext);
  

  handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  clearList() {
    scannedFoods = [];
    return(navigation.navigate('Home'))
  }

  removeLast() {
    scannedFoods.pop();
    return(navigation.navigate('Home'))
  }

  /*handleNameChange(name) {
  this.setState({ name });
  }*/

  getRouterParams(){
   const route = useRoute();
   const params= route.params;
   console.log(params);
   return params;
  }


  
  render () {
    const { navigation } = this.props;
    this.getRouterParams;
    //const { route } = useRoute();//this.props
    let user = this.context;
    FoodItem = this.getRouterParams;//route.params;
    return (

      <View style={styles.container}>
        <StatusBar style='dark-content' />
        <View style={styles.row}>
          <Text style={styles.title}>Welcome {user.email}!</Text>
          <IconButton
            name='logout'
            size={24}
            // color='#fff'
            onPress={this.handleSignOut}
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
            //onChangeText={}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => callAPI()}
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
          <Button
            title="Go to Test"
            onPress={() => navigation.navigate('Test')}
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
  textInput: {
    borderColor: 'grey',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 30,
    fontSize: 20,
  },
  saveButton: {
    borderWidth: 1,
    borderColor: '#007BFF',
    backgroundColor: '#007BFF',
    padding: 15,
    margin: 5
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center'
  }
});

export default function(props)
{
  const { navigation } = useNavigation();
  const { route } = useRoute();

  return <HomeScreenApp {...props} navigation={navigation} route = {route}/>;
}