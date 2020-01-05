/* eslint-disable react-native/no-inline-styles */
import Dialog from 'react-native-dialog';
import StarRating from 'react-native-star-rating';
import {
  FlatList,
  Text,
  Dimensions,
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Button, Card} from 'react-native-elements';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Icon from 'react-native-vector-icons/FontAwesome5';
import {coffee_color} from '../../color';
import {firebaseApp} from '../FirebaseApp';
import * as firebase from 'firebase';
const {width, height} = Dimensions.get('window');

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

  constructor(props) {
    super(props);

    this.state = {
      allStore: [],
      showDialogDel: false,
      deleteKey: null,
      loading: false,
    };
  }
  goToMap = key => {
    this.props.navigation.navigate('Maps', {
      param: key,
      keyTab: this.props.navigation.state.key,
    });
  };
  onDeleteDialog = key => {
    this.setState({showDialogDel: true, deleteKey: key});
  };
  deleteBookmark = key => {
    var item = [];
    firebaseApp
      .database()
      .ref('users/' + firebase.auth().currentUser.uid)
      .child('favorites')
      .child(key)
      .remove()
      .then(() => {
        firebaseApp
          .database()
          .ref('users/' + firebase.auth().currentUser.uid)
          .child('favorites')
          .on('value', snapshot => {
            snapshot.forEach(function(childSnapshot) {
              var i = {key: childSnapshot.key, value: childSnapshot.val()};
              var temp = true;
              item.map(item => {
                if (item.key == i.key) {
                  temp = false;
                }
              });
              if (temp) {
                var img1;
                firebaseApp
                  .database()
                  .ref('stores/tch/cover')
                  .on('value', snapshot => {
                    img1 = snapshot.val();
                  });
                firebaseApp
                  .database()
                  .ref('tchCor')
                  .on('child_added', snapshot => {
                    if (i.key == snapshot.key && i.value) {
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
                        image: img1,
                        averageStar: averageStar,
                        name: snapshot.val().name,
                        branch: snapshot.val().branch,
                        baby: snapshot.val().features.baby,
                        parking: snapshot.val().features.parking,
                        gamezone: snapshot.val().features.gamezone,
                        aircondition: snapshot.val().features.aircondition,
                        pet: snapshot.val().features.pet,
                        wifi: snapshot.val().features.wifi,
                        key: snapshot.key,
                        address: snapshot.val().address,
                      });
                    }
                  });
                var img1;
                firebaseApp
                  .database()
                  .ref('stores/highland/cover')
                  .on('value', snapshot => {
                    img1 = snapshot.val();
                  });
                firebaseApp
                  .database()
                  .ref('highlandCor')
                  .on('child_added', snapshot => {
                    if (i.key == snapshot.key && i.value) {
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
                        image: img1,
                        name: snapshot.val().name,
                        branch: snapshot.val().branch,
                        baby: snapshot.val().features.baby,
                        parking: snapshot.val().features.parking,
                        gamezone: snapshot.val().features.gamezone,
                        aircondition: snapshot.val().features.aircondition,
                        pet: snapshot.val().features.pet,
                        wifi: snapshot.val().features.wifi,
                        key: snapshot.key,
                        address: snapshot.val().address,
                      });
                    }
                  });
              }
            });

            this.setState({allStore: item});
          });
      });

    // re-get list
  };
  goToDetail = item => {
    this.props.navigation.navigate('DetailStore', {
      key: item,
    });
  };
  getDatabase() {
    var fav = [];
    var item = [];

    firebaseApp
      .database()
      .ref('users/' + firebase.auth().currentUser.uid)
      .child('favorites')
      .on('child_added', snapshot => {
        var i = {key: snapshot.key, value: snapshot.val()};
        var img1;
        firebaseApp
          .database()
          .ref('stores/tch/cover')
          .on('value', snapshot => {
            img1 = snapshot.val();
          });
        firebaseApp
          .database()
          .ref('tchCor')
          .on('child_added', snapshot => {
            if (i.key == snapshot.key && i.value) {
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
                name: snapshot.val().name,
                branch: snapshot.val().branch,
                image: img1,
                key: snapshot.key,
                address: snapshot.val().address,
                baby: snapshot.val().features.baby,
                parking: snapshot.val().features.parking,
                gamezone: snapshot.val().features.gamezone,
                aircondition: snapshot.val().features.aircondition,
                pet: snapshot.val().features.pet,
                wifi: snapshot.val().features.wifi,
              });
            }
          });
        var img1;
        firebaseApp
          .database()
          .ref('stores/highland/cover')
          .on('value', snapshot => {
            img1 = snapshot.val();
          });
        firebaseApp
          .database()
          .ref('highlandCor')
          .on('child_added', snapshot => {
            if (i.key == snapshot.key && i.value) {
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
                name: snapshot.val().name,
                branch: snapshot.val().branch,
                image: img1,
                key: snapshot.key,
                address: snapshot.val().address,
                baby: snapshot.val().features.baby,
                parking: snapshot.val().features.parking,
                gamezone: snapshot.val().features.gamezone,
                aircondition: snapshot.val().features.aircondition,
                pet: snapshot.val().features.pet,
                wifi: snapshot.val().features.wifi,
              });
            }
          });

        this.setState({allStore: item});
      });
  }
  componentDidMount() {
    this.getDatabase();
    // get list
  }
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
                    {' '}
                    ({item.averageStar})
                  </Text>
                </View>
              </View>
              <View style={{flex: 0}}>
                <TouchableOpacity onPress={() => this.goToMap(item.key)}>
                  <MaterialIcons name="directions" size={40} color="#2132eb" />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
        <View style={styles.btnCancel}>
          <TouchableOpacity
            onPress={() => {
              this.onDeleteDialog(item.key);
            }}>
            <MaterialIcons name="cancel" size={32} color="#ccc" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View>
          <Dialog.Container visible={this.state.showDialogDel}>
            <Dialog.Title>Xóa cửa hàng</Dialog.Title>
            <Dialog.Description>
              Bạn có muốn xóa cửa hàng này khỏi danh sách ?
            </Dialog.Description>
            <Dialog.Button
              onPress={() => {
                this.setState({showDialogDel: false});
                this.deleteBookmark(this.state.deleteKey);
              }}
              label="Có"
            />
            <Dialog.Button
              onPress={() => this.setState({showDialogDel: false})}
              label="Không"
            />
          </Dialog.Container>
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={this.state.allStore}
          renderItem={({item}) => this.renderCard(item)}
          keyExtractor={item => item.key}
          ListHeaderComponent={
            <View
              style={{
                marginTop: 16,
                alignSelf: 'center',
                width: width / 2,
                borderRadius: 10,
                backgroundColor: '#fc5c65',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  alignSelf: 'center',
                  padding: 4,
                  color: '#fff',
                }}>
                Tổng: {this.state.allStore.length} cửa hàng
              </Text>
            </View>
          }
        />
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
  imgCard: {
    height: 120,
    borderRadius: 20,
  },
  containerCard: {
    width: width - 16,
    marginHorizontal: 8,
    marginBottom: 8,
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
});
