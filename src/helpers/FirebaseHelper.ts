// import analytics from '@react-native-firebase/analytics';
import * as Analytics from 'expo-firebase-analytics';
import { Platform } from 'react-native';

export class FirebaseHelper {
  

  static async addAnalyticsEvent(eventName : string, dataBody : any) {
    await Analytics.logEvent(eventName, dataBody);
  }

  static async addOpenScreenEvent(screenName: string){
    await Analytics.logEvent("page_view", {
      id: Date.now(),
      device : Platform.OS,
      page: screenName,
    });
  }

}