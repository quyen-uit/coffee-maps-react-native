/* eslint-disable react-native/no-inline-styles */
import {FlatList, Text, View, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {coffee_color} from '../../color';
const list = [
  {
    id: 'l1',
    title: 'Cửa hàng yêu thích',
    icon: 'gratipay',
    colorBtn: '#ff1',
  },
  {
    id: 'l2',
    title: 'Cửa hàng đã xem',
    icon: 'eye',
    colorBtn: '#f12',
  },
  {
    id: 'l3',
    title: 'Cửa hàng không thích',
    icon: 'heart-broken',
    colorBtn: '#f92',
  },
];

export default class ListScreen extends React.Component {
  static navigationOptions = {
    title: 'Danh sách yêu thích',
    headerStyle: {
      backgroundColor: coffee_color,
    },
    headerTitleStyle: {
      fontWeight: 'bold',
      alignSelf: 'center',
      textAlign: 'center',
      justifyContent: 'center',
      flex: 1,
      fontSize: 24,
    },
    headerTintColor: '#fff',
  };
  renderOption = item => {
    return (
      <Button
        icon={
          <Icon name={item.icon} size={30} color="black" marginVertical={10} />
        }
        title={item.title}
        buttonStyle={{
          backgroundColor: item.colorBtn,
          justifyContent: 'flex-start',
          height: 150,
        }}
        containerStyle={{marginVertical: 4}}
        titleStyle={{color: '#000', fontSize: 30, marginLeft: 20}}
      />
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View>
          <FlatList
            style={{marginBottom: 60}}
            scrollEnabled={true}
            data={list}
            renderItem={({item}) => this.renderOption(item)}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ccc',
    display: 'flex',
    flex: 0,
  },
});
