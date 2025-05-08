
import Analytics from 'appcenter-analytics';

export class AppCenterHelper {

  static appendedData:any = {};

  static init(data:any) {
    this.appendedData = data;
  }

  static trackEvent(name: string, data?: any) {
    const props = (data) ? data : {}
    for (const property in this.appendedData) {
      data[property] = this.appendedData[property];
    }
    //props.church = CacheHelper.church?.name || "";
    //props.name = UserHelper.user?.displayName;
    try {
      var pkg = require('../../package.json');
      props.appVersion = pkg.version;
    } catch (e) {}
    Analytics.trackEvent(name, props);
  }

}
