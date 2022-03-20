import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';

import Icon from './Icon';
import colors from '../config/colors';

/**
 * @param {*} onPickFile: required
 * @param {*} onCapture: required
 * @param {*} onRevertCamera: required
 */
export default function CameraBottomActions({
  onPickFile,
  onCapture,
  onRevertCamera,
  mode,
  setMode,
}) {
  const styles = StyleSheet.create({
    modeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
      backgroundColor: '#000',
      paddingVertical: 5,
      position: 'absolute',
      bottom: 0,
    },
    modeActive: {
      fontWeight: '700',
      fontSize: 15,
    },
    modeText: {
      color: '#fdfdfd',
      fontSize: 14,
    },
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      position: 'absolute',
      bottom: 40,
      zIndex: 1,
      paddingHorizontal: 20,
      height: 120,
    },
    bottomBtn: {},
    captureButton: {
      height: 86,
      width: 86,
      backgroundColor: mode === 'video' ? 'darkred' : colors.white,
      borderRadius: 60,
      borderWidth: 5,
      borderColor: colors.LightGray,
    },
  });

  return (
    <>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View style={styles.container}>
        <TouchableOpacity onPress={onPickFile} style={styles.bottomBtn}>
          <Icon type={'FontAwesome'} name={'file-photo-o'} size={64} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={onCapture}></TouchableOpacity>

        <TouchableOpacity onPress={onRevertCamera} style={styles.bottomBtn}>
          <Icon type={'Ionicons'} name={'camera-reverse-outline'} size={64} />
        </TouchableOpacity>
      </View>

      <View style={styles.modeContainer}>
        <TouchableOpacity onPress={() => setMode('photo')}>
          <Text
            style={[styles.modeText, mode === 'photo' && styles.modeActive]}>
            Photo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMode('video')}>
          <Text
            style={[styles.modeText, mode === 'video' && styles.modeActive]}>
            Video
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
