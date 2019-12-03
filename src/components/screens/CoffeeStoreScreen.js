/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import StarRating from 'react-native-star-rating';
import {Button, Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {BarChart, YAxis} from 'react-native-svg-charts';
import ListCommentCard from './ListCommentCard';
import coffee_color from '../../color';
import {
  TextInput,
  Animated,
  Platform,
  BackHandler,
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
const data = [
  {
    value: 50,
    label: '1',
  },
  {
    value: 10,
    label: '2',
  },
  {
    value: 40,
    label: '3',
  },
  {
    value: 95,
    label: '4',
  },
  {
    value: 85,
    label: '5',
  },
];

const HEADER_MAX_HEIGHT = 260;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const {width, height} = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;

const listInfo = [
  {
    title: 'dia chi',
    icon: 'map-marker-alt',
  },
  {
    title: 'gio mo cua - dong cua',
    icon: 'clock',
  },
  {
    title: 'sdt',
    icon: 'phone',
  },
  {
    title: 'dia chi',
    icon: 'map-marker-alt',
  },
  {
    title: 'gio mo cua - dong cua',
    icon: 'clock',
  },
  {
    title: 'sdt',
    icon: 'phone',
  },
  {
    title: 'dia chi',
    icon: 'map-marker-alt',
  },
  {
    title: 'gio mo cua - dong cua',
    icon: 'clock',
  },
  {
    title: 'sdt',
    icon: 'phone',
  },
];
const menu = [
  {
    text: 'Ca phe den',
    img: require('../../assets/capheden.jpg'),
    gia: 35000,
  },
  {
    text: 'Ca phe sua',
    img: require('../../assets/caphesua.jpg'),
    gia: 40000,
  },
  {
    text: 'Ca phe den',
    img: require('../../assets/capheden.jpg'),
    gia: 35000,
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

    this.state = {
      scrollY: new Animated.Value(0),
      refreshing: false,
      starCount: 3.3,
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

  renderCover = item => {
    return (
      <View style={{paddingRight: 2}}>
        <Image style={{height: 180, width: 250}} source={item.img} />
      </View>
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
              data={data}
              yAccessor={({index}) => index}
              contentInset={{top: 5, bottom: 5}}
              numberOfTicks={5}
              formatLabel={(_, index) => data[index].label}
              style={{
                flexGrow: 0,
                paddingHorizontal: 5,
                fontSize: 14,
                paddingVertical: -10,
              }}
            />
            <BarChart
              style={{flex: 1, marginLeft: 10}}
              data={data}
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
              3.5
            </Text>
            <View style={{width: 100}}>
              <StarRating
                fullStarColor={coffee_color}
                halfStarColor={coffee_color}
                disabled={false}
                maxStars={5}
                starSize={16}
                rating={this.state.starCount}
                selectedStar={rating => this.onStarRatingPress(rating)}
              />
            </View>
            <Text
              style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'center'}}>
              (99)
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
        image={item.img}
        containerStyle={styles.card}
        imageProps={{borderRadius: 10}}
        imageStyle={{
          height: 120,
        }}>
        <Text style={{marginBottom: 4}}>{item.text}</Text>
        <Text style={{marginBottom: 10}}>{item.gia}</Text>
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
        <Animated.ScrollView
          scrollEventThrottle={1}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: this.state.scrollY}}},
          ])}>
          <View style={{paddingTop: HEADER_MAX_HEIGHT}}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={listInfo}
              renderItem={({item}) => this.renderInfo(item)}
              keyExtractor={item => item.id}
            />
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
              data={menu}
              renderItem={({item}) => this.renderCard(item)}
              keyExtractor={item => item.id}
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
                  placeholder={'Nhập đánh giá'}
                  borderBottomColor="#f12"
                  borderWidth={1}
                />
              </View>
            </View>
          </View>
          <View style={{borderColor: '#ccc', borderWidth: 1, padding: 10}}>
            <Text style={{fontSize: 24, marginLeft: 2, marginBottom: 10}}>
              Bài đánh giá
            </Text>
            <ListCommentCard />
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
            <View>
              <Text style={{fontSize: 24, margin: 10, marginLeft: 45}}>
                The Coffee House
              </Text>
              <Text style={{marginLeft: 50}}>******</Text>
            </View>
            <View style={{marginRight: 10}}>
              <TouchableOpacity style={styles.btnBookmark}>
                <Icon
                  name="bookmark"
                  size={32}
                  color={coffee_color}
                  style={{marginLeft: 8, marginRight: 8, marginTop: 5}}
                />
              </TouchableOpacity>
            </View>
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
