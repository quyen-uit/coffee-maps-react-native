import React, { Component } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {coffee_color} from '../../color';

const {width, height} = Dimensions.get('window');

const DATA = [
  {
    id: 'i1',
    name: 'Thú cưng',
  },
  {
    id: 'i2',
    name: 'Giữ trẻ',
  },
  {
    id: 'i3',
    name: 'Khu vui chơi',
  },
  {
    id: 'i4',
    name: 'Bãi đỗ Ôtô',
  },
  {
    id: 'i5',
    name: 'Điều hòa',
  },
  {
    id: 'i6',
    name: 'Wifi',
  },
  {
    id: 'i7',
    name: 'Ổ điện nhiều',
  },
];
function Item({id, name, selected, onSelect}) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(id)}
      style={[
        styles.item,
        {backgroundColor: selected ? coffee_color : '#ccc'},
      ]}>
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
}

function App() {
  const [selected, setSelected] = React.useState(new Map());

  const onSelect = React.useCallback(
    id => {
      const newSelected = new Map(selected);
      newSelected.set(id, !selected.get(id));

      setSelected(newSelected);
    },
    [selected],
  );

  return (
    // <SafeAreaView style={styles.container}>
    //   <FlatList
    //     data={DATA}
    //     renderItem={({item}) => (
    //       <Item
    //         id={item.id}
    //         name={item.name}
    //         selected={!!selected.get(item.id)}
    //         onSelect={onSelect}
    //       />
    //     )}
    //     keyExtractor={item => item.id}
    //     extraData={selected}
    //   />
    // </SafeAreaView>
    <View style={{flex: 1, alignItems: 'center', margin: 8}}>
      <Text style={{color: coffee_color, fontWeight: 'bold', fontSize: 28}}>
        Tiện ích
      </Text>
      <View style={styles.container}>
        {DATA.map(item => {
          return (
            <Item
              id={item.id}
              name={item.name}
              selected={!!selected.get(item.id)}
              onSelect={onSelect}
            />
          );
        })}
      </View>
    </View>
  );
}
export default class OptionsPicker extends Component {
  static navigationOptions = {
    headerTransparent: true,
  };
  render() {
    return <App />;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 16,
    width: width / 3,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 40,
  },
  name: {
    fontSize: 18,
    color: '#fff',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
});
