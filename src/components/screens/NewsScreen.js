/* eslint-disable react-native/no-inline-styles */
import {Text, Dimensions, View, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Card, Button} from 'react-native-elements';
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
    
    this.state = {
      list: [],
    };
  }
  goToDetail = (item) =>{
    this.props.navigation.navigate('DetailNews', {
      value: item,
    });
  }
  componentDidMount(){
    var item = [];

    
    this.itemRef = firebaseApp.database();
    this.itemRef.ref('news').on('child_added', snapshot => {
      item.push({
        title: snapshot.val().title,
        summary: snapshot.val().summary,
        store: snapshot.val().store,
        cover: snapshot.val().cover,
        date: snapshot.val().date,
      });
      this.setState({list: [{l: item, name: 'Tin mới'}, {l: item, name: 'Khuyến mãi'}]})
    });
  }
  renderCard = item => {
    return (
      <Card
        image={{uri: item.cover}}
        containerStyle={styles.card}
        imageProps={{borderTopRightRadius: 10, borderTopLeftRadius: 10}}
        imageStyle={{
          height: 100,
        }}>
        <Text style={{fontSize: 14, fontWeight: 'bold'}}>
          {item.store + ' - ' + item.title}
        </Text>
        <Text
          style={{marginBottom: 10, fontSize: 12, color: '#8f8f8f'}}
          NumberOfLines={1}>
          {item.summary.length < 80
            ? `${item.summary}`
            : `${item.summary.substring(0, 80)}...`}
        </Text>
        <View>
          <Button
          onPress={()=>this.goToDetail(item)}
            buttonStyle={{
              marginBottom: 10,
              marginTop: 10,
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
            marginTop: 16,
          }}>
          <Text style={{fontSize: 24}}>{item.name}</Text>
          <Button
            icon={<Icon name="ellipsis-h" color="#000" size={24} />}
            buttonStyle={{
              marginTop:8,
              height: 8,
              backgroundColor: 'transparent',
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
    backgroundColor: '#f0f0f0',
    display: 'flex',
    flex: 1,
  },
  card: {
    width: SCREEN_WIDTH / 2 + 20,

    borderRadius: 10,
  },
});
