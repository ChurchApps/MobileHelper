import analytics from '@react-native-firebase/analytics';
import Constants from 'expo-constants';

export class FirebaseAnalyticsHelper {
  static appendedData: Record<string, any> = {};

  static init(data: Record<string, any>) {
    this.appendedData = data;
  }

  static async trackEvent(name: string, data: Record<string, any> = {}) {
    const props: Record<string, any> = { ...data, ...this.appendedData };
    const appVersion = Constants.expoConfig?.version ?? 'unknown';
    props['appVersion'] = appVersion;

    try {
      await analytics().logEvent(name, props);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }
}
