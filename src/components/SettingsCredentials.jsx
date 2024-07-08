import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";

const SettingsCredentials = () => {
  const { authenticate } = useAuth();
  const [url, setUrl] = useState('');
  const [dbName, setDbName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSaveConfig = async () => {
    try {
      // Validación básica de los campos
      if (!url || !dbName || !username || !password) {
        throw new Error('Por favor completa todos los campos');
      }

      // Llamar al método de autenticación del contexto
      const uid = await authenticate(url, dbName, username, password);

      if (uid) {
        // Mostrar mensaje de éxito
        Alert.alert('Configuración Guardada', 'Los valores de configuración son correctos.');
      }
    } catch (error) {
      // Mostrar mensaje de error si ocurre algún problema
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.content}>
      <View style={styles.contentForm}>
        <View>
          <Text>Credentials</Text>
        </View>
        <View>
          <TextInput 
            style={styles.textInputs} 
            keyboardType="url" 
            value={url} 
            placeholder="URL" 
            onChangeText={setUrl}
          />
          <TextInput 
            style={styles.textInputs} 
            keyboardType="default" 
            value={dbName} 
            placeholder="Database Name" 
            onChangeText={setDbName}
          />
          <TextInput 
            style={styles.textInputs} 
            keyboardType="email-address" 
            value={username}
            placeholder="Username" 
            onChangeText={setUsername}
          />
          <TextInput 
            style={styles.textInputs} 
            secureTextEntry={true}  
            value={password} 
            placeholder="Password" 
            onChangeText={setPassword}
          />
        </View>
        <View>
          <TouchableOpacity
            style={{
              marginTop: 40,
              backgroundColor: "green",
              padding: 10,
              borderRadius: 5,
            }}
            onPress={handleSaveConfig}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentForm: {
    width: 300,
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  textInputs:{
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});

export default SettingsCredentials;
