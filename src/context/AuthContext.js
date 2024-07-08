import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import odooService from "../service/odooService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState({});
  const [uid, setUid] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
      const loadStoredData = async () => {
      const storedUrl = await AsyncStorage.getItem('url');
      const storedDbName = await AsyncStorage.getItem('dbName');
      const storedUsername = await AsyncStorage.getItem('username');
      const storedPassword = await AsyncStorage.getItem('password');

      if (storedUrl && storedDbName && storedUsername && storedPassword) {
        const uid = await odooService.authenticate(storedUrl, storedDbName, storedUsername, storedPassword);
        if (uid) {
          setIsAuthenticated(true);
          setConnectionDetails({ url: storedUrl, dbName: storedDbName, username: storedUsername, password: storedPassword });
          setUid(uid);
        }
      }
      setIsInitialized(true);  
    };


    loadStoredData();
  }, []);

  const authenticate = async (url, dbName, username, password) => {
    try {
      const uid = await odooService.authenticate(url, dbName, username, password);
      if (uid !== null) {
        setIsAuthenticated(true);
        setConnectionDetails({ url, dbName, username, password });
        setUid(uid);

        await AsyncStorage.setItem('url', url);
        await AsyncStorage.setItem('dbName', dbName);
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', password);

        return uid;
      } else {
        throw new Error('La autenticación con Odoo falló. Verifica tus credenciales.');
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      throw error;
    }
  };

  if (!isInitialized) {
    return null;  // Show a loading indicator or splash screen while initializing
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, connectionDetails, uid }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
