import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import List from "./List";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import odooService from "../service/odooService";
import { useAuth } from "../context/AuthContext";

function Main() {
  const navigation = useNavigation();
  const { isAuthenticated, connectionDetails, uid } = useAuth();
  const [currentTime, setCurrentTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showList, setShowList] = useState(false);
  const [scannedValue, setScannedValue] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        setCurrentTime((prevTime) => prevTime + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const fetchedOrders = async () => {
    if (!uid || !isAuthenticated) {
      Alert.alert("Error", "No estás autenticado. Por favor, autentícate primero.");
      return [];
    }

    const orders = await odooService.getSaleOrdersSent(connectionDetails.url, connectionDetails.dbName, uid, connectionDetails.password);
    return orders;
  }

  const incrementCount = async () => {
    generateRandomNumericCode();
    if (!isActive && isAuthenticated) {
      const fetched = await fetchedOrders();
      setOrders(fetched);
      setShowList(true);
    } else {
      setShowList(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setCurrentTime(0);
    setShowList(false);
    setScannedValue("");
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((timeInSeconds % 3600) / 60).toString().padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const generateRandomNumericCode = () => {
    let code = '';
    for (let i = 0; i < 12; i++) {
      const randomNumber = Math.floor(Math.random() * 10);
      code += randomNumber.toString();
    }
    setScannedValue(code);
    setIsActive(!isActive);
    return code;
  };

  return (
    <>
      <View style={styles.viewSettings}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <MaterialIcons name="settings" size={30} color="grey" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Filling Room Station</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.scanButton} onPress={incrementCount}>
            <Text style={styles.buttonText}>{isActive ? "Stop" : "Scan"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TextInput 
            style={styles.input}
            keyboardType="text"
            placeholder="scanned code"
            value={scannedValue}
            onChangeText={(text) => setScannedValue(text)}
          />
        </View>
        {isActive && (
          <Text style={styles.timerText}>
            Time: {formatTime(currentTime)}
          </Text>
        )}
      </View>
      {showList && isActive && <List orders={orders} />}
    </>
  );
}

const styles = StyleSheet.create({
  viewSettings: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginEnd: 5,
    marginTop: 25,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    marginTop: 30,
    alignItems: "center",
  },
  title: {
    padding: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    width: 100,
    justifyContent: "space-between",
  },
  scanButton: {
    marginTop: 40,
    marginRight: 10,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  resetButton: {
    marginTop: 40,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  input: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    width: 200,
    textAlign: "center",
  },
  timerText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Main;
