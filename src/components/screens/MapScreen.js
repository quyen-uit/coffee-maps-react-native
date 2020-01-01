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
  Button,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import {Card, Badge} from 'react-native-elements';
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
    var img, img1;
    this.itemRef = firebaseApp.database();
    this.itemRef.ref('stores/tch/imgMarker').on('value', snapshot => {
      img = snapshot.val();
    });
    this.itemRef.ref('stores/tch/cover').on('value', snapshot => {
      img1 = snapshot.val();
    });
    this.itemRef.ref('tchCor').on('child_added', snapshot => {
      var averageStar =
        Math.round(
          ((snapshot.val().start.one +
            snapshot.val().start.two * 2 +
            snapshot.val().start.three * 3 +
            snapshot.val().start.four * 4 +
            snapshot.val().start.five * 5) /
            (snapshot.val().start.one +
              snapshot.val().start.two +
              snapshot.val().start.three +
              snapshot.val().start.four +
              snapshot.val().start.five)) *
            10,
        ) / 10;
      item.push({
        averageStar: averageStar,
        baby: snapshot.val().features.baby,
        parking: snapshot.val().features.parking,
        gamezone: snapshot.val().features.gamezone,
        aircondition: snapshot.val().features.aircondition,
        pet: snapshot.val().features.pet,
        wifi: snapshot.val().features.wifi,
        address: snapshot.val().address,
        name: snapshot.val().name,
        branch: snapshot.val().branch,
        image: snapshot.val().image,
        latitude: snapshot.val().lat,
        longitude: snapshot.val().long,
        marker: img,
        image: img1,
        district: snapshot.val().district,
        key: snapshot.key,
      });
    });
    this.itemRef.ref('stores/highland/imgMarker').on('value', snapshot => {
      img = snapshot.val();
    });
    this.itemRef.ref('stores/highland/cover').on('value', snapshot => {
      img1 = snapshot.val();
    });
    this.itemRef.ref('highlandCor').on('child_added', snapshot => {
      var averageStar =
        Math.round(
          ((snapshot.val().start.one +
            snapshot.val().start.two * 2 +
            snapshot.val().start.three * 3 +
            snapshot.val().start.four * 4 +
            snapshot.val().start.five * 5) /
            (snapshot.val().start.one +
              snapshot.val().start.two +
              snapshot.val().start.three +
              snapshot.val().start.four +
              snapshot.val().start.five)) *
            10,
        ) / 10;
      item.push({
        averageStar: averageStar,
        baby: snapshot.val().features.baby,
        parking: snapshot.val().features.parking,
        gamezone: snapshot.val().features.gamezone,
        aircondition: snapshot.val().features.aircondition,
        pet: snapshot.val().features.pet,
        wifi: snapshot.val().features.wifi,
        address: snapshot.val().address,
        name: snapshot.val().name,
        branch: snapshot.val().branch,
        image: snapshot.val().image,
        latitude: snapshot.val().lat,
        longitude: snapshot.val().long,
        marker: img,
        image: img1,
        district: snapshot.val().district,
        key: snapshot.key,
      });
    });

    this.state = {
      tracksViewChanges: true,
      //temp
      a: null,
      selected: false,
      oldKeySearch: null,
      // press marker
      // keyPressMarker: null,
      // showPressMarker: false,
      // fearture
      options: [],
      isOption: false,
      flag: null,
      flagSearch: null,
      lengthOption: 0,
      //search
      keySearch: null,
      isCenterMarker: false,
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
      listNearme: null,

      // direction
      time: 0,
      m: 0,
    };
  }

  removeNavigationListener() {
    if (this.navigationListener) {
      this.navigationListener.remove();
      this.navigationListener = null;
    }
    if (this.navigationListener1) {
      this.navigationListener1.remove();
      this.navigationListener1 = null;
    }
  }
  componentWillUnmount() {
    this.removeNavigationListener();
  }

  goToDetail = item => {
    this.props.navigation.navigate('DetailStore', {
      key: item,
    });
    // this.setState({showSearchLocation: true, keySearch: item});
  };

  goToSearchScreen = () => {
    const {navigation} = this.props;

    this.navigationListener = navigation.addListener('willFocus', payload => {
      const {state} = payload;
      const {params} = state;
      if (params == null) return;
      if (this.state.oldKeySearch == params.keySearch && !this.state.isSelect) {
        this.setState({
          isSelect: false,
          showSearchLocation: false,
        });
        return;
      }

      //update state with the new params
      const {keySearch} = params;
      const {isSelect} = params;
      const {showSearchLocation} = params;
      this.setState({
        keySearch,
        isSelect,
        showSearchLocation,
        isCenterMarker: true,
        oldKeySearch: keySearch,
      });
    });

    navigation.push('Search', {
      returnToRoute: navigation.state,
      keySearch: this.state.keySearch,
      isSelect: this.state.isSelect,
      showSearchLocation: this.state.showSearchLocation,
    });
  };
  goToOptionScreen = () => {
    const {navigation} = this.props;

    this.navigationListener1 = navigation.addListener('willFocus', payload => {
      const {state} = payload;

      const {params} = state;
      if (params == null) return;
      if (this.state.flag == params.options && !this.state.options) return;
      //update state with the new params

      const {isOption} = params;
      const {options} = params;

      this.setState({
        isOption,
        options,
        flag: params.options,
        lengthOption: params.lengthOption,
      });
    });

    navigation.navigate('Option', {
      returnToRoute: navigation.state,
      isOption: this.state.isOption,
      options: this.state.options,
    });
  };
  clearOption = () => {
    this.setState({options: null, isOption: false});
  };
  renderMarker = () => {
    var pos = [];
    if (this.state.keySearch == null) return;
    if (this.state.isSelect === true) {
      this.state.allMarker.map(i => {
        if (i.key === this.state.keySearch) {
          pos.latitude = i.latitude;
          pos.longitude = i.longitude;
          pos.img = i.marker;
        }
      });
      var regionA = {
        latitude: pos.latitude,
        longitude: pos.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      if (this.state.isCenterMarker) {
        this.centerMarker(regionA);
        this.setState({isCenterMarker: false});
      }
      return (
        <MapView.Marker
          onPress={() => {
            this.setState({
              showNearMe: false,
              allowShowNearme: false,
            });
          }}
          coordinate={{
            latitude: pos.latitude,
            longitude: pos.longitude,
          }}>
          <Image style={{width: 48, height: 39}} source={{uri: pos.img}} />
        </MapView.Marker>
      );
    }
  };
  // filter option

  getValue = value => (typeof value === 'string' ? value.toUpperCase() : value);
  filterPlainArray(array, filters) {
    const filterKeys = Object.keys(filters);
    return array.filter(item => {
      // validates all filter criteria
      return filterKeys.every(key => {
        // ignores an empty filter
        if (!filters[key].length) return true;
        return filters[key].find(
          filter => this.getValue(filter) === this.getValue(item[key]),
        );
      });
    });
  }
  stopTrackingViewChanges = () => {
    this.setState(() => ({
      tracksViewChanges: false,
    }));
  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.shouldUpdate(nextProps)) {
      this.setState(() => ({
        tracksViewChanges: true,
      }));
    }
  }
  shouldUpdate = nextProps => {};
  // filter marker with 2 picker
  renderListMarker = () => {
    var listMarker = [];
    listMarker = this.state.allMarker;
    if (this.state.isOption) {
      var temp = this.filterPlainArray(listMarker, this.state.options);
      listMarker = temp;
    }
    if (
      this.state.namePicker === 'Tất cả' &&
      this.state.districtPicker === 'Tất cả'
    ) {
      return listMarker.map(marker => (
        <MapView.Marker
          tracksViewChanges={this.state.tracksViewChanges}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          onPress={() => {
            this.setState({
              showNearMe: false,
              allowShowNearme: false,
              showSearchLocation: true,
              isSelect: true,
              keySearch: marker.key,
            });
          }}
          title={marker.title}
          description={marker.description}>
          <Image
            onLoad={() => this.setState({tracksViewChanges: true})}
            style={{width: 48, height: 39}}
            source={{uri: marker.marker}}
            onLoadEnd={this.stopTrackingViewChanges}
          />
        </MapView.Marker>
      ));
    } else
      return listMarker
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
            tracksViewChanges={this.state.tracksViewChanges}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => {
              this.setState({
                showNearMe: false,
                allowShowNearme: false,
                showSearchLocation: true,
                keySearch: marker.key,
                isSelect: true,
              });
            }}
            title={marker.title}
            description={marker.description}>
            <Image
              onLoad={() => this.setState({tracksViewChanges: true})}
              style={{width: 48, height: 39}}
              source={{uri: marker.marker}}
              onLoadEnd={this.stopTrackingViewChanges}
            />
          </MapView.Marker>
        ));
  };
  getListNearme = () => {
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
    if (this.state.isOption) {
      var temp = this.filterPlainArray(nearme, this.state.options);
      nearme = temp;
    }
    return nearme;
  };
  renderListMarkerNearme = () => {
    return this.getListNearme().map(marker => (
      <MapView.Marker
        tracksViewChanges={false}
        coordinate={{
          latitude: marker.latitude,
          longitude: marker.longitude,
        }}
        onPress={() => {
          this.setState({
            showNearMe: false,
            allowShowNearme: false,
            showSearchLocation: true,
            isSelect: true,
            keySearch: marker.key,
          });
        }}
        title={marker.title}
        description={marker.description}>
        <Image style={{width: 48, height: 39}} source={{uri: marker.marker}} />
      </MapView.Marker>
    ));
  };
  renderCard = item => {
    return (
      <View>
        <TouchableOpacity onPress={() => this.goToDetail(item)}>
          <Card
            image={{uri: item.image}}
            imageStyle={styles.imgCard}
            containerStyle={styles.containerCard}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 9}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                  {item.name + ' - ' + item.branch}
                </Text>
                <View
                  style={{
                    width: 80,
                    marginTop: 3,
                    marginRight: 5,
                    flexDirection: 'row',
                  }}>
                  <StarRating
                    fullStarColor={coffee_color}
                    halfStarColor={coffee_color}
                    disabled={true}
                    maxStars={5}
                    starSize={16}
                    width={50}
                    rating={item.averageStar}
                  />
                  <Text style={{fontSize: 16, marginTop: -4}}>
                    ({item.averageStar})
                  </Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      onDirection: !this.state.onDirection,
                      showNearMe: false,
                      sourceDirectionCoor: this.state.markerPosition,
                      isSelect: true,
                    })
                  }>
                  <MaterialIcons name="directions" size={40} color="#2132eb" />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
        <View style={styles.btnCancel}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                showSearchLocation: false,
                onDirection: false,
                isSelect: false,
              });
            }}>
            <MaterialIcons name="cancel" size={32} color="#ccc" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  // renderPressMarkerCard = () => {
  //   var item = [];
  //   if (this.state.keyPressMarker == null) return;
  //   var key = this.state.keyPressMarker;

  //   this.state.allMarker.map(i => {
  //     if (i.key === key) item = i;
  //   });
  //   return this.renderCard(item);
  // };
  renderCardAfterSearch = () => {
    var item = [];
    if (this.state.keySearch == null) return;
    var key = this.state.keySearch;
    // this.itemRef.ref('tchCor/' + key).on('value', snapshot => {
    //   item.name = snapshot.val().name;
    //   item.branch = snapshot.val().branch;
    // });
    this.state.allMarker.map(i => {
      if (i.key === this.state.keySearch) item = i;
    });
    return this.renderCard(item);
  };

  renderDetailCard = item => {
    return (
      <TouchableOpacity onPress={() => this.goToDetail(item)}>
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
        data={this.getListNearme()}
        renderItem={({item}) => this.renderDetailCard(item)}
      />
    );
  };
  watchID: ?number = null;
  async componentDidMount() {
    await request_location_runtime_permission();
    this.setState({tracksViewChanges: true});
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
    if (this.state.keySearch) {
      this.state.allMarker.map(i => {
        if (i.key === this.state.keySearch) {
          pos.latitude = i.latitude;
          pos.longitude = i.longitude;
        }
      });
    } else return;
    return (
      <MapViewDirections
        origin={this.state.sourceDirectionCoor}
        destination={pos}
        strokeWidth={2}
        strokeColor="#8e44ad"
        apikey={'AIzaSyCCSoKB9u8RmegTTXFgOko39pNEaLZrnpI'}
        onReady={result => {
          var t = Math.round(result.duration * 10) / 10;
          var dis = Math.round(result.distance * 10) / 10;
          this.setState({time: t, m: dis});
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
          {!this.state.showNearMe &&
            !this.state.showSearchLocation &&
            !this.state.isSelect &&
            this.renderListMarker()}
          {this.state.isSelect && this.renderMarker()}
          {this.state.allowShowNearme && this.renderListMarkerNearme()}
          {this.state.onDirection && (
            <MapView.Marker coordinate={this.state.markerPosition}>
              <View
                style={{
                  borderWidth: 1,
                  backgroundColor: '#fff',
                  marginBottom: 8,
                  padding: 6,
                }}>
                <Text>
                  {this.state.time} phút - {this.state.m} km
                </Text>
              </View>
            </MapView.Marker>
          )}
        </MapView>
        <TouchableOpacity onPress={this.goToSearchScreen}>
          <View>
            <TextInput
              style={styles.textInputStyle}
              editable={false}
              value={this.state.text}
              underlineColorAndroid="transparent"
              placeholder={'Tìm cửa hàng ...'}
            />
            <Icon name="search" size={20} style={styles.btnSearch} />
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
                this.setState({
                  districtPicker: itemValue,
                  tracksViewChanges: true,
                })
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
                this.setState({namePicker: itemValue, tracksViewChanges: true})
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
          {this.state.isOption ? (
            <TouchableOpacity onPress={this.clearOption}>
              <View style={styles.btnOption}>
                <MaterialIcons name="cancel" size={16} style={{margin: 6}} />

                <Badge
                  containerStyle={{position: 'absolute', top: -8, right: -8}}
                  status="success"
                  value={this.state.lengthOption}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={this.goToOptionScreen}>
              <View style={styles.btnOption}>
                <MaterialIcons
                  name="filter-list"
                  size={16}
                  style={{margin: 6}}
                />
              </View>
            </TouchableOpacity>
          )}
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
                showSearchLocation: false,
                onDirection: false,
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
  imgCard: {
    height: 120,
    borderRadius: 20,
  },
  containerCard: {
    width: width - 16,
    marginHorizontal: 8,
    marginBottom: 8,
    zIndex: 0,
  },
  btnCancel: {
    backgroundColor: '#fff',
    width: 32,
    marginTop: 24,
    borderRadius: 20,
    marginLeft: width - 48,
    position: 'absolute',
    height: 32,
  },
  btnSearch: {
    position: 'absolute',
    margin: 24,
    alignSelf: 'flex-end',
    paddingRight: 24,
  },
  btnOption: {
    backgroundColor: '#fff',
    marginLeft: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
});
