import messaging from '@react-native-firebase/messaging';
import { DeviceEventEmitter, PermissionsAndroid, Platform } from 'react-native';
import { DeviceInfo } from './DeviceInfo';
import { ApiHelper, ChurchInterface, LoginUserChurchInterface, UserHelper } from '@churchapps/helpers';
import AsyncStorage from "@react-native-async-storage/async-storage";

export class PushNotificationHelper {

  static fcmToken: string = "";

  static async registerUserDevice(appName:string) {
    const fcmToken = await this.getFcmToken();
    const deviceInfo = await DeviceInfo.getDeviceInfo();
    const data = { appName, deviceId:deviceInfo.deviceId, fcmToken, label: deviceInfo.deviceName, deviceInfo:JSON.stringify(deviceInfo) }
    if (ApiHelper.isAuthenticated) ApiHelper.post("/devices/register", data, "MessagingApi").then(async(data)=>{ console.log("register device api response ====>", data) });
    else ApiHelper.postAnonymous("/devices/register", data, "MessagingApi").then(async(data)=>{ console.log("register device api response ====>", data) });
  }

  static async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
      PushNotificationHelper.getFcmToken();
    }
  }
  
  static async NotificationPermissionAndroid () {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      } catch (error) { }
    }
  };

  static async getFcmToken() {
    if (!this.fcmToken) {
      this.fcmToken = await AsyncStorage.getItem("fcmToken");
      if (!this.fcmToken) {
        try {
        this.fcmToken = await messaging().getToken();
        if (this.fcmToken) AsyncStorage.setItem("fcmToken", this.fcmToken);
        } catch (error) {
          console.log(error, "fcm token not created")
        }
      }
    }
    return this.fcmToken;
  }

  static async NotificationListener() {
      messaging().onNotificationOpenedApp((remoteMessage:any) => {
        console.log('Notification caused app to open from background state:', JSON.stringify(remoteMessage.notification));
      });

      messaging().getInitialNotification().then((remoteMessage:any) => {
        if (remoteMessage) console.log('Notification caused app to open from quit state:', JSON.stringify(remoteMessage.notification)); 
      });

      messaging().onMessage(async (remoteMessage:any) => {
        console.log("notification on forground state.......", JSON.stringify(remoteMessage))
        const badge = JSON.stringify(remoteMessage);
        pushEventBus.emit("badge", badge)
      });
  }
}


export const pushEventBus = {
  emit(eventName: string, data?: any) {
    DeviceEventEmitter.emit(eventName, data);
  },
  addListener(eventName: string, callback: (data?: any) => void) {
    DeviceEventEmitter.addListener(eventName, callback);
  },
  removeListener(eventName: string) {
    DeviceEventEmitter.removeAllListeners(eventName );
  },
};
