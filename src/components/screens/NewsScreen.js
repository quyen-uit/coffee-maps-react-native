/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  Dimensions,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Card, Button, Image} from 'react-native-elements';
import {firebaseApp} from '../FirebaseApp';
import {coffee_color} from '../../color';
const {width, height} = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
// const listNews = [
//   {
//     id: 'n1',
//     text: '111111111',
//     img: require('../../assets/img_demo.jpg'),
//   },
//   {
//     id: 'n2',
//     text: '22222',
//     img: require('../../assets/img2.jpg'),
//   },
// ];
// const listNews1 = [
//   {
//     id: 'n1',
//     text: '333',
//     img: require('../../assets/h1.jpg'),
//   },
//   {
//     id: 'n2',
//     text: '44',
//     img: require('../../assets/h2.jpg'),
//   },
// ];
// const list = [
//   {
//     l: listNews,
//   },
//   {
//     l: listNews1,
//   },
// ];
export default class NewsScreen extends React.Component {
  static navigationOptions = {
    title: 'Tin tức',
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
    var item = [];
    this.itemRef = firebaseApp.database();
    this.itemRef.ref('news').on('child_added', snapshot => {
      item.push({
        title: snapshot.val().title,
        summary: snapshot.val().summary,
        store: snapshot.val().store,
      });
    });
    this.state = {
      list: [{l: item}, {l: item}],
    };
  }
  renderCard = item => {
    return (
      <Card
        image={require('../../assets/capheden.jpg')}
        containerStyle={styles.card}
        imageProps={{borderTopRightRadius: 10, borderTopLeftRadius: 10}}
        imageStyle={{
          height: 120,
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          {item.store + ' - ' + item.title}
        </Text>
        <Text
          style={{marginBottom: 10, fontSize: 14, color: '#8f8f8f'}}
          NumberOfLines={1}>
          {item.summary.length < 80
            ? `${item.summary}`
            : `${item.summary.substring(0, 80)}...`}
        </Text>
        <View>
          <Button
            buttonStyle={{
              marginBottom: 10,
              marginTop: 10,
              color: coffee_color,
            }}
            title="Chi tiết"
          />
        </View>
      </Card>
    );
  };
  renderListCard = item => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 14,
            marginRight: 10,
            marginBottom: -10,
          }}>
          <Text style={{fontSize: 24}}>News</Text>
          <Button
            icon={<Icon name="ellipsis-h" color="#000" size={24} />}
            buttonStyle={{
              marginTop: 12,
              height: 8,
              backgroundColor: '#ccc',
            }}
          />
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={item.l}
          renderItem={({item}) => this.renderCard(item)}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.list}
          renderItem={({item}) => this.renderListCard(item)}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ccc',
    display: 'flex',
    flex: 1,
  },
  card: {
    width: SCREEN_WIDTH / 2 + 20,
    height: 300,
    borderRadius: 10,
  },
});
