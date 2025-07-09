import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import Navigator from './src/navigatioin';
import NotificationController from './NotificationController.android';

export default function AwesomeProject() {
  console.log('object')
  return (
    <>
      <Navigator />
      <NotificationController />
    </>
  );
}
