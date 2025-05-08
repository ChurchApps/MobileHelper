// import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { DeviceEventEmitter } from 'react-native';
import { DeviceInfo } from './DeviceInfo';
import { ApiHelper } from '@churchapps/helpers';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from 'expo-device';
import { EventEmitter } from 'events';

// export const pushEventBus = new EventEmitter();
export class PushNotificationHelper {

  static fcmToken: string = "";

  static async registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      console.log("Must use a physical device for Push Notifications");
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log("Push notification permission not granted");
      return null;
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync();
      return tokenData.data;
    } catch (error) {
      console.error("Error getting Expo push token:", error);
      return null;
    }
  }

  static async NotificationListener() {
    console.log('Setting up notification listeners...');

    // Foreground notification handler
    Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received in foreground:", JSON.stringify(notification));
      pushEventBus.emit("badge", JSON.stringify(notification));
    });

    // Handle when the user taps on the notification from background state
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notification opened from background:", JSON.stringify(response.notification));
    });

    // Handle notifications from quit state
    const lastNotification = await Notifications.getLastNotificationResponseAsync();
    if (lastNotification) {
      console.log("Notification caused app to open from quit state:", JSON.stringify(lastNotification.notification));
    }
  }
}

  // static async registerBackgroundHandler(func: (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => void) {
  //   messaging.setBackgroundMessageHandler(async remoteMessage => {
  //     func(remoteMessage);
  //   });
  // }

  // static async registerUserDevice(appName:string) {
  //   const fcmToken = await this.getFcmToken();
  //   const deviceInfo = await DeviceInfo.getDeviceInfo();
  //   const data = { appName, deviceId:deviceInfo.deviceId, fcmToken, label: deviceInfo.deviceName, deviceInfo:JSON.stringify(deviceInfo) }
  //   if (ApiHelper.isAuthenticated) ApiHelper.post("/devices/register", data, "MessagingApi").then(async(data)=>{ console.log("register device api response ====>", data) });
  //   else ApiHelper.postAnonymous("/devices/register", data, "MessagingApi").then(async(data)=>{ console.log("register device api response ====>", data) });
  // }

  // static async requestUserPermission() {
  //   const authStatus = await Notifications.requestPermissionsAsync();
  //   //  messaging().requestPermission();
  //   const enabled = authStatus.status === Notifications.PermissionStatus.GRANTED;
  //   // if(Platform.OS == 'ios'){
  //   //   enabled = authStatus.ios.status === Notifications.IosAuthorizationStatus.AUTHORIZED || Notifications.IosAuthorizationStatus.PROVISIONAL;
  //   // }
  //   // else if(Platform.OS == 'android'){
  //   //   enabled = authStatus.status === Notifications.PermissionStatus.GRANTED
  //   // }
  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //     PushNotificationHelper.getFcmToken();
  //   }
  // }
  
  // static async NotificationPermissionAndroid () {
  //   if (Platform.OS === 'android') {
  //     try {
  //       await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  //     } catch (error) { }
  //   }
  // };

  // static async getFcmToken() {
  //   if (!this.fcmToken) {
  //     this.fcmToken = await AsyncStorage.getItem("fcmToken");
  //     if (!this.fcmToken || this.fcmToken == null) {
  //       try {
  //       this.fcmToken = (await Notifications.getExpoPushTokenAsync()).data;
  //       if (this.fcmToken) AsyncStorage.setItem("fcmToken", this.fcmToken);
  //       } catch (error) {
  //         console.log(error, "fcm token not created")
  //       }
  //     }
  //   }
  //   return this.fcmToken;
  // }

  // static async NotificationListener() {
  //   console.log('Setting up notification listeners...');

  //   // Foreground notification handler
  //   Notifications.addNotificationReceivedListener(notification => {
  //     console.log("Notification received in foreground:", JSON.stringify(notification));
  //     pushEventBus.emit("badge", JSON.stringify(notification));
  //   });

  //   // Handle when the user taps on the notification from background state
  //   Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log("Notification opened from background:", JSON.stringify(response.notification));
  //   });

  //   // Handle notifications from quit state
  //   const lastNotification = await Notifications.getLastNotificationResponseAsync();
  //   if (lastNotification) {
  //     console.log("Notification caused app to open from quit state:", JSON.stringify(lastNotification.notification));
  //   }
  // }
// }

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
