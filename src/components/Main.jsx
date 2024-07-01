import React, { useState, useEffect } from "react";
import { Text, View, Button, TouchableOpacity,TextInput } from "react-native";
import List from "./List";

//import BluetoothScanner from "./BluetoothScanner"

function Main() {
  const [currentTime, setCurrentTime] = useState(0); // Tiempo en segundos
  const [isActive, setIsActive] = useState(false); // Estado del temporizador
  const [showList, setShowList] = useState(false); // Estado para mostrar List
  const [scannedValue, setScannedValue] = useState(""); // Estado para almacenar el valor escaneado


  useEffect(() => {
    // Función para actualizar el tiempo cada segundo
    const interval = setInterval(() => {
      if (isActive) {
        setCurrentTime((prevTime) => prevTime + 1);
      }
    }, 1000);

    // Limpieza del intervalo cuando el componente se desmonta o cuando isActive cambia a false
    return () => clearInterval(interval);
  }, [isActive]);

  const incrementCount = () => {
 
    // Alterna el estado de isActive al hacer clic en el botón
    generateRandomNumericCode()
    
   

    // Mostrar List cuando se inicia el temporizador
    if (!isActive  ) {
  

        setShowList(true);
    
    } else {
      // Ocultar List cuando se detiene el temporizador
      setShowList(false);
    }
  };

  const resetTimer = () => {
    // Detiene el temporizador y reinicia el tiempo y el contador
    setIsActive(false);
    setCurrentTime(0);
    // Ocultar List al reiniciar
    setShowList(false);
    setScannedValue("")
  };

  const formatTime = (timeInSeconds) => {
    // Función para formatear el tiempo en HH:MM:SS
    const hours = Math.floor(timeInSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const generateRandomNumericCode = () => {
    let code = '';
    for (let i = 0; i < 12; i++) {
      const randomNumber = Math.floor(Math.random() * 10); // Genera un número aleatorio del 0 al 9
      code += randomNumber.toString();
    }
    setScannedValue(code)
    setIsActive(!isActive);
    return code;
  };
  
  // Obtiene el tiempo aleatorio entre 10 y 25 minutos en milésimas de segundo

  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 30,
          alignItems: "center",
        }}
      >
        <Text style={{ padding: 10, fontSize: 24, fontWeight: "bold" }}>
          Filling Room Station
        </Text>
       
        <View
          style={{
            flexDirection: "row",
            width: 100,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              marginTop: 40,
              marginRight: 10,
              backgroundColor: "blue",
              padding: 10,
              borderRadius: 5,
            }}
            onPress={incrementCount}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              {isActive ? "Stop" : "Scan"}
              
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginTop: 40,
              backgroundColor: "green",
              padding: 10,
              borderRadius: 5,
            }}
            onPress={resetTimer}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              Reset
            </Text>
          </TouchableOpacity>
         
        </View>
       
        <View>
          <TextInput 
           keyboardType="text"
           placeholder="scanned code"
           value={scannedValue}
           onChangeText={(text) => setScannedValue(text)}
           />
        </View>
        {isActive && (
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
            Time: {formatTime(currentTime)}
          </Text>
        )}
      </View>
      {/* Renderiza List solo si showList es true */}
      {showList && isActive && <List />}
     {/*  <BluetoothScanner/> */}
    
    </>
  );
}

export default Main;
