/* eslint-disable react-native/no-inline-styles */
import Dialog from 'react-native-dialog';
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
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Header from '../Header';
import * as firebase from 'firebase';

import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {firebaseApp} from '../FirebaseApp';
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

const options = {
  title: 'Select Avatar',
  customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
var n, a;
firebaseApp
  .database()
  .ref('users/' + firebase.auth().currentUser.uid + '/name')
  .on('value', snapshot => {
    n = snapshot.val();
  });
firebaseApp
  .database()
  .ref('users/' + firebase.auth().currentUser.uid + '/avatar')
  .on('value', snapshot => {
    a = snapshot.val();
  });
export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      name: n,
      newName: null,
      imgAvatar: require('../../assets/img_demo.jpg'),
      loading: false,
      dp: null,
      image: null,
      image_uri: a,
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
  updateNameofUser = () => {
    this.setState({name: this.state.newName, showDialog: false});

    firebaseApp
      .database()
      .ref('users/' + firebase.auth().currentUser.uid)
      .set({
        name: this.state.newName,
        avatar: this.state.image_uri
      });
    // firebase.auth().currentUser.updateProfile({
    //   displayName: this.state.newName,
    // });
    // console.log(firebase.auth().currentUser.displayName);
  };
  uploadImage = (uri, imageName, mime = 'application/octet-stream') => {
    return new Promise((resolve, reject) => {
      const uploadUri =
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      let uploadBlob = null;
      const imageRef = firebaseApp
        .storage()
        .ref('userAvatar')
        .child('user/' + firebase.auth().currentUser.uid);
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
            firebaseApp
              .database()
              .ref('users/' + firebase.auth().currentUser.uid)
              .set({
                name: this.state.name,
                avatar: url,
              });
          })
          .catch(error => console.log(error));
      }
    });
  };

  signOutUser = () => {
    firebase.auth().signOut();
  };
  render() {
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.info}>
            <View style={{alignSelf: 'flex-end', marginRight: 16}}>
              <TouchableOpacity onPress={this.pickImg}>
                <Icon name="edit" size={32} />
              </TouchableOpacity>
            </View>
            <Image style={styles.avatar} source={{uri: this.state.image_uri}} />
            <Text style={{fontSize: 24, marginTop: 10, fontWeight: 'bold'}}>
              {this.state.name}
            </Text>
          </View>
          <View>
            <Dialog.Container visible={this.state.showDialog}>
              <Dialog.Title>Nhập tên mới</Dialog.Title>
              <Dialog.Input
                autoFocus={true}
                onChangeText={text =>
                  this.setState({newName: text})
                }></Dialog.Input>
              <Dialog.Button
                label="Hủy"
                onPress={() => this.setState({showDialog: false})}
              />
              <Dialog.Button
                label="Sửa"
                onPress={() => this.updateNameofUser()}
              />
            </Dialog.Container>
          </View>
          <Button
            title={'Sửa tên người dùng'}
            buttonStyle={styles.btn}
            containerStyle={{marginVertical: 4}}
            titleStyle={{color: '#000'}}
            onPress={() => this.setState({showDialog: true})}
          />
          <Button
            title={'Cài đặt'}
            buttonStyle={styles.btn}
            containerStyle={{marginVertical: 4}}
            titleStyle={{color: '#000'}}
          />
          <Button
            title={'Giúp đỡ'}
            buttonStyle={styles.btn}
            containerStyle={{marginVertical: 4}}
            titleStyle={{color: '#000'}}
          />
          <Button
            onPress={this.pickImg}
            title={'Thoát'}
            buttonStyle={styles.btn}
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
    backgroundColor: '#f0f0f0',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 70,
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
  btn: {
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingLeft: 16,
  },
});
