/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import {coffee_color} from '../../color';
import Icon from 'react-native-vector-icons/FontAwesome5';
const {width, height} = Dimensions.get('window');
import * as firebase from 'firebase';
export default class ForgotPasswordScreen extends React.Component {
  static navigationOptions = {
    title: 'Lấy lại mật khẩu',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errorMessage: null,
    };
  }
  goToLoginScreen = () => {
    alert('Mail khôi phục mật khẩu đã được gửi.');
    this.props.navigation.navigate('Login');
  };
  handleForgot = () => {
    if (this.state.email == '') {
      alert('Thiếu thông tin!');
      return;
    }
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(() => this.goToLoginScreen())
      .catch(error => this.setState({errorMessage: error.message}));
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo_container}>
        <Image source={require('../../assets/icon.png')} style={{width: 100, height: 100}} />
          <Text style={{fontSize: 48, fontWeight: 'bold', color: coffee_color}}>
            Coffee Maps
          </Text>
          {this.state.errorMessage && (
            <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
          )}
          <View>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                underlineColorAndroid="transparent"
                onChangeText={email => this.setState({email})}
                value={this.state.email}
              />
              <Icon
                name="user"
                size={24}
                style={{position: 'absolute', marginLeft: 10, marginTop: 30}}
              />
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={styles.btnLogin}
              onPress={this.handleForgot}>
              <Text style={{fontSize: 24, color: '#fff'}}>
                Lấy lại mật khẩu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo_container: {
    alignItems: 'center',
    marginTop: -50,
  },
  input: {
    width: width - 45,
    height: 45,
    borderRadius: 25,
    fontSize: 16,
    paddingLeft: 40,
    backgroundColor: '#fff',
    marginTop: 20,
    borderColor: '#ccc',
    borderWidth: 4,
  },
  btnLogin: {
    width: width - 200,
    height: 45,
    borderRadius: 25,
    backgroundColor: coffee_color,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
