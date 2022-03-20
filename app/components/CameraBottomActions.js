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
  capturing = false,
}) {
  const styles = StyleSheet.create({
    modeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
      backgroundColor: '#000',
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
    bottomBtn: {
      paddingVertical: 10,
      flex: 1,
      alignItems: 'center',
    },
    captureButtonContainer: {
      height: 86,
      width: 86,
      borderRadius: 60,
      backgroundColor: colors.LightGray,
      justifyContent: 'center',
      alignItems: 'center',
    },
    captureButton: {
      backgroundColor: mode === 'video' ? 'darkred' : colors.white,
      borderRadius: capturing ? 5 : 60,
      width: capturing ? 50 : 76,
      height: capturing ? 50 : 76,
    },
    recordingText: {
      fontWeight: '500',
      fontSize: 17,
      color: '#fdfdfd',
    },
    recordingIcon: {
      width: 15,
      height: 15,
      borderRadius: 10,
      backgroundColor: 'crimson',
      marginHorizontal: 10,
      marginVertical: 10,
    },
    recordingContainer: {
      alignItems: 'center',
      backgroundColor: '#000',
      flexDirection: 'row',
    },
  });

  return (
    <>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View style={styles.recordingContainer}>
        <View style={styles.recordingIcon} />
        <Text style={styles.recordingText}>00.00</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity onPress={onPickFile}>
          <Icon type={'FontAwesome'} name={'file-photo-o'} size={64} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButtonContainer}
          onPress={onCapture}>
          <View style={styles.captureButton} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onRevertCamera}>
          <Icon type={'Ionicons'} name={'camera-reverse-outline'} size={64} />
        </TouchableOpacity>
      </View>

      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => setMode('photo')}>
          <Text
            style={[styles.modeText, mode === 'photo' && styles.modeActive]}>
            Photo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode('video')}
          style={styles.bottomBtn}>
          <Text
            style={[styles.modeText, mode === 'video' && styles.modeActive]}>
            Video
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
