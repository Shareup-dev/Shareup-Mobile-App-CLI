/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
// import PushNotification from 'react-native-push-notification';
import App from './App';
import {name as appName} from './app.json';
import {Text, TextInput} from 'react-native';

// PushNotification.configure({
//   onNotification: function (notification) {
//     // notification.finish(PushNotificationIOS.FetchResult.NoData);
//   },
//   requestPermissions: Platform.OS ==="ios",
// });
if (Text.defaultProps == null) {
    Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
    TextInput.defaultProps = {};
    TextInput.defaultProps.allowFontScaling = false;
}

AppRegistry.registerComponent(appName, () => App);
