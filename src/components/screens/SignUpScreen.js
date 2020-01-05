/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from 'react-native';
import {coffee_color} from '../../color';
import Icon from 'react-native-vector-icons/FontAwesome5';
const {width, height} = Dimensions.get('window');
import * as firebase from 'firebase';
export default class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Đăng kí',
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
      name: null,
      press: false,
      email: '',
      password: '',
      retypePass: '',
      errorMessage: null,
      loading: false,
    };
  }
  handleSignUp = () => {
    if (this.state.password != this.state.retypePass) {
      alert('Sai pass');
      return;
    }

    if (
      this.state.name == '' ||
      this.state.email == '' ||
      this.state.password == '' ||
      this.state.retypePass == ''
    ) {
      alert('Thiếu thông tin!');
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(userCredentials => {
        firebase
          .database()
          .ref('users/' + userCredentials.user.uid)
          .set({
            name: this.state.name,
            avatar:
              'https://firebasestorage.googleapis.com/v0/b/coffeemaps-1571054120730.appspot.com/o/avatar_default.png?alt=media&token=7204d055-2628-49f6-a080-2697f82d0ed1',
          });
        firebase.auth().currentUser.sendEmailVerification();
        return userCredentials.user.updateProfile({
          displayName: this.state.name,
        });
      })
      .catch(error => {
        this.setState({errorMessage: error.message});
        this.setState({loading: false});
      });
    this.setState({loading: true});
  };
  componentDidMount() {
    this.setState({loading: false});
  }
  showPass = () => {
    if (this.state.press == true) this.setState({showPass: true, press: false});
    else this.setState({showPass: false, press: true});
  };
  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <View>
            <Text>Chờ tí ...</Text>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <View style={styles.logo_container}>
                <Image
                  source={require('../../assets/icon.png')}
                  style={{width: 100, height: 100}}
                />
                <Text
                  style={{
                    fontSize: 48,
                    fontWeight: 'bold',
                    color: coffee_color,
                  }}>
                  Coffee Maps
                </Text>
              </View>
              {this.state.errorMessage && (
                <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
              )}

              <View>
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Tên người dùng"
                    underlineColorAndroid="transparent"
                    onChangeText={name => this.setState({name})}
                    value={this.state.name}
                  />
                  <Icon
                    name="envelope"
                    size={24}
                    style={{
                      position: 'absolute',
                      marginLeft: 10,
                      marginTop: 30,
                    }}
                  />
                </View>
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
                    style={{
                      position: 'absolute',
                      marginLeft: 10,
                      marginTop: 30,
                    }}
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
                    style={{
                      position: 'absolute',
                      marginLeft: 10,
                      marginTop: 30,
                    }}
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
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập lại mật khẩu"
                    underlineColorAndroid="transparent"
                    secureTextEntry={this.state.showPass}
                    onChangeText={retypePass => this.setState({retypePass})}
                  />
                  <Icon
                    name="lock"
                    size={24}
                    style={{
                      position: 'absolute',
                      marginLeft: 10,
                      marginTop: 30,
                    }}
                  />
                </View>
              </View>
              <View style={{alignSelf: 'center'}}>
                <TouchableOpacity
                  style={styles.btnLogin}
                  onPress={this.handleSignUp}>
                  <Text style={{fontSize: 20, color: '#fff'}}>Đăng kí</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  alignSelf: 'center',
                }}>
                <Text>Đã có tài khoản? </Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Login')}>
                  <Text style={{color: '#f31', fontWeight: 'bold'}}>
                    Đăng nhập ngay.
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
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
  },
  form_container: {
    width: 1,
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
    borderWidth: 2,
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
