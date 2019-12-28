/* eslint-disable react-native/no-inline-styles */
import {FlatList, Text, Dimensions, View, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {coffee_color} from '../../color';

const {width, height} = Dimensions.get('window');

const list = [
  {
    id: 'l1',
    title: 'Cửa hàng yêu thích',
    icon: 'gratipay',
    colorBtn: '#fd79a8',
    number: 10,
  },
  {
    id: 'l2',
    title: 'Cửa hàng đã xem',
    number: 10,
    icon: 'eye',
    colorBtn: '#0abde3',
  },
  {
    id: 'l3',
    number: 10,
    title: 'Cửa hàng không thích',
    icon: 'heart-broken',
    colorBtn: '#8395a7',
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
          <Icon name={item.icon} size={50}  marginVertical={10} color="#000"/>
        }
        title={item.title}
        buttonStyle={{
          backgroundColor: item.colorBtn,
          justifyContent: 'flex-start',
          height: height / 5,
        }}
        containerStyle={{marginVertical: 4}}
        titleStyle={{color: '#fff', fontSize: 30, marginLeft: 20}}
      />
    );
  };
  renderNumber = item => {
    return (
      <View>
        <Icon name={item.icon} size={50} color={item.colorBtn} marginVertical={10} />
        <Text style={{fontSize: 30, alignSelf: 'center'}}>{item.number}</Text>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16}}>
          {list.map(item => this.renderNumber(item))}
        </View>
        <View>
          <FlatList
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
    backgroundColor: '#f0f0f0',
    display: 'flex',
    flex: 0,
  },
});
