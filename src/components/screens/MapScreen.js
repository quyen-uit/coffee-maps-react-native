/* eslint-disable react-native/no-inline-styles */
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/FontAwesome5';
import React from 'react';
import {
  Text,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Picker,
  TextInput,
  PermissionsAndroid,
  Dimensions,
  Image,
} from 'react-native';
import {Card} from 'react-native-elements';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {firebaseApp} from '../FirebaseApp';
import {coffee_color} from '../../color';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

async function request_location_runtime_permission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'ReactNativeCode Location Permission',
        message: 'ReactNativeCode App needs access to your location ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //alert('Location Permission Granted.');
    } else {
      alert('Location Permission Not Granted');
    }
  } catch (err) {
    console.warn(err);
  }
}
export default class MapScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    var item = [];
    this.itemRef = firebaseApp.database();
    this.itemRef.ref('tchCor').on('child_added', snapshot => {
      item.push({
        name: snapshot.val().name,
        branch: snapshot.val().branch,
        image: snapshot.val().image,
        latitude: snapshot.val().lat,
        longitude: snapshot.val().long,
        marker: require('../../assets/tch.png'),
        district: snapshot.val().district,
      });
    });
    this.itemRef.ref('highlandCor').on('child_added', snapshot => {
      item.push({
        name: snapshot.val().name,
        branch: snapshot.val().branch,
        image: snapshot.val().image,
        latitude: snapshot.val().lat,
        longitude: snapshot.val().long,
        marker: require('../../assets/highland.png'),
        district: snapshot.val().district,
      });
    });
    this.state = {
      isSelect: false,
      allowShowMyLocation: false,
      nearby: item,
      districtPicker: 'Quận/Huyện',
      namePicker: 'Cửa hàng',
      initialRegion: {
        latitude: 10.81667,
        longitude: 106.63333,
        latitudeDelta: 1,
        longitudeDelta: 1,
      },
      markerPosition: {
        latitude: 10.78325605,
        longitude: 10.78325605,
      },
      markers: [],
    };
  }
  goToSearchScreen = () => {
    this.props.navigation.navigate('Search', {name: 'maps'});
  };
  goToOptionScreen = () => {
    this.props.navigation.navigate('Option');
  };
  renderMarker = () => {
    var lat = this.props.navigation.dangerouslyGetParent().getParam('lat');
    var long = this.props.navigation.dangerouslyGetParent().getParam('long');
    var isSelect = this.props.navigation
      .dangerouslyGetParent()
      .getParam('isSelect');
    if (isSelect) {
      return (
        <MapView.Marker
          coordinate={{
            latitude: lat,
            longitude: long,
          }}
        />
      );
    }
  };
  // filter marker with 2 picker
  renderListMarker = () => {
    if (
      this.state.namePicker == 'Tất cả' &&
      this.state.districtPicker == 'Tất cả'
    ) {
      return this.state.nearby.map(marker => (
        <MapView.Marker
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          description={marker.description}>
          <Image source={marker.marker} />
        </MapView.Marker>
      ));
    } else
      return this.state.nearby
        .filter(item => {
          if (this.state.namePicker == 'Tất cả') {
            return this.state.districtPicker == item.district;
          }
          if (this.state.districtPicker == 'Tất cả') {
            return this.state.namePicker == item.name;
          }
          return (
            item.district == this.state.districtPicker &&
            item.name == this.state.namePicker
          );
        })
        .map(marker => (
          <MapView.Marker
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}>
            <Image source={marker.marker} />
          </MapView.Marker>
        ));
  };
  renderDetailCard = item => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('DetailStore')}>
        <Card
          image={{uri: item.image}}
          containerStyle={styles.card}
          imageProps={{borderTopRightRadius: 10, borderTopLeftRadius: 10}}
          imageStyle={{
            height: 70,
          }}>
          <Text>{item.name}</Text>
          <Text style={{marginBottom: 10, color: '#9e9e9e'}}>
            {item.branch}
          </Text>
        </Card>
      </TouchableOpacity>
    );
  };
  renderNearby = () => {
    return (
      <FlatList
        horizontal={true}
        //  pagingEnabled={true}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        style={{height: 50, marginBottom: 10}}
        scrollEventThrottle={16}
        snapToAlignment="center"
        data={this.state.nearby}
        renderItem={({item}) => this.renderDetailCard(item)}
      />
    );
  };
  watchID: ?number = null;
  async componentDidMount() {
    await request_location_runtime_permission();
  }
  centerMarker = () => {
    this.mapView.animateToRegion(this.state.initialRegion);
    if (!this.state.allowShowMyLocation) {
      this.setState({
        allowShowMyLocation: !this.state.allowShowMyLocation,
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          onUserLocationChange={location => {
            var lat = location.nativeEvent.coordinate.latitude;
            var long = location.nativeEvent.coordinate.longitude;
            var lastRegion = {
              latitude: lat,
              longitude: long,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            };
            this.setState({
              initialRegion: lastRegion,
              markerPosition: lastRegion,
            });
            console.log(lat + '-' + long);
          }}
          region={this.state.initialRegion}
          showsUserLocation={this.state.allowShowMyLocation}
          followsUserLocation={this.state.allowShowMyLocation}
          loadingEnabled={true}
          ref={mapView => (this.mapView = mapView)}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}>
          <MapViewDirections
            origin={{latitude: 10.81686992, longitude: 106.64566543}}
            destination={{latitude: 10.81686992, longitude: 105.64566543}}
            apikey={'AIzaSyCCSoKB9u8RmegTTXFgOko39pNEaLZrnpI'}
          />
          <MapView.Marker coordinate={this.state.initialRegion} />
          {this.renderListMarker()}
        </MapView>
        <TouchableOpacity onPress={this.goToSearchScreen}>
          <View>
            <TextInput
              style={styles.textInputStyle}
              editable={false}
              value={this.state.text}
              underlineColorAndroid="transparent"
              placeholder="Search Here"
            />
            <Icon
              name="search"
              size={20}
              style={{
                position: 'absolute',
                margin: 24,
                alignSelf: 'flex-end',
                paddingRight: 24,
              }}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            marginTop: -8,
            justifyContent: 'center',
          }}>
          <View style={styles.pickerDistrict}>
            <Picker
              mode="dialog"
              selectedValue={this.state.districtPicker}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({districtPicker: itemValue})
              }
              style={{
                height: 30,
                marginLeft: 32,
                width: width / 3 + 16,
                alignSelf: 'center',
              }}>
              <Picker.Item label="Quận/Huyện" value="null" />
              <Picker.Item label="Tất cả quận/huyện" value="Tất cả" />
              <Picker.Item label="Thủ đức" value="Thủ Đức" />
              <Picker.Item label="Quận 1" value="Quận 1" />
              <Picker.Item label="Quận 2" value="Quận 2" />
              <Picker.Item label="Quận 3" value="Quận 3" />
            </Picker>
          </View>
          <View style={styles.pickerStore}>
            <Picker
              selectedValue={this.state.namePicker}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({namePicker: itemValue})
              }
              style={{
                height: 30,
                marginLeft: 32,
                width: width / 3,
              }}>
              <Picker.Item label="Cửa hàng" value="null" />
              <Picker.Item label="Tất cả cửa hàng" value="Tất cả" />
              <Picker.Item label="The Coffee House" value="The Coffee House" />
              <Picker.Item label="Highlands Coffee" value="Highlands Coffee" />
            </Picker>
          </View>
          <TouchableOpacity onPress={this.goToOptionScreen}>
            <View
              style={{
                backgroundColor: '#fff',
                marginLeft: 8,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#bdc3c7',
              }}>
              <MaterialIcons name="filter-list" size={16} style={{margin: 6}} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.middleView} />
        <View style={styles.bottomView}>
          <TouchableOpacity
            style={styles.myLocationButton}
            onPress={this.centerMarker}

            //onPress={() => this.props.navigation.navigate('DetailStore')}
          >
            <MaterialIcons name="gps-fixed" size={32} />
          </TouchableOpacity>
        </View>
        {this.renderNearby()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  middleView: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  // leftView: {
  //   backgroundColor: 'green',
  //   width: 100,
  // },
  // rightView: {
  //   backgroundColor: 'green',
  //   width: 50,
  // },
  bottomView: {
    //backgroundColor: 'green',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 2,
  },
  button: {
    padding: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  myLocationButton: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 10,
    elevation: 3,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    borderRadius: 50,
  },
  card: {
    width: width / 3,
    borderRadius: 10,
    margin: 4,
  },
  markerImg: {
    width: 100,
    height: 40,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 16,
    borderColor: coffee_color,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    margin: 16,
  },
  pickerDistrict: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    overflow: 'hidden',
    backgroundColor: '#fff',
    height: 30,
    width: width / 3 + 24,
  },
  pickerStore: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    overflow: 'hidden',
    backgroundColor: '#fff',
    height: 30,
    marginLeft: 8,
    width: width / 3 + 24,
  },
});
