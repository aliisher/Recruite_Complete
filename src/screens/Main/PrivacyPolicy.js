import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import URL from '../../tools/URL';

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        source={{
          uri: 'https://recruitme.pk/privacy-policy',
        }}
      />
    </SafeAreaView>
  );
}
