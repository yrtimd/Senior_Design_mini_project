import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import axios from 'axios';
import { StyleSheet, TextInput,TouchableOpacity, Text, View } from 'react-native';

const baseURL = 'https://api.nal.usda.gov/fdc/v1/foods/search?pageSize=2&api_key=IdOC1aXnE1eBrwNf7OzdqKdA4Flk5ib03AmyuGDo';


const Search = () => {
    return <div>Hello world!</div>
}


class App extends Component {
  state = {
    count: 0,
    api_data: 'a',
    APIQuery: '',
    email: '',
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

  login = (email) => {
        //alert('email: ' + email + ' password: ' + pass)
    axios
      .get(baseURL, {
        params: {
          query: email
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
} //More functional API QUERRY

  handleEmail = (text) => {
      this.setState({ email: text })
   }

  render() {
    return (
      <View style={styles.container}>
        <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Email"
               placeholderTextColor = "#9a73ef"
               autoCapitalize = "none"
               onChangeText = {this.handleEmail}/>
        <TouchableOpacity
               style = {styles.submitButton}
               onPress = {
                  () => this.login(this.state.email)
               }>
               <Text style = {styles.submitButtonText}> Submit </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.onPushAPI}>
          <Text>Click me</Text>
        </TouchableOpacity>
        <View>
          <Text>You clicked { this.state.api_data.totalPages }  times</Text>
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
  button: {
    alignItems: 'center',
    backgroundColor: '#DDEDDD',
    padding: 10,
    marginBottom: 10,
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
