import React from 'react';
import {StyleSheet, Text, SafeAreaView} from 'react-native';
// import AuthNavigation from './src/components/StackNavigation/AuthNavigation';
import Login from './src/Screens/Login';

export default function App(props) {
  return (
    <SafeAreaView style={styles.container}>
      <Login />
      {/* <AuthNavigation /> */}
      {/* <Text>Works</Text> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});
