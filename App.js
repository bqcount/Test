import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Main from "./src/components/Main";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SettingsDrawer from "./src/components/SettingsDrawer";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <SettingsDrawer />
    </NavigationContainer>
  );
}

export default App;