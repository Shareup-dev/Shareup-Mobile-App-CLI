import React from 'react';
import {StyleSheet, Text, SafeAreaView, StatusBar} from 'react-native';
import AuthNavigation from './src/components/StackNavigation/AuthNavigation';

export default function App(props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle={'dark-content'} />
      <AuthNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});
