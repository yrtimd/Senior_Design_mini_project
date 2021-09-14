import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import { FlatList, StyleSheet, TextInput,TouchableOpacity, Text, View, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const baseURL = 'https://api.nal.usda.gov/fdc/v1/foods/search?pageSize=2&api_key=IdOC1aXnE1eBrwNf7OzdqKdA4Flk5ib03AmyuGDo';


const Search = () => {
    return <div>Hello world!</div>
}

function BarcodeScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
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

class HomeScreen extends Component {
  state = {
    count: 0,
    api_data: 'a',
    APIQuery: '',
    food_name: '',
  };

  onPress = () => {
    this.setState({
      count: this.state.count + 1,
    });
  };

onPushAPI = () => {
  //componentDidMount() {
    // Simple GET request using axios
    axios
      .get(baseURL, {
        params: {
          query: 'apple'
        }
      })
      .then((response) => {
        this.setState({
          api_data: response.data,
        }),
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  //}
  } //End of test API

  callApi = (food_name) => {
    axios
      .get(baseURL, {
        params: {
          query: food_name
        }
      })
      .then((response) => {
        this.setState({
          api_data: response.data,
        });
      })
  } //More functional API QUERRY

  handleFoodName = (text) => {
      this.setState({ food_name: text })
  }
  render() {
    return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Scan a Barcode"
          onPress={() => this.navigation.navigate('BarScan')}
        />
        <TextInput style = {styles.input}
                underlineColorAndroid = "transparent"
                placeholder = "Food Name"
                placeholderTextColor = "#9a73ef"
                autoCapitalize = "none"
                onChangeText = {this.handleFoodName}/>
          <TouchableOpacity
                style = {styles.submitButton}
                onPress = {
                    () => this.callApi(this.state.food_name)
                }>
                <Text style = {styles.submitButtonText}> Submit </Text>
          </TouchableOpacity>
          <Text
          style = {styles.container}
          >There are { this.state.api_data.totalPages }  total pages</Text>
          <FlatList
            data={this.state.api_data.foods}
            style={styles.listDisplay}
            keyExtractor={ item => ((item))}
            renderItem={({ item }) => (
              <Text>{item.foodNutrients[3].nutrientNumber + 'KCal . '}</Text>
            )}
        />
    </View>
    );
  }
}

const Stack = createNativeStackNavigator();

function App() {
  

  

  // render() {
  //   return (
  //     <View style={styles.container}>
  //       <TextInput style = {styles.input}
  //              underlineColorAndroid = "transparent"
  //              placeholder = "Food Name"
  //              placeholderTextColor = "#9a73ef"
  //              autoCapitalize = "none"
  //              onChangeText = {this.handleFoodName}/>
  //       <TouchableOpacity
  //              style = {styles.submitButton}
  //              onPress = {
  //                 () => this.callApi(this.state.food_name)
  //              }>
  //              <Text style = {styles.submitButtonText}> Submit </Text>
  //       </TouchableOpacity>
  //       <Text
  //       style = {styles.container}
  //       >There are { this.state.api_data.totalPages }  total pages</Text>
  //       <FlatList
  //         data={this.state.api_data.foods}
  //         keyExtractor={ item => ((item))}
  //         renderItem={({ item }) => (
  //           <Text>{item.foodNutrients[3].nutrientNumber + 'KCal . '}</Text>
  //         )}
  //       />
  //     </View>
  //   );
  // }
  // render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="BarScan" component={BarcodeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
//   }
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

export default App;