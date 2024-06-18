import React, { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";
import List from "./List";

function Main() {
  const [currentTime, setCurrentTime] = useState(0); // Tiempo en segundos
  const [isActive, setIsActive] = useState(false); // Estado del temporizador
  const [count, setCount] = useState(0); // Contador de clics en el botón
  const [isEven, setIsEven] = useState(false); // Indica si count es par o impar
  const [showList, setShowList] = useState(false); // Estado para mostrar List

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
    // Incrementa el contador de clics y determina si es par o impar
    const newCount = count + 1;
    setCount(newCount);
    setIsEven(newCount % 2 === 0);

    // Alterna el estado de isActive al hacer clic en el botón
    setIsActive(!isActive);

    // Mostrar List cuando se inicia el temporizador
    if (!isActive) {
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
    setCount(0);
    setIsEven(false);

    // Ocultar List al reiniciar
    setShowList(false);
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
        <Text style={{ padding: 10,fontSize:24,fontWeight:"bold" }}>Filling Room Station</Text>
        <View style={{ flexDirection:"row",width:100,justifyContent:"space-between"}}>

        <Button
          style={{ marginTop: 10 }}
          title={isActive ? "Stop" : "Scan"}
          onPress={incrementCount}
        />
        <Button style={{ marginTop: 40 }} title="Reset" onPress={resetTimer} />
        </View>

        {isActive && (
          <Text style={{ marginTop: 10 ,fontSize:18,fontWeight:"bold"}}>Time: {formatTime(currentTime)}</Text>
        )}
      </View>
      {/* Renderiza List solo si showList es true */}
      {showList && isActive && <List />}
    </>
  );
}

export default Main;
