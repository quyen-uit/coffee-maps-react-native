/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Text,
  Image,
  Dimensions,
  View,
  StyleSheet,
} from 'react-native';
import {Button} from 'react-native-elements';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {coffee_color} from '../../color';
import {ScrollView} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');

export default class DetailNewsScreen extends React.Component {
  constructor(props) {
    super(props);
    var news = this.props.navigation.getParam('value');
    this.state = {
      detail: news,
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Image
            style={{height: height / 3.5, width: width}}
            source={{uri: this.state.detail.cover}}
          />
          <Text
            style={{
              marginLeft: 8,
              marginTop: 8,
              fontSize: 26,
              fontWeight: 'bold',
            }}>
            {this.state.detail.title}
          </Text>
          <Text style={{marginLeft: 8, color: '#999999'}}>
            {this.state.detail.date} - {this.state.detail.store}
          </Text>
          <Text
            style={{marginHorizontal: 16, marginVertical: 24, fontSize: 18}}>
            {this.state.detail.summary}
          </Text>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    display: 'flex',
    flex: 0,
  },
});
