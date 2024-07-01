import React, { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native';
import BleManager from 'react-native-ble-plx';

const Divices = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const subscription = BleManager.DeviceScan.onDeviceDiscovered(device => {
      setDevices(prevDevices => [...prevDevices, device]);
    });

    BleManager.startDeviceScan(null, null, (error) => {
      if (error) {
        console.error('Error starting scan:', error);
      }
    });

    return () => {
      BleManager.stopDeviceScan();
      subscription.remove();
    };
  }, []);

  return (
    
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Dispositivos Bluetooth Cercanos:</Text>
      {devices.map((device, index) => (
        <Text key={index}>{device.name || 'Dispositivo Desconocido'}</Text>
      ))}
    </View>
  );
};

export default Divices;
