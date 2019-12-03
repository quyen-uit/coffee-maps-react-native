import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
export default class Header extends React.Component {
  render() {
    return (
      <View style={styles.header}>
        <Text style={styles.text}>{this.props.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ff732c',
    height: 50,
    flex: 0,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    flex: 0,
    margin: 10,
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
