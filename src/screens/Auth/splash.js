import React, {useEffect, useState} from 'react';
import {View, Text, Image, ImageBackground} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash({navigation}) {
  const gettoken = async () => {
    const Auth = JSON.parse(await AsyncStorage.getItem('User'));
    const otp = JSON.parse(await AsyncStorage.getItem('OTP'));
    setTimeout(() => {
      if (Auth != null && otp == true) {
        console.log('Auth', Auth);
        console.log('Otp', otp);
        navigation.replace('Drawer', {
          code: 10,
          name: Auth.name,
        });
        // navigation.replace('home')
      } else navigation.replace('Login');
    }, 3000);
  };

  useEffect(() => {
    gettoken();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/recuritsplash.gif')}
      style={{backgroundColor: 'white', flex: 1}}></ImageBackground>
  );
}
