import axios from 'axios';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

let scannedFoods = [];

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

  const callAPI = (barcode_data) => {
      axios
        .get(baseURL, {
        params: {
          query: barcode_data
        }
      })
      .then((response) => {
        scannedFoods.push(response);
      })
    } //More functional API QUERRY

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    let temp = "";
    if (data.length == 13) //fixing an issue with the barcode scanner adding a zero to the beginning of UPC-A codes
    {
      temp = data.substring(1,13);
      callAPI(temp);
    }
    else
    {
      callAPI(data);
    }
    alert(`Bar code with type ${type} and data ${data} has been scanned and added to your scanned foods.`);
    console.log(scannedFoods);
    console.log("\n\n\n\n\n\n\n\n\n\n");
    console.log(scannedFoods[0].data.foods);
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