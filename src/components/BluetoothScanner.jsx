/* import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import bluetoothService from '../service/bluetoothService';

const BluetoothScanner = () => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);

  useEffect(() => {
    const checkPermissionAndScan = async () => {
      const isPermissionGranted = await bluetoothService.checkBluetoothPermission();
      if (isPermissionGranted) {
        bluetoothService.startScan((device) => {
          setDevices((prevDevices) => {
            if (!prevDevices.find((d) => d.id === device.id)) {
              return [...prevDevices, device];
            }
            return prevDevices;
          });

          if (device.name === 'ProGlove Scanner') {
            bluetoothService.stopScan();
            bluetoothService.connectToDevice(device.id)
              .then((device) => {
                setConnectedDevice(device);
                console.log('Connected to', device.name);
              })
              .catch((error) => {
                console.error('Connection error', error);
              });
          }
        });
      } else {
        console.warn('Bluetooth permission not granted.');
      }
    };

    checkPermissionAndScan();

    return () => {
      bluetoothService.stopScan();
    };
  }, []);

  const disconnectDevice = () => {
    if (connectedDevice) {
      bluetoothService.disconnectFromDevice(connectedDevice.id)
        .then(() => {
          setConnectedDevice(null);
          console.log('Disconnected from device');
        })
        .catch((error) => {
          console.error('Disconnection error', error);
        });
    }
  };

  return (
    <View>
      <Text>Bluetooth Devices:</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{item.name || 'Unnamed device'} - {item.id}</Text>
        )}
      />
      {connectedDevice && (
        <>
          <Text>Connected to: {connectedDevice.name}</Text>
          <Button title="Disconnect" onPress={disconnectDevice} />
        </>
      )}
      <Button title="Scan for devices" onPress={() => bluetoothService.startScan()} />
    </View>
  );
};

export default BluetoothScanner;
 */