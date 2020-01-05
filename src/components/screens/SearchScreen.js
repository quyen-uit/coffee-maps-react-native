/* eslint-disable react-native/no-inline-styles */
//This is an example code to Add Search Bar Filter on Listview//
import React, {Component} from 'react';
import {StackActions, NavigationActions} from 'react-navigation';
//import react in our code.
import {firebaseApp} from '../FirebaseApp';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  Text,
  Button,
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Image,
  BackHandler,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {coffee_color} from '../../color';

//import all the components we are going to use.
const {width, height} = Dimensions.get('window');

export default class SearchScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    var item = [];
    var img;
    this.itemRef = firebaseApp.database();
    this.itemRef.ref('stores/tch/imgMarker').on('value', snapshot => {
      img = snapshot.val();
    });
    this.itemRef.ref('tchCor').on('child_added', snapshot => {
      item.push({
        name: snapshot.val().name,
        address: snapshot.val().address,
        branch: snapshot.val().branch,
        marker: img,
        district: snapshot.val().district,
        key: snapshot.key,
      });
    });
    this.itemRef.ref('stores/highland/imgMarker').on('value', snapshot => {
      img = snapshot.val();
    });
    this.itemRef.ref('highlandCor').on('child_added', snapshot => {
      item.push({
        name: snapshot.val().name,
        branch: snapshot.val().branch,
        marker: img,
        address: snapshot.val().address,
        district: snapshot.val().district,
        key: snapshot.key,
      });
    });

    //setting default state
    this.state = {
      isLoading: false,
      text: '',
      list: [],
      srcItem: item,
    };
  }

  goToMapScreen = item => {
    const {navigation} = this.props;
    const {routeName, key} = navigation.getParam('returnToRoute');
    
    const backAction = NavigationActions.navigate({
      routeName: routeName,
      key: key,
      params: {
        keySearch: item.key,
        isSelect: true,
        flagSearch2: false,
        showSearchLocation: true,
      },
    });

    this.props.navigation.dispatch(backAction);
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
        keySearch: null,
        flagSearch2: true,
        isSelect: false,
        showSearchLocation: false,
      },
    });

    this.props.navigation.dispatch(backAction);
    return true;
  };
  fetchDb = text => {
    var tmp = [];
    this.setState({list: []});
    var search = text.toLowerCase();
    this.state.srcItem.filter(function(item) {
      if (item.address.toLowerCase().includes(search)) {
        tmp.push(item);
      }
    });
    if (tmp.length == 0)
      this.state.srcItem.filter(function(item) {
        if (item.branch.toLowerCase().includes(search)) {
          tmp.push(item);
        }
      });
    this.setState({list: tmp});
  };
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      text: text,
    });
    this.fetchDb(text);
  }
  ListViewItemSeparator = () => {
    //Item sparator view
    return (
      <View
        style={{
          height: 0.3,
          width: '90%',
          backgroundColor: '#080808',
        }}
      />
    );
  };
  render() {
    if (this.state.isLoading) {
      //Loading View while data is loading
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      //ListView to show with textinput used as search bar
      <View style={styles.viewStyle}>
        <View>
          <TextInput
            style={styles.textInputStyle}
            onChangeText={text => this.SearchFilterFunction(text)}
            value={this.state.text}
            underlineColorAndroid="transparent"
            placeholder="Search Here"
          />
          <Icon
            name="search"
            size={20}
            style={{
              position: 'absolute',
              margin: 8,
              alignSelf: 'flex-end',
              paddingRight: 8,
            }}
          />
        </View>
        <FlatList
          windowSize={height}
          refreshing={true}
          data={this.state.list}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => this.goToMapScreen(item)}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1,
                  marginVertical: 8,
                }}>
                <Image
                  style={{width: 48, height: 39}}
                  source={{uri: item.marker}}
                />
                <View style={{width: width - 48, marginLeft: 8}}>
                  <Text style={{fontSize: 18}}>
                    {item.name + ' - ' + item.branch}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#ccc',
                      marginBottom: 8,
                      marginRight: 8,
                    }}>
                    {item.address}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          style={{marginTop: 10}}
          keyExtractor={item => item.key}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    flex: 1,
    marginTop: 10,
    padding: 16,
  },
  textStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: coffee_color,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
});
