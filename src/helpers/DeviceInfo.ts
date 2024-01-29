import { UniqueIdHelper } from '@churchapps/helpers';
import RNDI from 'react-native-device-info';
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DeviceInfoInterface {
  appName?: string;
  deviceName?: string;
  buildId?: string;
  buildNumber?: string;
  brand?: string;
  device?: string;
  deviceId?: string;
  deviceType?: string;
  hardware?: string;
  manufacturer?: string;
  version?: string;
}

export class DeviceInfo {

  private static current:DeviceInfoInterface = null;

  static async getDeviceInfo() {
    if (this.current === null) {
      const details: DeviceInfoInterface = {}
      details.appName = RNDI.getApplicationName();
      details.deviceName = await RNDI.getDeviceName();
      details.buildId = await RNDI.getBuildId();
      details.buildNumber = RNDI.getBuildNumber();
      details.brand = RNDI.getBrand();
      details.device = await RNDI.getDevice();
      details.deviceId = await AsyncStorage.getItem("deviceId");
      if (!details.deviceId) {
        details.deviceId = UniqueIdHelper.shortId();
        AsyncStorage.setItem("deviceId", details.deviceId);
      }
      details.deviceType = RNDI.getDeviceType();
      details.hardware = await RNDI.getHardware();
      details.manufacturer = await RNDI.getManufacturer();
      details.version = RNDI.getReadableVersion();
      this.current = details;
    }
    
    return this.current;
  }

};
