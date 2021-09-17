import axios from 'axios';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

let scannedFood;

function foodItem(brand, desc, prot, fat, carbs, cal, sugar, fiber) { //object prototype for each food item scanned
  this.brand = brand;
  this.desc = desc;
  this.prot = prot;
  this.fat = fat;
  this.carbs = carbs;
  this.cal = cal;
  this.sugar = sugar;
  this.fiber = fiber;
}
window.foods = []; //array to store foodItems

const baseURL = 'https://api.nal.usda.gov/fdc/v1/foods/search?pageSize=2&api_key=IdOC1aXnE1eBrwNf7OzdqKdA4Flk5ib03AmyuGDo';

export default function BarcodeScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const callAPI = async (barcode_data) => {
      await axios
        .get(baseURL, {
        params: {
          query: barcode_data
        }
      })
      .then((response) => {
        scannedFood = response; //parse the JSON api call into an object
      })
    } //More functional API QUERRY

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    let temp = "";
    if (data.length == 13) //fixing an issue with the barcode scanner adding a zero to the beginning of UPC-A codes
    {
      temp = data.substring(1,13);
      await callAPI(temp);
    }
    else
    {
      await callAPI(data);
    }
    // console.log(scannedFood);
    let prot, fat, carbs, cal, sugar, fiber;
    let protObj = scannedFood.data.foods[0].foodNutrients.find(element => element.nutrientName === 'Protein');
    if (typeof protObj === 'undefined')
      prot = null;
    else
      prot = protObj.value;
    let fatObj = scannedFood.data.foods[0].foodNutrients.find(element => element.nutrientName === 'Total lipid (fat)');
    if (typeof fatObj === 'undefined')
      fat = null;
    else
      fat = fatObj.value;
    let carbsObj = scannedFood.data.foods[0].foodNutrients.find(element => element.nutrientName === 'Carbohydrate, by difference');
    if (typeof carbsObj === 'undefined')
      carbs = null;
    else
      carbs = carbsObj.value;
    let calObj = scannedFood.data.foods[0].foodNutrients.find(element => element.nutrientName === 'Energy');
    if (typeof calObj === 'undefined')
      cal = null;
    else
      cal = calObj.value;
    let sugarObj = scannedFood.data.foods[0].foodNutrients.find(element => element.nutrientName === 'Sugars, total including NLEA');
    if (typeof sugarObj === 'undefined')
      sugar = null;
    else
      sugar = sugarObj.value;
    let fiberObj = scannedFood.data.foods[0].foodNutrients.find(element => element.nutrientName === 'Fiber, total dietary');
    if (typeof fiberObj === 'undefined')
      fiber = null;
    else
      fiber = fiberObj.value;
    let newFood = new foodItem(scannedFood.data.foods[0].brandName, scannedFood.data.foods[0].description, prot, fat, carbs, cal, sugar, fiber);
    foods.push(newFood);
    alert(`Bar code with type ${type} and data ${data} has been scanned and added to your scanned foods.`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
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