import { DeviceEventEmitter } from 'react-native';
import { ErrorUtils } from 'react-native';

export class ErrorHelper {

  static logEvent(eventType: string, source: string, message: string) {
    console.log(`Event: ${eventType}`, { source, message });
  }

  static logError(source: string, error: any) {
    const message = error.message || error;
    console.error(`Error from ${source}:`, message);
  }

  static onJavaError(event: any) {
    ErrorHelper.logError(event.source, event.message);
  }

  static onJavaEvent(event: any) {
    ErrorHelper.logEvent(event.eventType, event.source, event.message);
  }

  static init() {
    ErrorHelper.initJava();
    ErrorHelper.initUnhandled();
  }

  static initJava() {
    DeviceEventEmitter.addListener('onError', ErrorHelper.onJavaError);
    DeviceEventEmitter.addListener('onEvent', ErrorHelper.onJavaEvent);
  }

  static initUnhandled() {
    // Set up global error handler
    const originalErrorHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      ErrorHelper.logError("Unhandled Javascript", error.toString());
      if (originalErrorHandler) {
        originalErrorHandler(error, isFatal);
      }
    });

    // For native errors, we'll use the existing DeviceEventEmitter
    DeviceEventEmitter.addListener('onError', (error) => {
      ErrorHelper.logError("Unhandled Native", error);
    });
  }

}
