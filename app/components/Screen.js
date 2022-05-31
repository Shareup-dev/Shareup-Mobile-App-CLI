import React from 'react';
import {StyleSheet, KeyboardAvoidingView, Platform,SafeAreaView} from 'react-native';
import colors from '../config/colors';


export default function Screen({children, style}) {
  return (
   
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : "height"}
      style={[styles.view, style]}
      keyboardVerticalOffset={45}
      >
      {children}
    </KeyboardAvoidingView>
   
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 0,
    // paddingTop: StatusBar.currentHeight,
    // to add a top padding same as the hight of the statusbar hight of any device
    // and it will not add extra padding with SafeAreaView in ios
    flex: 1,
  },
  view: {
    padding: 0,
    flex: 1,
    backgroundColor: colors.white,
  },
});
