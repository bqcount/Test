/* import { BleManager } from 'react-native-ble-plx';
import { Platform } from 'react-native';
import Permissions from 'react-native-permissions';

class BluetoothService {
  constructor() {
    this.manager = new BleManager();
  }

  async checkBluetoothPermission() {
    if (Platform.OS === 'android') {
      const granted = await Permissions.check('bluetooth');
      if (granted === 'authorized') {
        return true;
      } else {
        const status = await Permissions.request('bluetooth');
        return status === 'authorized';
      }
    } 
    return false;
  }

  startScan(callback) {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error scanning:', error);
        return;
      }
      if (device) {
        callback(device);
      }
    });
  }

  stopScan() {
    this.manager.stopDeviceScan();
  }

  connectToDevice(deviceId) {
    return this.manager.connectToDevice(deviceId);
  }

  disconnectFromDevice(deviceId) {
    return this.manager.cancelDeviceConnection(deviceId);
  }

  async getConnectedDevices() {
    const devices = await this.manager.connectedDevices([]);
    return devices;
  }
}

const bluetoothService = new BluetoothService();
export default bluetoothService;
 */