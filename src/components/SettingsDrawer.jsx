import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Main from '../components/Main';
import SettingsCredentials from '../components/SettingsCredentials';

const Drawer = createDrawerNavigator();

function SettingsDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Main">
      <Drawer.Screen name="Main" component={Main} />
      <Drawer.Screen name="SettingsCredentials" component={SettingsCredentials} />
    </Drawer.Navigator>
  );
}

export default SettingsDrawer;
