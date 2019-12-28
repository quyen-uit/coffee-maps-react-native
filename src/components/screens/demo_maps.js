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

import * as geolib from 'geolib';
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
const list = [
  {
    pet: true,
    parking: true,
  },
  {
    pet: false,
    parking: true,
  },
  {
    pet: false,
    parking: false,
  },
];
const arr = [
  {
    id: 1,
    car: 'toyota',
    color: 'blue',
    year: 2010,
    trans: 'auto',
    warrantyEnd: '2013',
    a: true,
    b: true,
    c: true,
  },
  {
    a: true,
    b: true,
    c: false,
    id: 2,
    car: 'toyota',
    condition: 'good',
    color: 'blue',
    year: 2010,
    trans: 'manual',
    warrantyEnd: '2013',
  },
  {
    a: false,
    b: true,
    c: true,
    id: 3,
    car: 'ford',
    color: 'yellow',
    year: 2012,
    trans: 'auto',
    warrantyEnd: '2015',
  },
];
export default class DemoMaps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAnimateToMaker: false,
      allowShowMyLocation: false,
      onDirection: false,
      src: {latitude: 10.86988603, longitude: 106.80297063},
      des: {latitude: 10.8716713, longitude: 106.7961551},
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
    };
  }
  watchID: ?number = null;
  async componentDidMount() {
    await request_location_runtime_permission();
  }
   getValue = value => (typeof value === 'string' ? value.toUpperCase() : value);
   filterPlainArray(array, filters) {
    const filterKeys = Object.keys(filters);
    return array.filter(item => {
      // validates all filter criteria
      return filterKeys.every(key => {
        // ignores an empty filter
        if (!filters[key].length) return true;
        return filters[key].find(filter => this.getValue(filter) === this.getValue(item[key]));
      });
    });
  }
   filterArray = (array, filters)=>  {
    const filterKeys = Object.keys(filters);
    return array.filter(item => {
      // validates all filter criteria
      return filterKeys.every(key => {
        // ignores non-function predicates
        if (typeof filters[key] !== 'function') return true;
        return filters[key](item[key]);
      });
    });
  }
 
  centerMarker = data => {
    // this.filterDemo();
    const filtersMatchType = {
      c: [false],
      b: [false],
    };
    console.log(this.filterPlainArray(arr, filtersMatchType));
    this.mapView.animateToRegion(data);
  };
  renderDirection = () => {
    return (
      <MapViewDirections
        origin={this.state.src}
        destination={this.state.des}
        apikey={'AIzaSyCCSoKB9u8RmegTTXFgOko39pNEaLZrnpI'}
        strokeColor="#f14"
        strokeWidth={3}
        //mode="WALKING"
        onReady={result => {
          console.log('Distance: ' + result.distance);
          console.log('Duration: ' + result.duration);
          this.mapView.fitToCoordinates(result.coordinates, {
            animated: true,
          });
        }}
      />
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <MapView
          loadingEnabled={true}
          ref={mapView => (this.mapView = mapView)}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          showsUserLocation={true}
          //  followsUserLocation={true}
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
          }}>
          <MapView.Circle center={this.state.src} radius={1000} />
          <MapView.Marker coordinate={this.state.src} >
          <Image source={require('../../assets/tch.png')}/>
          </MapView.Marker>
          {this.state.onDirection && this.renderDirection()}
        </MapView>
        <View style={styles.middleView} />
        <View style={styles.bottomView}>
          <TouchableOpacity
            style={styles.nearMeButton}
            onPress={() => this.setState({onDirection: true})}>
            <MaterialIcons name="directions" size={32} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.myLocationButton}
            onPress={() => {
              this.centerMarker(this.state.initialRegion);
              this.setState({onDirection: false});
            }}>
            <MaterialIcons name="gps-fixed" size={32} />
          </TouchableOpacity>
        </View>
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
  nearMeButton: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 80,
    right: 10,
    padding: 10,
    elevation: 3,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    borderRadius: 50,
  },
  markerImg: {
    width: 100,
    height: 40,
  },
});
