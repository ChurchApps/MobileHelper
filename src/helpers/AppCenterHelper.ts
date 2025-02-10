
import * as Analytics from 'expo-firebase-analytics';
import { Platform } from 'react-native';
import packageJson from '../../package.json';

export class FirebaseAnalyticsHelper {
  static appendedData: Record<string, any> = {};

  static init(data: Record<string, any>) {
    this.appendedData = data;
  }

  static async trackEvent(name: string, data: Record<string, any> = {}) {
    const props: Record<string, any> = { ...data, ...this.appendedData };
    props['appVersion'] = packageJson.version;
    
    try {
      await Analytics.logEvent(name, props);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }
}
