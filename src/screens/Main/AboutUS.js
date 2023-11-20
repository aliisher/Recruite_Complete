import React, {useEffect} from 'react';
import {View, Text, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';

export default function AboutUS(props) {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () =>
      handleBackButtonClick(),
    );
  }, []);
  const handleBackButtonClick = () => {
    props.navigation.goBack(null);

    return true;
  };
  return (
    <View>
      <WebView source={{uri: 'https://reactnative.dev/'}} />;
    </View>
  );
}
