import * as Notifications from 'expo-notifications';
import { StyleConstants } from "./StyleConstants";
import * as Haptics from 'expo-haptics';

export class Utils {

  public static snackBar(message: string) {
    // For now, we'll just use haptic feedback since we're in a shared library
    // The main app can implement its own notification system
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log(message);
  }

  static showMessage(message: string, duration: number = 3000) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log(message);
  }

}
