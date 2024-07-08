import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Main from "./src/components/Main";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SettingsDrawer from "./src/components/SettingsDrawer";
import { AuthProvider } from "./src/context/AuthContext";

const Stack = createStackNavigator();

function App() {
  return (
  <AuthProvider>
    <NavigationContainer>
      <SettingsDrawer />
    </NavigationContainer>
  </AuthProvider>
  );
}

export default App;