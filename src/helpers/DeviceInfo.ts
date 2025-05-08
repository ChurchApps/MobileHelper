import { UniqueIdHelper } from '@churchapps/helpers';
// import RNDI from 'react-native-device-info';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RNDI from 'expo-device';
import  Constants  from 'expo-constants';
import * as Application from "expo-application";

export interface DeviceInfoInterface {
  appName?: string;
  deviceName?: string;
  buildId?: string;
  buildNumber?: string;
  brand?: string;
  device?: string;
  deviceId?: string;
  deviceType?: RNDI.DeviceType;
  hardware?: string;
  manufacturer?: string;
  version?: string;
}

export class DeviceInfo {

  private static current:DeviceInfoInterface = null;

  static async getDeviceInfo() {
    if (this.current === null) {
      const details: DeviceInfoInterface = {}
  
      details.appName = Constants.manifest?.name ?? "Unknown"; // App Name
      details.deviceName = RNDI.deviceName ?? "Unknown"; // Device Name
      details.buildId = Constants.nativeBuildVersion ?? "Unknown"; // Build ID
      details.buildNumber = Constants.manifest?.version ?? "Unknown"; // Build Number
      details.brand = RNDI.brand ?? "Unknown"; // Device Brand
      details.device = RNDI.modelName ?? "Unknown"; // Device Model
      details.deviceId = await AsyncStorage.getItem("deviceId");

      if (!details.deviceId) {
        details.deviceId = Application.getAndroidId() ?? "Unknown";
        await AsyncStorage.setItem("deviceId", details.deviceId);
      }

      details.deviceType = RNDI.deviceType ?? RNDI.DeviceType.UNKNOWN; // Device Type
      details.hardware = "Unknown"; // Not available in Expo
      details.manufacturer = RNDI.manufacturer ?? "Unknown"; // Manufacturer
      details.version = Constants.expoVersion ?? "Unknown";
      this.current = details;
    }
    
    return this.current;
  }

};
