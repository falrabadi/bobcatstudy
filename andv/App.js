import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <>
    <View style={styles.container}></View>
    <WebView source={{ uri: 'http://ohiostudy.ddns.net/' }} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 45,
  },
});
