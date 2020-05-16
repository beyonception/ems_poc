import React from 'react';
//import react in our code. 

import { Text, View, StyleSheet } from 'react-native';
//import all the components we are going to use.

import { Card } from 'react-native-elements';
//import Card

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Card title="Local Modules">
        {/*react-native-elements Card*/}
          <Text style={styles.paragraph}>
            This is a card from the react-native-elements
          </Text>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
