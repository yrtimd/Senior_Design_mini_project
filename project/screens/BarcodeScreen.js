import axios from 'axios';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const firstURL = 'https://api.nal.usda.gov/fdc/v1/foods/search?pageSize=2&api_key=IdOC1aXnE1eBrwNf7OzdqKdA4Flk5ib03AmyuGDo&format=abridged';
const secondURL = 'https://api.nal.usda.gov/fdc/v1/food/';
const secondURL_v2 = '?pageSize=1&api_key=IdOC1aXnE1eBrwNf7OzdqKdA4Flk5ib03AmyuGDo';


//let scannedFoods = [];
let tempFoodScan = [];

export default function BarcodeScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const fdcId = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);



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



  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    let temp = "";
    if (data.length == 13) //fixing an issue with the barcode scanner adding a zero to the beginning of UPC-A codes
    {
      temp = data.substring(1,13);
      await callAPI(temp, 0);
      await callAPI(this.fdcId, 1);
    }
    else
    {
      await callAPI(data, 0);
      await callAPI(this.fdcId, 1);
    }
    alert(`Bar code with type ${type} and data ${data} has been scanned and added to your scanned foods.`);

    //console.log(tempFoodScan);
    navigation.navigate('Home', tempFoodScan)

    //console.log(navigation);
  };



  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

//{scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Text> Please Wait </Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
      backgroundColor: '#7a42f4',
      padding: 10,
      margin: 15,
      height: 40,
   },
  input: {
      margin: 15,
      height: 40,
      borderColor: '#7a42f4',
      borderWidth: 1
  },
  listDisplay: {
      margin: 300,
      height: 40,
      borderWidth: 10
  },
});