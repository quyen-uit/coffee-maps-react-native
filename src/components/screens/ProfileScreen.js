import {Text, View, StyleSheet} from 'react-native';
import React from 'react';
export default class ProfileScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Profile</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2929',
    display: 'flex',
    flex: 0,
  },
});
