import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
//import {Dropdown} from 'react-native-dropdown';

import { IconButton } from '../components';
import Firebase from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';


const auth = Firebase.auth();
var FoodItem = [];
let scannedFoods = [{
            "description" : 'description',
            "labels" : {"calories" : {"value" : 'calories'}},
            "ingredients" : 'ingredients'
          }];

function existCheck(SingleItem) {
  const dataType = typeof(SingleItem);
  
  console.log(scannedFoods)
  //console.log(typeof scannedFoods)

  if (typeof scannedFoods !== 'undefined' && typeof SingleItem !== 'undefined') {
    //return (JSON.stringify(FoodItem.description))
    scannedFoods.push(SingleItem)
    console.log('DdDDDDDDDDDdDDDDDDDD')
    return (


      scannedFoods.map((item, index) =>
        <View style={styles.rows} key={index.toString()}>
        <Text>{item.description} </Text>
        <Text>{item.labels.calories.value} </Text>
        </View>

      )
    )
  }
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
      </View>


              <Text>  {console.log('HIHIHIHIHIHIHIHIHIHIHIHI')}  </Text>
      <View style={ { flex: 1, justifyContent: 'flex-start'}}>
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
  rows: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems : 'center',
    flexWrap: 'wrap'
  }
});

/*if (typeof FoodItem !== 'undefined'){
        FoodItem.map((item, value) => (
          <View key={value}>
            <Text> item.value </Text>
          </View>
        ))
      }*/