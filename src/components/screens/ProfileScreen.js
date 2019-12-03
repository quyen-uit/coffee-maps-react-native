/* eslint-disable react-native/no-inline-styles */
import {Button} from 'react-native-elements';
import {
  Text,
  Dimensions,
  FlatList,
  View,
  Platform,
  StyleSheet,
  YellowBox,
  Image,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Header from '../Header';
import * as firebase from 'firebase';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import firebaseApp from '../FirebaseApp';
import {sort} from 'semver';
import {coffee_color} from '../../color';

const {width, height} = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
YellowBox.ignoreWarnings(['Setting a timer']);
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
const Fetch = RNFetchBlob.polyfill.Fetch;
// replace built-in fetch
window.fetch = new Fetch({
  // enable this option so that the response data conversion handled automatically
  auto: true,
  // when receiving response data, the module will match its Content-Type header
  // with strings in this array. If it contains any one of string in this array,
  // the response body will be considered as binary data and the data will be stored
  // in file system instead of in memory.
  // By default, it only store response data to file system when Content-Type
  // contains string `application/octet`.
  binaryContentTypes: ['image/', 'video/', 'audio/', 'foo/'],
}).build();
const listOptions = [
  {
    title: 'Thông tin tài khoản',
  },
  {
    title: 'Lịch sử',
  },
  {
    title: 'Giúp đỡ',
  },
];
const options = {
  title: 'Select Avatar',
  customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgAvatar: require('../../assets/img_demo.jpg'),
      loading: false,
      dp: null,
      image: null,
      image_uri: 'https://firebasestorage.googleapis.com/v0/b/rn-coffee-maps.appspot.com/o/userAvatar%2Favatar?alt=media&token=a9eb5b50-f667-4232-bc6a-e961f26505fb',
    };
  }

  static navigationOptions = {
    title: 'Thông tin tài khoản',
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

  uploadImage = (uri, imageName, mime = 'application/octet-stream') => {
    return new Promise((resolve, reject) => {
      const uploadUri =
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      let uploadBlob = null;
      const imageRef = firebaseApp
        .storage()
        .ref('userAvatar')
        .child('user');
      fs.readFile(uploadUri, 'base64')
        .then(data => {
          return Blob.build(data, {type: `${mime};BASE64`});
        })
        .then(blob => {
          uploadBlob = blob;
          return imageRef.put(blob, {contentType: mime});
        })
        .then(() => {
          uploadBlob.close();
          console.log(imageRef.getDownloadURL());
          return imageRef.getDownloadURL();
        })
        .then(url => {
          console.log(url);
          resolve(url);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  pickImg = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
        this.setState({imgAvatar: source});
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.uploadImage(response.uri, 'aaaa')
          .then(url => {
            this.setState({image_uri: url});
          })
          .catch(error => console.log(error));
      }
    });
  };
  renderOption = item => {
    return (
      <Button
        title={item.title}
        buttonStyle={{backgroundColor: '#fff', justifyContent: 'flex-start'}}
        containerStyle={{marginVertical: 4}}
        titleStyle={{color: '#000'}}
      />
    );
  };

  signOutUser = () => {
    firebase.auth().signOut();
  };
  render() {
    return (
      <View style={styles.container}>
        <View>
          <FlatList
            ListHeaderComponent={
              <View style={styles.info}>
                <Image
                  style={styles.avatar}
                  source={{uri: this.state.image_uri}}
                />
                <Text style={{fontSize: 24, marginTop: 10, fontWeight: 'bold'}}>
                  Tên tài khoản
                </Text>
                <TouchableOpacity onPress={this.pickAvatar}>
                  <Icon name="edit" size={48} />
                </TouchableOpacity>
              </View>
            }
            style={{marginBottom: 60}}
            scrollEnabled={true}
            data={listOptions}
            renderItem={({item}) => this.renderOption(item)}
            keyExtractor={item => item.id}
          />
          <Button
            onPress={this.pickImg}
            title={'Thoát'}
            buttonStyle={{
              backgroundColor: '#fff',
              justifyContent: 'flex-start',
            }}
            containerStyle={{marginVertical: 4}}
            titleStyle={{color: '#000'}}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    display: 'flex',
    flex: 0,
    backgroundColor: '#c1c1c1',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  info: {
    height: SCREEN_HEIGHT / 3,
    display: 'flex',
    backgroundColor: '#fff',
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  option: {
    display: 'flex',
  },
});
