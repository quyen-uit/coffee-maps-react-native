import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import * as firebase from 'firebase';
export default class Loading extends React.Component {
  async componentDidMount() {
    await firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'App' : 'Auth');
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Chờ tí ...</Text>
        <ActivityIndicator size="large" />
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
});
