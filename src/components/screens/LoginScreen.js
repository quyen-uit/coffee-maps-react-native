/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Dimensions,
  TouchableOpacity,
  Button,
} from 'react-native';
import {coffee_color} from '../../color';
import Icon from 'react-native-vector-icons/FontAwesome5';
const {width, height} = Dimensions.get('window');
import * as firebase from 'firebase';
export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Đăng nhập',
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
      showPass: true,
      press: false,
      email: '',
      password: '',
      errorMessage: null,
      isAuthenticated: false,
    };
  }
  goToSignUpScreen = () => {
    this.props.navigation.navigate('Register');
  };
  goToForgotScreen = () => {
    this.props.navigation.navigate('Forgot');
  };
  onLoginAnonymous = () => {
    firebase
      .auth()
      .signInAnonymously()
      .catch(function(error) {
        // Handle Errors here.
        var errorMessage = error.message;
        // ...
      });
  };
  handleLogin = () => {
    const {email, password} = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => this.setState({errorMessage: error.message}));
  };
  showPass = () => {
    if (this.state.press == true) this.setState({showPass: true, press: false});
    else this.setState({showPass: false, press: true});
  };
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            alignSelf: 'flex-end',
            marginRight: 10,
            flex: 1,
            marginTop: 10,
          }}>
          <TouchableOpacity onPress={this.onLoginAnonymous}>
            <Text style={{fontSize: 18}}>Bỏ qua</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logo_container}>
          <Icon name="mug-hot" size={64} color={coffee_color} />
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
            <View>
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                underlineColorAndroid="transparent"
                secureTextEntry={this.state.showPass}
                onChangeText={password => this.setState({password})}
                value={this.state.password}
              />
              <Icon
                name="lock"
                size={24}
                style={{position: 'absolute', marginLeft: 10, marginTop: 30}}
              />
              <TouchableOpacity
                onPress={this.showPass}
                style={{
                  position: 'absolute',
                  alignSelf: 'flex-end',
                  marginTop: 31,
                  paddingRight: 10,
                }}>
                <Icon
                  name={this.state.press == false ? 'eye-slash' : 'eye'}
                  size={24}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View>
              <TouchableOpacity
                style={styles.btnLogin}
                onPress={this.handleLogin}>
                <Text style={{fontSize: 24, color: '#fff'}}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={styles.btnSignUp}
                onPress={this.goToSignUpScreen}>
                <Text style={{fontSize: 24, color: coffee_color}}>Đăng kí</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Text>Quên mật khẩu ?</Text>
            <TouchableOpacity onPress={this.goToForgotScreen}>
              <Text style={{color: '#f31', fontWeight: 'bold'}}>
                {' '}
                Lấy lại mật khẩu.
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
    flex: 6,
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
    width: width - 250,
    height: 45,
    borderRadius: 25,
    backgroundColor: coffee_color,
    marginTop: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSignUp: {
    width: width - 250,
    height: 45,
    borderRadius: 25,
    borderColor: coffee_color,
    borderWidth: 2,
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
