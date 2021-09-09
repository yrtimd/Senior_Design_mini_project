import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import axios from "axios";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native'


class GetRequest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            totalReactPackages: null
        };
    }

    componentDidMount() {
        // Simple GET request using axios
        axios.get('https://api.npms.io/v2/search?q=react')
            .then(response => this.setState({ totalReactPackages: response.data.total }));
    }

    render() {
        const { totalReactPackages } = this.state;
        return (
            <div className="card text-center m-3">
                <h5 className="card-header">Simple GET Request</h5>
                <div className="card-body">
                    Total react packages: {totalReactPackages}
                </div>
            </div>
        );
    }
}

export { GetRequest }; 

class App extends Component {
  state = {
    count: 0,
    api_data: 'a'
  }

  onPress = () => {
    this.setState({
      count: this.state.count + 1
    })
  }

  componentDidMount() {
        // Simple GET request using axios
        axios.get('https://api.npms.io/v2/search?q=react')
            .then(response => {api_data;//console.log(response.data);
      })
        .catch(error => {
         console.log(error);
    });
    }



 render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
         style={styles.button}
         onPress={this.onPress}
        >
         <Text>Click me</Text>
        </TouchableOpacity>
        <View>
          <Text>
            You clicked { this.api_data } times
          </Text>
        </View>
      </View>
    )
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
    marginBottom: 10
  }
})

export default App;
