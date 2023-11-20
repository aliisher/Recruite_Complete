import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';
import * as RootNavigation from './src/navigatioin/RootNavigation';

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },
  onNotification: function (notification) {
    console.log('on NOTIFICATION:::::::', notification);
    if (notification.userInteraction) {
      RootNavigation.navigate('Drawer', {screen: 'Inbox'});
    }
  },
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
  },
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

const NotificationController = props => {
  const createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'FCM',
        channelName: 'Notification',
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true,
      },
      created => console.log(`createChannel returned '${created}'`),
    );
  };
  useEffect(() => {
    console.log('messaging me check kro kia ha ', messaging());
    createChannel();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // console.log('remote message', remoteMessage);
      PushNotification.localNotification({
        channelId: 'FCM',
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        subText: 'Check your Inbox',
      });
    });
    return unsubscribe;
  }, []);

  return null;
};

export default NotificationController;
