import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import axios from 'axios';
import { FlatList, StyleSheet, TextInput,TouchableOpacity, Text, View } from 'react-native';

const baseURL = 'https://api.nal.usda.gov/fdc/v1/foods/search?pageSize=2&api_key=IdOC1aXnE1eBrwNf7OzdqKdA4Flk5ib03AmyuGDo';


const Search = () => {
    return <div>Hello world!</div>
}


class App extends Component {
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
      <View style={styles.container}>
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
        <View>
          <Text>There are { this.state.api_data.totalPages }  total pages</Text>
        </View>
        <View>
          <FlatList
            data={this.state.api_data.foods}
            keyExtractor={ item => ((item))}
            renderItem={({ item }) => (
              <Text>{item.foodNutrients[3].nutrientNumber + 'KCal . '}</Text>
            )}
          />
        </View>
      </View>
    );
  }
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
});

export default App;
