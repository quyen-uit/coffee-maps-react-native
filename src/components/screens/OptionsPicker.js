import React, {Component} from 'react';

import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  BackHandler,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {coffee_color} from '../../color';
import {StackActions, NavigationActions} from 'react-navigation';
const {width, height} = Dimensions.get('window');

const DATA = [
  {
    id: 'pet',
    name: 'Thú cưng',
  },
  {
    id: 'baby',
    name: 'Giữ trẻ',
  },
  {
    id: 'gamezone',
    name: 'Khu vui chơi',
  },
  {
    id: 'parking',
    name: 'Bãi đỗ Ôtô',
  },
  {
    id: 'aircondition',
    name: 'Điều hòa',
  },
  {
    id: 'wifi',
    name: 'Wifi',
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

function App({nav}) {
  const [selected, setSelected] = React.useState(new Map());

  const onSelect = React.useCallback(
    id => {
      const newSelected = new Map(selected);
      newSelected.set(id, !selected.get(id));

      setSelected(newSelected);
    },
    [selected],
  );
  var optionSelect = [];
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

    <View style={{flex: 1, alignItems: 'flex-end', margin: 8}}>
      <View style={{flexDirection: 'row'}}>
        <Text
          style={{
            color: coffee_color,
            fontWeight: 'bold',
            fontSize: 28,
            marginRight: width / 4,
          }}>
          Tiện ích
        </Text>
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={() => {
           
            DATA.map(item => {
              if (selected.get(item.id)) {
                var temp;
                switch (item.id) {
                  case 'pet':
                    temp = {value: ['yes'], key: 'pet'};
                    break;
                  case 'parking':
                    temp = {value: ['yes'], key: 'parking'};
                    break;
                  case 'aircondition':
                    temp = {value: ['yes'], key: 'aircondition'};
                    break;
                  case 'wifi':
                    temp = {value: ['yes'], key: 'wifi'};
                    break;
                  case 'gamezone':
                    temp = {value: ['yes'], key: 'gamezone'};
                    break;
                  case 'baby':
                    temp = {value: ['yes'], key: 'baby'};
                    break;
                }
                optionSelect.push(temp);
              }
            });
            var length = optionSelect.length;

            var mapped = optionSelect.map(item => ({[item.key]: item.value}));
            var newObj = Object.assign({}, ...mapped);

            const {routeName, key} = nav.getParam('returnToRoute');

            const backAction = NavigationActions.navigate({
              routeName: routeName,
              key: key,
              params: {
                isOption: true,
                options: newObj,
                lengthOption: length,
              },
            });

            nav.dispatch(backAction);
          }}>
          <Text style={{fontSize: 20,marginTop: -4}}>Chọn</Text>
        </TouchableOpacity>
      </View>
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
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    const {navigation} = this.props;
    const {routeName, key} = navigation.getParam('returnToRoute');

    const backAction = NavigationActions.navigate({
      routeName: routeName,
      key: key,
      params: {
        isOption: false,
        options: null,
        lengthOption: 0,
      },
    });

    this.props.navigation.dispatch(backAction);
    return true;
  };
  render() {
    return <App nav={this.props.navigation} />;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 40,
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 16,
    width: width / 2.5,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 40,
  },
  name: {
    fontSize: 16,
    color: '#fff',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
});
