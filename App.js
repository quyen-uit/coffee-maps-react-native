/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import DemoMaps from './src/components/screens/demo_maps';
import SearchScreen from './src/components/screens/SearchScreen';
import React from 'react';
import MapScreen from './src/components/screens/MapScreen';
import ProfileScreen from './src/components/screens/ProfileScreen';
import NewsScreen from './src/components/screens/NewsScreen';
import ListScreen from './src/components/screens/ListScreen';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import CoffeeStoreScreen from './src/components/screens/CoffeeStoreScreen';
import {coffee_color} from './src/color';
import LoginScreen from './src/components/screens/LoginScreen';
import SignUpScreen from './src/components/screens/SignUpScreen';
import LoadingScreen from './src/components/screens/LoadingScreen';
import ForgotPasswordScreen from './src/components/screens/ForgotPasswordScreen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import OptionsPicker from './src/components/screens/OptionsPicker';
const MapsStack = createStackNavigator({
  Maps: MapScreen,
});
const NewsStack = createStackNavigator({
  News: {screen: NewsScreen},
});
const ListStack = createStackNavigator({
  List: ListScreen,
});
const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});
MapsStack.navigationOptions = {
  tabBarLabel: 'Bản đồ',
  tabBarIcon: ({tintColor}) => (
    <Icon name="map-marked-alt" size={20} color={tintColor} />
  ),
};
NewsStack.navigationOptions = {
  tabBarLabel: 'Tin tức',
  tabBarIcon: ({tintColor, focused}) => (
    <Icon name="newspaper" size={20} color={tintColor} />
  ),
};
ListStack.navigationOptions = {
  tabBarLabel: 'Yêu thích',
  tabBarIcon: ({tintColor, focused}) => (
    <Icon name="list-ul" size={20} color={tintColor} />
  ),
};
ProfileStack.navigationOptions = {
  tabBarLabel: 'Tài khoản',
  tabBarIcon: ({tintColor, focused}) => (
    <Icon name="address-card" size={20} color={tintColor} />
  ),
};
const TabMaterialNavigator = createMaterialTopTabNavigator(
  {
    //RouteConfigs
    Maps: MapsStack,
    News: NewsStack,
    List: ListStack,
    Profile: ProfileStack,
  },
  {
    // MaterialBottomTabNavigatorConfig
    tabBarPosition: 'bottom',
    initialRouteName: 'Maps',
    tabBarOptions: {
      showIcon: true,
      activeTintColor: coffee_color,
      pressColor: '#F3B473',
      inactiveTintColor: '#000000',
      style: {
        borderTopColor: coffee_color,
        borderTopWidth: 0.8,
        backgroundColor: '#ffffff',
      },
      tabStyle: {
        borderTopColor: '#000000',
      },
      iconStyle: {
        marginTop: -5,
        marginBottom: -2,
      },
      labelStyle: {
        fontSize: 10,
        marginBottom: -5,
      },
    },
  },
);
TabMaterialNavigator.navigationOptions = {
  // Hide the header from AppNavigator stack
  headerShown: false,
};
const StackNavigator = createStackNavigator({
  MapScreen: {
    screen: TabMaterialNavigator,
  },
  DetailStore: {
    screen: CoffeeStoreScreen,
  },
  Search: {
    screen: SearchScreen,
  },
  Option: OptionsPicker,
});
StackNavigator.navigationOptions = {
  // Hide the header from AppNavigator stack
  tabBarVisible: false,
};
const AuthStack = createStackNavigator(
  {
    Login: LoginScreen,
    Register: SignUpScreen,
    Forgot: ForgotPasswordScreen,
  },
  {
    navigationOptions: ({navigation}) => ({
      headerStyle: {
        height: 100,
      },
    }),
  },
);
const SwitchNav = createSwitchNavigator(
  {
    Loading: LoadingScreen,
    App: StackNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Loading',
  },
);
const AppContainer = createAppContainer(SwitchNav);
const App: () => React$Node = () => {
  return <AppContainer />;
};

export default App;
