/* eslint-disable react-native/no-inline-styles */
import Dialog from 'react-native-dialog';
import React, {Component} from 'react';
import StarRating from 'react-native-star-rating';
import {Button, Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {BarChart, YAxis} from 'react-native-svg-charts';

import {firebaseApp} from '../FirebaseApp';
import * as firebase from 'firebase';
import {coffee_color} from '../../color';
import {
  TextInput,
  Animated,
  Platform,
  BackHandler,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';

const HEADER_MAX_HEIGHT = 260;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const {width, height} = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const list = [
  {
    img: require('../../assets/img_demo.jpg'),
  },
  {
    img: require('../../assets/h1.jpg'),
  },
  {
    img: require('../../assets/h2.jpg'),
  },
];

export default class App extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  static navigationOptions = {
    headerBackImage: <Icon name="arrow-circle-left" size={26} color="#ccc" />,
    headerTitleStyle: {color: '#fff'},
    headerTintColor: '#fff',
    headerTransparent: true,
  };
  constructor(props) {
    super(props);
    // get list key favorite

    this.state = {
      // comment
      starCount: 5,
      textCmt: '',
      listCmt: [],
      //
      allowBookmark: null,
      scrollY: new Animated.Value(0),
      refreshing: false,
      data: [],
      menu: [],
      //start
      oldStart: null,
      sum: null,
      average: null,
      listStar: [],
      showDialogDel: false,
      sendKey: null,
    };
    this._didFocusSubscription = props.navigation.addListener(
      'didFocus',
      payload =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }
  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );

    // firebase
    var mn = [];
    var item;
    var store;

    store = this.props.navigation.getParam('key');

    switch (store.name) {
      case 'The Coffee House': {
        firebaseApp
          .database()
          .ref('stores/tch')
          .on('value', snapshot => {
            store.closeTime = snapshot.val().closeTime;
            store.openTime = snapshot.val().openTime;
            store.phone = snapshot.val().phone;
            this.setState({data: store});
          });

        firebaseApp
          .database()
          .ref('menu/tch')
          .on('child_added', snapshot => {
            mn.push({
              name: snapshot.val().name,
              price: snapshot.val().price,
              image: snapshot.val().image,
              key: snapshot.key,
            });
          });
        firebaseApp
          .database()
          .ref('tchCor')
          .child(store.key)
          .child('start')
          .on('value', snapshot => {
            item = snapshot.val();
          });

        this.setState({
          menu: mn,
          listStar: [
            {
              value: item.one,
              label: '5',
            },
            {
              value: item.two,
              label: '4',
            },
            {
              value: item.three,
              label: '3',
            },
            {
              value: item.four,
              label: '2',
            },
            {
              value: item.five,
              label: '1',
            },
          ],
        });
        break;
      }

      case 'Highlands Coffee': {
        firebaseApp
          .database()
          .ref('stores/highland')
          .on('value', snapshot => {
            store.closeTime = snapshot.val().closeTime;
            store.openTime = snapshot.val().openTime;
            store.phone = snapshot.val().phone;
            this.setState({data: store});
          });
        firebaseApp
          .database()
          .ref('menu/highland')
          .on('child_added', snapshot => {
            mn.push({
              name: snapshot.val().name,
              price: snapshot.val().price,
              image: snapshot.val().image,
              key: snapshot.key,
            });
          });
        firebaseApp
          .database()
          .ref('highlandCor')
          .child(store.key)
          .child('start')
          .on('value', snapshot => {
            item = snapshot.val();
          });
        this.setState({
          menu: mn,
          listStar: [
            {
              value: item.one,
              label: '5',
            },
            {
              value: item.two,
              label: '4',
            },
            {
              value: item.three,
              label: '3',
            },
            {
              value: item.four,
              label: '2',
            },
            {
              value: item.five,
              label: '1',
            },
          ],
        });
      }
    }
    //start
    var sum = item.one + item.two + item.three + item.four + item.five;
    var averageStar =
      Math.round(
        ((item.one +
          item.two * 2 +
          item.three * 3 +
          item.four * 4 +
          item.five * 5) /
          (item.one + item.two + item.three + item.four + item.five)) *
          10,
      ) / 10;
    // get comment
    this.setState({oldStart: item, sum: sum, average: averageStar});
    var cmts = [];
    var flag = false;
    var tmpName, tmpAvatar;
    firebaseApp
      .database()
      .ref('comments/')
      .child(store.key)
      .on('child_added', snapshot => {
        firebaseApp
          .database()
          .ref('users/')
          .child(snapshot.val().user)
          .on('value', snapshot => {
            if (snapshot.val()) {
              tmpName = snapshot.val().name;
              tmpAvatar = snapshot.val().avatar;
              flag = true;
            }
          });
        if (flag) {
          if (snapshot.val().text != '')
            cmts.push({
              name: tmpName,
              avatar: tmpAvatar,
              text: snapshot.val().text,
              start: snapshot.val().start,
              key: snapshot.key,
            });
          flag = false;
          this.setState({listCmt: cmts});
        }
      });

    var fav = [];
    firebaseApp
      .database()
      .ref('users/' + firebase.auth().currentUser.uid)
      .child('favorites')
      .on('child_added', snapshot => {
        fav.push({
          key: snapshot.key,
          value: snapshot.val(),
        });
      });
    //

    var bookmarked = false;
    fav.map(item => {
      if (item.key == store.key && item.value) bookmarked = true;
    });
    this.setState({allowBookmark: !bookmarked});
  }

  onBackButtonPressAndroid = () => {
    if (this.isSelectionModeEnabled) {
      this.disableSelectionMode();
      return true;
    } else {
      return false;
    }
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }
  onSendDialog = () => {
    this.setState({showDialogDel: true});
  };
  sendComment = () => {
    firebaseApp
      .database()
      .ref('comments/')
      .child(this.state.data.key)
      .push({
        user: firebase.auth().currentUser.uid,
        text: this.state.textCmt,
        start: this.state.starCount,
      });
    var item = this.state.oldStart;
    switch (this.state.starCount) {
      case 1:
        item.one = item.one + 1;
        break;
      case 2:
        item.two = item.two + 1;
        break;
      case 3:
        item.three = item.three + 1;
        break;
      case 4:
        item.four = item.four + 1;
        break;
      case 5:
        item.five = item.five + 1;
    }
    var updates = {};

    switch (this.state.data.name) {
      case 'The Coffee House': {
        updates['/tchCor/' + this.state.data.key + '/start'] = item;
        firebaseApp
          .database()
          .ref()
          .update(updates);

        firebaseApp
          .database()
          .ref('tchCor')
          .child(this.state.data.key)
          .child('start')
          .on('value', snapshot => {
            item = snapshot.val();
          });
        var sum = item.one + item.two + item.three + item.four + item.five;
        var averageStar =
          Math.round(
            ((item.one +
              item.two * 2 +
              item.three * 3 +
              item.four * 4 +
              item.five * 5) /
              (item.one + item.two + item.three + item.four + item.five)) *
              10,
          ) / 10;
        this.setState({sum: sum, average: averageStar, textCmt: null});
        break;
      }

      case 'Highlands Coffee': {
        updates['/highlandCor/' + this.state.data.key + '/start'] = item;
        firebaseApp
          .database()
          .ref()
          .update(updates);
        firebaseApp
          .database()
          .ref('highlandCor')
          .child(this.state.data.key)
          .child('start')
          .on('value', snapshot => {
            item = snapshot.val();
          });
        var sum = item.one + item.two + item.three + item.four + item.five;
        var averageStar =
          Math.round(
            ((item.one +
              item.two * 2 +
              item.three * 3 +
              item.four * 4 +
              item.five * 5) /
              (item.one + item.two + item.three + item.four + item.five)) *
              10,
          ) / 10;
        this.setState({sum: sum, average: averageStar});
      }
    }
  };
  addBookmark = () => {
    firebaseApp
      .database()
      .ref('users/' + firebase.auth().currentUser.uid)
      .child('favorites')
      .child(this.state.data.key)
      .set(true)
      .then(() => {
        this.setState({allowBookmark: false});
      });
  };
  renderCover = item => {
    return (
      <View style={{paddingRight: 2}}>
        <Image style={{height: 180, width: 250}} source={item.img} />
      </View>
    );
  };
  renderCommentCard = item => {
    return (
      <Card containerStyle={styles.cardCmt} imageProps={{borderRadius: 10}}>
        <View>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }}
                source={{uri: item.avatar}}
              />
            </View>
            <View style={{display: 'flex', marginTop: -4, flex: 5}}>
              <Text style={{fontSize: 16}}>{item.name}</Text>
              <View
                style={{display: 'flex', marginTop: -4, flexDirection: 'row'}}>
                <View style={{width: 50, marginTop: 3, marginRight: 5}}>
                  <StarRating
                    fullStarColor={coffee_color}
                    halfStarColor={coffee_color}
                    disabled={true}
                    maxStars={5}
                    starSize={12}
                    rating={item.start}
                  />
                </View>
              </View>
            </View>
            <View style={{flex: 1, marginRight: -30}}>
              <TouchableOpacity>
                <Icon name="flag" size={24} color={coffee_color} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginLeft: 50}}>
            <Text>{item.text}</Text>
          </View>
          <View
            style={{
              alignSelf: 'flex-end',
              marginRight: 8,
              flexDirection: 'row',
            }}></View>
        </View>
      </Card>
    );
  };
  renderStartChart = () => {
    return (
      <View>
        <Text style={{fontSize: 24, marginLeft: 10, marginBottom: 10}}>
          Tóm tắt đánh giá
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              flexDirection: 'row',
              height: 100,
              width: SCREEN_WIDTH / 2 + 50,
              paddingVertical: 16,
              marginLeft: 20,
            }}>
            <YAxis
              data={this.state.listStar}
              yAccessor={({index}) => index}
              contentInset={{top: 5, bottom: 5}}
              numberOfTicks={5}
              formatLabel={(_, index) => this.state.listStar[index].label}
              style={{
                flexGrow: 0,
                paddingHorizontal: 5,
                fontSize: 14,
                paddingVertical: -10,
              }}
            />

            <BarChart
              style={{flex: 1, marginLeft: 10}}
              data={this.state.listStar}
              horizontal={true}
              yAccessor={({item}) => item.value}
              svg={{fill: coffee_color}}
              contentInset={{top: 0, bottom: 0}}
              gridMin={0}
            />
          </View>
          <View>
            <Text
              style={{fontSize: 36, fontWeight: 'bold', alignSelf: 'center'}}>
              {this.state.average}
            </Text>
            <View style={{width: 100}}>
              <StarRating
                fullStarColor={coffee_color}
                halfStarColor={coffee_color}
                disabled={false}
                maxStars={5}
                starSize={16}
                rating={this.state.average}
                selectedStar={rating => this.onStarRatingPress(rating)}
              />
            </View>
            <Text style={{fontSize: 20, alignSelf: 'center'}}>
              {'(' + this.state.sum + ')'}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  renderInfo = item => {
    return (
      <View
        style={{
          borderColor: '#ccc',
          borderWidth: 1,
          display: 'flex',
          flexDirection: 'row',
          height: 40,
          alignItems: 'center',
          padding: 10,
        }}>
        <Icon name={item.icon} size={24} color={coffee_color} />
        <Text style={{fontSize: 16, marginLeft: 20}}>{item.title}</Text>
      </View>
    );
  };
  renderCard = item => {
    return (
      <Card
        image={{uri: item.image}}
        containerStyle={styles.card}
        imageProps={{borderRadius: 10}}
        imageStyle={{
          height: 120,
        }}>
        <Text style={{marginBottom: 4, fontWeight: 'bold'}}>{item.name}</Text>
        <Text style={{marginBottom: 10}}>{item.price}</Text>
      </Card>
    );
  };
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }
  render() {
    const scrollY = Animated.add(this.state.scrollY, 0);
    const headerTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.fill}>
        <View>
          <Dialog.Container visible={this.state.showDialogDel}>
            <Dialog.Title>Xác nhận</Dialog.Title>
            <Dialog.Description>
              Bạn có muốn gửi đánh giá cho cửa hàng này ?
            </Dialog.Description>
            <Dialog.Button
              onPress={() => {
                this.setState({showDialogDel: false});
                this.sendComment();
              }}
              label="Có"
            />
            <Dialog.Button
              onPress={() => this.setState({showDialogDel: false})}
              label="Không"
            />
          </Dialog.Container>
        </View>
        <Animated.ScrollView
          scrollEventThrottle={1}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: this.state.scrollY}}},
          ])}>
          <View style={{paddingTop: HEADER_MAX_HEIGHT}}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                flexDirection: 'row',
                padding: 12,
              }}>
              <Icon name="map-marker-alt" size={24} color={coffee_color} />
              <Text style={{fontSize: 16, marginLeft: 8}}>
                {this.state.data.address}
              </Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                flexDirection: 'row',
                padding: 12,
              }}>
              <Icon name="clock" size={24} color={coffee_color} />
              <Text style={{fontSize: 16, marginLeft: 8}}>
                {'Giờ mở cửa: ' +
                  this.state.data.openTime +
                  ' - ' +
                  this.state.data.closeTime}
              </Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                flexDirection: 'row',
                padding: 12,
              }}>
              <Icon name="phone" size={24} color={coffee_color} />
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL('tel:' + this.state.data.phone);
                }}>
                <Text style={{fontSize: 16, marginLeft: 8}}>
                  {this.state.data.phone}
                </Text>
              </TouchableOpacity>
            </View>
            {(this.state.data.parking == 'yes' ||
              this.state.data.baby == 'yes' ||
              this.state.data.pet == 'yes' ||
              this.state.data.wifi == 'yes' ||
              this.state.data.aircondition == 'yes' ||
              this.state.data.gamezone == 'yes') && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  flexDirection: 'row',
                  padding: 12,
                }}>
                <Icon name="filter" size={24} color={coffee_color} />
                <Text style={{fontSize: 16, marginLeft: 8}}>
                  Tiện ích:
                  {this.state.data.parking == 'yes' ? ' bãi đổ xe hơi, ' : ' '}
                  {this.state.data.baby == 'yes' ? ' trẻ em,' : ''}
                  {this.state.data.pet == 'yes' ? ' thú cưng,' : ''}
                  {this.state.data.wifi == 'yes' ? ' wifi,' : ''}
                  {this.state.data.aircondition == 'yes'
                    ? ' phòng máy lạnh,'
                    : ', '}
                  {this.state.data.gamezone == 'yes' ? ' khu trò chơi.' : ''}
                </Text>
              </View>
            )}
          </View>
          <View style={{borderColor: '#ccc', borderWidth: 1, padding: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 14,
                marginRight: 10,
                marginBottom: -10,
              }}>
              <Text style={{fontSize: 24, marginLeft: -10, marginBottom: 10}}>
                Thực đơn
              </Text>
              <Button
                icon={<Icon name="ellipsis-h" color="#000" size={24} />}
                buttonStyle={{
                  marginTop: 12,
                  height: 8,
                  backgroundColor: '#fff',
                }}
              />
            </View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={this.state.menu}
              renderItem={({item}) => this.renderCard(item)}
              keyExtractor={item => item.key}
            />
          </View>
          {this.renderStartChart()}
          <View style={{borderColor: '#ccc', borderWidth: 1, padding: 10}}>
            <Text style={{fontSize: 24, marginLeft: 2, marginBottom: 10}}>
              Nhận xét
            </Text>
            <View style={{display: 'flex', alignItems: 'center'}}>
              <View>
                <Text style={{fontSize: 16, alignContent: 'center'}}>
                  Hãy chia sẽ trải nghiệm của bạn về cửa hàng.
                </Text>
              </View>
              <View style={{width: (SCREEN_WIDTH * 2) / 3, marginTop: 10}}>
                <StarRating
                  fullStarColor={coffee_color}
                  halfStarColor={coffee_color}
                  disabled={false}
                  maxStars={5}
                  rating={this.state.starCount}
                  selectedStar={rating => this.onStarRatingPress(rating)}
                />
                <TextInput
                  style={{marginVertical: 10}}
                  placeholder={'Nhập đánh giá'}
                  borderBottomColor="#f12"
                  borderWidth={1}
                  onChangeText={text => this.setState({textCmt: text})}
                />
                <Button
                  onPress={() => this.onSendDialog()}
                  style={{marginTop: 10}}
                  title={'Gửi'}
                  style={{}}
                />
              </View>
            </View>
          </View>
          <View style={{borderColor: '#ccc', borderWidth: 1, padding: 10}}>
            <Text style={{fontSize: 24, marginLeft: 2, marginBottom: 10}}>
              Bài đánh giá
            </Text>
            <View>
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={this.state.listCmt}
                renderItem={({item}) => this.renderCommentCard(item)}
                keyExtractor={item => item.key}
              />
            </View>
          </View>
        </Animated.ScrollView>
        <Animated.View
          style={[styles.header, {transform: [{translateY: headerTranslate}]}]}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={list}
            renderItem={({item}) => this.renderCover(item)}
            keyExtractor={item => item.id}
          />
          <View style={styles.title}>
            <View style={{flex: 8}}>
              <Text style={{fontSize: 24, margin: 10, marginLeft: 45}}>
                {this.state.data.name + ' - ' + this.state.data.branch}
              </Text>
              <View
                style={{
                  marginTop: -5,
                  marginRight: 5,
                  flexDirection: 'row',
                  marginLeft: 45,
                }}>
                <StarRating
                  fullStarColor={coffee_color}
                  halfStarColor={coffee_color}
                  disabled={true}
                  maxStars={5}
                  starSize={16}
                  width={50}
                  rating={this.state.average}
                />
                <Text style={{fontSize: 16, marginTop: -4}}>
                  {' '}
                  ({this.state.average})
                </Text>
              </View>
            </View>
            {this.state.allowBookmark && (
              <View style={{marginRight: 10, flex: 1}}>
                <TouchableOpacity style={styles.btnBookmark}>
                  <Icon
                    name="bookmark"
                    size={32}
                    color={coffee_color}
                    onPress={this.addBookmark}
                    style={{marginLeft: 8, marginRight: 8, marginTop: 5}}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  cardCmt: {
    width: SCREEN_WIDTH - 40,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
  },
  title: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  btnBookmark: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderColor: coffee_color,
    height: 42,
    width: 42,
    borderRadius: 32,
    borderWidth: 1,
  },
  card: {
    width: SCREEN_WIDTH / 3 + 20,
    height: 180,
    borderRadius: 10,
    margin: 10,
    borderColor: '#ccc',
  },
});
