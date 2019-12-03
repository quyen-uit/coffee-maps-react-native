/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Button, Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import StarRating from 'react-native-star-rating';
import {coffee_color} from '../../color';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
const listComment = [
  {
    name: 'abc',
    date: 'dd/mm/yy',
    avatar: require('../../assets/h1.jpg'),
    comment:
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  },
  {
    name: 'def',
    date: 'dd/mm/yy',
    avatar: require('../../assets/h2.jpg'),
    comment: 'bbbbbbbbbbbbbbbbbb',
  },
  {
    name: 'abc',
    date: 'dd/mm/yy',
    avatar: require('../../assets/caphesua.jpg'),
    comment: 'ccccccccccccccccccc',
  },
];

const {width, height} = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;

export default class ListCommentCard extends Component {
  renderCommentCard = item => {
    return (
      <Card containerStyle={styles.card} imageProps={{borderRadius: 10}}>
        <View>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }}
                source={item.avatar}
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
                    disabled={false}
                    maxStars={5}
                    starSize={12}
                    rating={4}
                  />
                </View>
                <Text> - </Text>
                <Text style={{fontSize: 12}}>{item.date}</Text>
              </View>
            </View>
            <View style={{flex: 1, marginRight: -30}}>
              <TouchableOpacity>
                <Icon name="flag" size={24} color={coffee_color}/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginLeft: 50}}>
            <Text>{item.comment}</Text>
          </View>
          <View
            style={{
              alignSelf: 'flex-end',
              marginRight: 8,
              flexDirection: 'row',
            }}>
            <TouchableOpacity>
              <Icon name="heart" size={20} color= {coffee_color} />
            </TouchableOpacity>
            <Text>  10</Text>
          </View>
        </View>
      </Card>
    );
  };
  render() {
    return (
      <View>
      <FlatList
          showsHorizontalScrollIndicator={false}
          data={listComment}
          renderItem={({item}) => this.renderCommentCard(item)}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 40,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
  },
});
