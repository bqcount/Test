import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import odooService from "../service/odooService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState({});
  const [uid, setUid] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedUrl = await SecureStore.getItemAsync('url');
        const storedDbName = await SecureStore.getItemAsync('dbName');
        const storedUsername = await SecureStore.getItemAsync('username');
        const storedPassword = await SecureStore.getItemAsync('password');

        if (storedUrl && storedDbName && storedUsername && storedPassword) {
          const uid = await odooService.authenticate(storedUrl, storedDbName, storedUsername, storedPassword);
          if (uid) {
            setIsAuthenticated(true);
            setConnectionDetails({ url: storedUrl, dbName: storedDbName, username: storedUsername, password: storedPassword });
            setUid(uid);
          }
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error al cargar los datos almacenados:', error);
        setIsInitialized(true);
      }
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
  
        // Guardar los datos y luego obtener el valor encriptado para verificar
        await SecureStore.setItemAsync('url', url);
        await SecureStore.setItemAsync('dbName', dbName);
        await SecureStore.setItemAsync('username', username);
        await SecureStore.setItemAsync('password', password);
  
      
        return uid;
      } else {
        throw new Error('La autenticación con Odoo falló. Verifica tus credenciales.');
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, connectionDetails, uid }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
