import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';

import colors from '../config/colors';

import {RNCamera} from 'react-native-camera';

export default function AddStoryScreen({navigation}) {
  return (
    <View style={styles.container}>
      <RNCamera />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  },
  storyImgViewer: {
    flex: 1,
  },
  forwardArrow: {
    position: 'absolute',
    bottom: 50,
    right: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: colors.white,
  },
});
