import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';

export default function TermsCondition() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        source={{
          uri: 'https://recruitme.pk/term-condition',
        }}
      />
    </SafeAreaView>
  );
}
