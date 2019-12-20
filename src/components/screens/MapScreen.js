/* eslint-disable no-alert */
/* eslint-disable curly */
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
        key: snapshot.key,
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
        key: snapshot.key,
      });
    });
    this.state = {
      otherParam: null,
      isAnimateToMaker: false,
      isSelect: false,
      allowShowMyLocation: false,
      allowShowNearme: false,
      showNearMe: false,
      showSearchLocation: false,
      onDirection: false,
      //filter
      districtPicker: 'Quận/Huyện',
      namePicker: 'Cửa hàng',
      //
      sourceDirectionCoor: {
        latitude: 0,
        longitude: 0,
      },
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
      // coordinate-marker search
      // list coor-marker filter
      markers: [],
      // list coor-marker nearme or popular
      allMarker: item,
    };
  }

  removeNavigationListener() {
    if (this.navigationListener) {
      this.navigationListener.remove();
      this.navigationListener = null;
    }
  }
  componentWillUnmount() {
    this.removeNavigationListener();
  }
  goToSearchScreen = () => {
    const {navigation} = this.props;
    this.setState({
      isAnimateToMaker: false,
      isSelect: false,
      otherParam: null,
      showSearchLocation: false,
    });
    this.navigationListener = navigation.addListener('willFocus', payload => {
      this.removeNavigationListener();
      const {state} = payload;
      const {params} = state;
      if (params == null) return;
      //update state with the new params
      const {otherParam} = params;
      const {isSelect} = params;
      const {showSearchLocation} = params;
      this.setState({
        otherParam,
        isSelect,
        showSearchLocation,
      });
    });
    navigation.push('Search', {
      returnToRoute: navigation.state,
      otherParam: this.state.otherParam,
      isSelect: this.state.isSelect,
      showSearchLocation: this.state.showSearchLocation,
    });
  };
  goToOptionScreen = () => {
    this.props.navigation.navigate('Option');
  };
  renderMarker = () => {
    var pos = [];
    if (this.state.otherParam == null) return;
    if (this.state.isSelect === true) {
      this.itemRef
        .ref('tchCor/' + this.state.otherParam)
        .on('value', snapshot => {
          pos.latitude = snapshot.val().lat;
          pos.longitude = snapshot.val().long;
        });
      var regionA = {
        latitude: pos.latitude,
        longitude: pos.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      if (this.state.isAnimateToMaker === false) {
        this.setState({isAnimateToMaker: true});
        this.centerMarker(regionA);
      }
      return (
        <MapView.Marker
          coordinate={{
            latitude: pos.latitude,
            longitude: pos.longitude,
          }}
        />
      );
    }
  };
  // filter marker with 2 picker
  renderListMarker = () => {
    if (
      this.state.namePicker === 'Tất cả' &&
      this.state.districtPicker === 'Tất cả'
    ) {
      return this.state.allMarker.map(marker => (
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
      return this.state.allMarker
        .filter(item => {
          if (this.state.namePicker === 'Tất cả') {
            return this.state.districtPicker === item.district;
          }
          if (this.state.districtPicker === 'Tất cả') {
            return this.state.namePicker === item.name;
          }
          return (
            item.district === this.state.districtPicker &&
            item.name === this.state.namePicker
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

  renderListMarkerNearme = () => {
    var nearme = [];
    this.state.allMarker.map(item => {
      if (
        geolib.isPointWithinRadius(
          {latitude: item.latitude, longitude: item.longitude},
          {
            latitude: this.state.markerPosition.latitude,
            longitude: this.state.markerPosition.longitude,
          },
          10000,
        )
      )
        nearme.push(item);
    });
    return nearme.map(marker => (
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
  renderCardAfterSearch = () => {
    var item = [];
    if (this.state.otherParam == null) return;
    var key = this.state.otherParam;
    this.itemRef.ref('tchCor/' + key).on('value', snapshot => {
      item.name = snapshot.val().name;
      item.branch = snapshot.val().branch;
    });
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('DetailStore', {
              key: key,
            })
          }>
          <Card
            image={require('../../assets/h1.jpg')}
            imageStyle={{
              height: 120,
              borderRadius: 20,
            }}
            containerStyle={{
              width: width - 16,
              marginHorizontal: 8,
              marginBottom: 8,
              zIndex: 0,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 9}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                  {item.name + ' - ' + item.branch}
                </Text>
                <Text style={{fontSize: 16}}>4 ****** - Mở cửa: 8h - 22h</Text>
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      onDirection: true,
                      showNearMe: false,
                      sourceDirectionCoor: this.state.markerPosition,
                    })
                  }>
                  <MaterialIcons name="directions" size={40} color="#2132eb" />
                </TouchableOpacity>

                <View
                  style={{
                    backgroundColor: '#fff',
                    width: 32,
                    marginTop: -120,
                    borderRadius: 20,
                    zIndex: 1,
                    position: 'absolute',
                    height: 32,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        showSearchLocation: false,
                        onDirection: false,
                        isSelect: false,
                      })
                    }>
                    <MaterialIcons name="cancel" size={32} color="#ccc" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      </View>
    );
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
  renderNearme = () => {
    return (
      <FlatList
        keyExtractor={item => item.key}
        horizontal={true}
        //  pagingEnabled={true}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        style={{height: 50, marginBottom: 10}}
        scrollEventThrottle={16}
        snapToAlignment="center"
        data={this.state.allMarker}
        renderItem={({item}) => this.renderDetailCard(item)}
      />
    );
  };
  watchID: ?number = null;
  async componentDidMount() {
    await request_location_runtime_permission();
  }
  centerMarker = data => {
    this.mapView.animateToRegion(data);
    if (!this.state.allowShowMyLocation) {
      this.setState({
        allowShowMyLocation: !this.state.allowShowMyLocation,
      });
    }
  };
  renderDirection = () => {
    var pos = [];
    if (this.state.otherParam == null) return;
    if (this.state.isSelect === true) {
      this.itemRef
        .ref('tchCor/' + this.state.otherParam)
        .on('value', snapshot => {
          pos.latitude = snapshot.val().lat;
          pos.longitude = snapshot.val().long;
        });
    }
    return (
      <MapViewDirections
        origin={this.state.sourceDirectionCoor}
        destination={pos}
        apikey={'AIzaSyCCSoKB9u8RmegTTXFgOko39pNEaLZrnpI'}
        onReady={result => {
          this.mapView.fitToCoordinates(result.coordinates, {
            edgePadding: {
              right: 0,
              bottom: height / 1.4,
              left: 0,
              top: height / 2,
            },
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
          showsCompass={false}
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
          }}
          // region={this.state.initialRegion}
          showsUserLocation={this.state.allowShowMyLocation}
          followsUserLocation={this.state.allowShowMyLocation}
          loadingEnabled={true}
          ref={mapView => (this.mapView = mapView)}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}>
          {this.state.onDirection && this.renderDirection()}
          {this.renderListMarker()}
          {this.state.isSelect && this.renderMarker()}
          {this.state.allowShowNearme && this.renderListMarkerNearme()}
        </MapView>
        <TouchableOpacity onPress={this.goToSearchScreen}>
          <View>
            <TextInput
              style={styles.textInputStyle}
              editable={false}
              value={this.state.text}
              underlineColorAndroid="transparent"
              placeholder={this.state.selected ? 'Selected' : 'Not Selected'}
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
            onPress={() => this.centerMarker(this.state.initialRegion)}

            //onPress={() => this.props.navigation.navigate('DetailStore')}
          >
            <MaterialIcons name="gps-fixed" size={32} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nearMeButton}
            onPress={() =>
              this.setState({
                showNearMe: !this.state.showNearMe,
                showSearchLocation: false,
                allowShowNearme: !this.state.allowShowNearme,
              })
            }

            //onPress={() => this.props.navigation.navigate('DetailStore')}
          >
            <MaterialIcons name="near-me" size={32} />
          </TouchableOpacity>
        </View>
        {this.state.showNearMe &&
          !this.state.showSearchLocation &&
          this.renderNearme()}
        {this.state.showSearchLocation && this.renderCardAfterSearch()}
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
