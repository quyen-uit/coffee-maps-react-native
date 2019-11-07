/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import MapScreen from './src/components/screens/MapScreen';
import ProfileScreen from './src/components/screens/ProfileScreen';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';

const TabMaterialNavigator = createMaterialTopTabNavigator(
  {
    //RouteConfigs
    Maps: {
      screen: MapScreen,
    },
    Profile: {
      screen: ProfileScreen,
    },
  },
  {
    // MaterialBottomTabNavigatorConfig
    tabBarPosition: 'bottom',
    initialRouteName: 'Maps',
    tabBarOptions: {
      showIcon: true,
      activeTintColor: '#ff792c',
      pressColor: '#F3B473',
      inactiveTintColor: '#000000',
      style: {
        borderTopColor: '#ff792c',
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
const AppContainer = createAppContainer(TabMaterialNavigator);
const App: () => React$Node = () => {
  return <AppContainer />;
};

export default App;
