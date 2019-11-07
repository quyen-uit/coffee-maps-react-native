import MapViewDirections from 'react-native-maps-directions';
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {
  latitude: 10.71346313,
  longitude: 106.69848341,
};
const GOOGLE_MAPS_APIKEY = 'AIzaSyCCSoKB9u8RmegTTXFgOko39pNEaLZrnpI';
const {width, height} = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
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
      alert('Location Permission Granted.');
    } else {
      alert('Location Permission Not Granted');
    }
  } catch (err) {
    console.warn(err);
  }
}
export default class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allowShowMyLocation: false,
      initialRegion: {
        latitude: 10.78325605,
        longitude: 10.78325605,
        latitudeDelta: 1,
        longitudeDelta: 1,
      },
      markerPosition: {
        latitude: 10.78325605,
        longitude: 10.78325605,
      },
      markers: [
        {
          title: 'm1',
          key: 'm1',
          description: 'mo ta',
          coordinate: {
            latitude: 10.71346313,
            longitude: 106.69848341,
          },
        },
        {
          key: 'm2',
          title: 'm2',
          description: 'mo ta',
          coordinate: {
            latitude: 10.75719947,
            longitude: 106.65896181,
          },
        },
      ],
    };
  }

  watchID: ?number = null;
  async componentDidMount() {
    await request_location_runtime_permission();
    // Geolocation.getCurrentPosition(
    //   position => {
    //     var lat = position.coords.latitude;
    //     var long = position.coords.longitude;
    //     var initialRegion = {
    //       latitude: lat,
    //       longitude: long,
    //       latitudeDelta: LATITUDE_DELTA,
    //       longitudeDelta: LONGITUDE_DELTA,
    //     };
    //     this.setState({
    //       initialRegion: initialRegion,
    //       markerPosition: initialRegion,
    //     });
    //   },
    //   error => this.setState({error: error.message}),
    //   {
    //     enableHighAccuracy: true,
    //     timeout: 20000,
    //     maximumAge: 1000,
    //     distanceFilter: 1,
    //   },
    // );
    // this.watchID = Geolocation.watchPosition(position => {
    //   // var lat = position.coords.latitude;
    //   // var long = position.coords.longitude;
    //   // var lastRegion = {
    //   //   latitude: lat,
    //   //   longitude: long,
    //   //   latitudeDelta: LATITUDE_DELTA,
    //   //   longitudeDelta: LONGITUDE_DELTA,
    //   // };
    //   // this.setState({
    //   //   initialRegion: lastRegion,
    //   //   markerPosition: lastRegion,
    //   // });
    // });
  }
  componentWillUnmount() {
    //Geolocation.clearWatch(this.watchID);
  }
  centerMarker = () => {
    this.mapView.animateToRegion(this.state.initialRegion, 1000);
    this.setState({
      allowShowMyLocation: true,
    });
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
          ref={mapView => (this.mapView = mapView)}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}>
          <MapView.Marker coordinate={this.state.initialRegion} />
          {this.state.markers.map(marker => (
            <MapView.Marker
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
            />
          ))}
          <MapViewDirections
            origin={this.state.markerPosition}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
          />
        </MapView>
        <View style={styles.topView} />
        <View style={styles.middleView} />
        <View style={styles.bottomView}>
          <TouchableOpacity onPress={this.centerMarker}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>CENTER MARKER</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const MARKER_COORDS = {
  latitude: 48.51,
  longitude: 2.2,
};

const MARKER_REGION = {
  ...MARKER_COORDS,
  latitudeDelta: 1,
  longitudeDelta: 1,
};

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
  topView: {
    backgroundColor: 'green',
    marginLeft: 20,
    marginRight: 20,
    height: 50,
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
    backgroundColor: 'green',
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  button: {
    padding: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});
