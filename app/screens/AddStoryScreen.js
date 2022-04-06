import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';

import colors from '../config/colors';

import {RNCamera} from 'react-native-camera';
import CameraBottomActions from '../components/CameraBottomActions';
import CameraHeader from '../components/headers/CameraHeader';
import Icon from '../components/Icon';
import {launchImageLibrary} from 'react-native-image-picker';
import AuthContext from '../authContext';
import Video from 'react-native-video';
import storyService from '../services/story.service';
import {date} from 'yup';

export default function AddStoryScreen({navigation}) {
  let cameraRef;
  let playerRef = useRef();

  const windowWidth = Dimensions.get('screen').width;

  const {userData} = useContext(AuthContext)?.userState;

  const [isUploading, setIsUploading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [screen, setScreen] = useState('capture');
  const [mode, setMode] = useState('photo');
  const [cameraType, setCameraType] = useState('back');
  const [capturing, setCapturing] = useState(false);
  const [story, setStory] = useState({});
  const scale = useRef(new Animated.Value(0)).current;

  const [duration, setDuration] = useState(10000);

  let startTime;
  // let pauseTime;

  async function StopRecording() {
    await cameraRef.stopRecording();
    StopProgress();
    setCapturing(false);
  }

  const startProgress = () => {
    startTime = new Date().valueOf();
    Animated.timing(scale, {
      toValue: windowWidth,
      useNativeDriver: true,
      duration: duration,
    }).start(() => {
      StopProgress();
      setCapturing(false);
    });
  };

  const StopProgress = () => {
    // pauseTime = new Date().valueOf();
    // setDuration(prev => prev - (pauseTime - startTime));

    Animated.timing(scale).reset();
  };

  async function onCapture() {
    if (mode === 'photo') {
      let photo = await cameraRef.takePictureAsync({
        skipProcessing: true,
        quality: 0.5,
      });
      setStory(photo);
    } else if (mode === 'video') {
      if (capturing) {
        return StopRecording();
      }
      setCapturing(true);
      startProgress();

      const video = await cameraRef.recordAsync({
        maxDuration: 10,
        quality: RNCamera.Constants.VideoQuality['288p'],
        
      });

      setStory(video);
    }
    setScreen('view');
  }

  const imagePickHandler = async () => {
    try {
      const result = await launchImageLibrary({
        quality: 0.5,
        mediaType: 'mixed',
        durationLimit: 10,
      });

      if(result.didCancel === true){
        return;
      }
      setStory(result.assets[0]);
      setScreen('view');
    } catch (error) {
      console.error('Error reading an image', error.message);
    }
  };

  const handelRevertCamera = () => {
    setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const addStoryHandler = async () => {
    setIsUploading(true);

    let storyData = new FormData();
    
    const uniId = new Date().valueOf();
    storyData.append('stryfiles', {
      name:
        mode === 'photo'
          ? `story-image-${uniId}.jpg`
          : `story-video-${uniId}.mp4`,
      type: mode === 'photo' ? 'image/jpg' : 'video/mp4',
      uri: story.uri,
    });

    storyService
      .addStory(userData.id, storyData)
      .then(res => res)
      .catch(e => console.error(e.message))
      .finally(_ => setIsUploading(false));
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      {screen === 'capture' ? (
        <RNCamera
          style={styles.camera}
          ratio={'16:9'}
          captureAudio={true}
          ref={ref => {
            cameraRef = ref;
          }}
          type={cameraType}>
          <CameraBottomActions
            onPickFile={imagePickHandler}
            onCapture={onCapture}
            onRevertCamera={handelRevertCamera}
            mode={mode}
            capturing={capturing}
            setMode={setMode}
          />
          <Animated.View
            style={{
              backgroundColor: 'crimson',
              position: 'absolute',
              bottom: 0,
              transform: [
                {
                  scaleX: scale,
                },
              ],
              width: 2.1,
              height: 6,
            }}
          />
        </RNCamera>
      ) : (
        <View style={styles.storyImgViewer}>
          <CameraHeader
            title="Story"
            onClosePress={() => setScreen('capture')}
          />
          <View style={styles.forwardArrow}>
            <TextInput placeholder="Caption" multiline style={styles.caption} />
            <TouchableOpacity
              activeOpacity={0.6}
              disabled={isUploading}
              onPress={addStoryHandler}>
              <Icon
                type={'AntDesign'}
                color={'#333'}
                name={'arrowright'}
                size={64}
                style={{marginLeft: 5}}
              />
            </TouchableOpacity>
          </View>

          {mode === 'photo' ? (
            <Image
              source={story}
              resizeMode={'cover'}
              style={{height: '100%', width: '100%', zIndex: -10,backgroundColor:'#000'}}
            />
          ) : (
            <Video
              resizeMode={'cover'}
              style={[styles.backgroundVideo]}
              source={{uri: story.uri}}
              repeat
            />
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  caption: {
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    borderRadius: 30,
    fontSize: 18,
    width: '85%',
  },
  backgroundVideo: {
    flex: 1,
    zIndex: -5,
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  },
  storyImgViewer: {
    flex: 1,
  },
  forwardArrow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    bottom: 35,
    paddingRight: 15,
    paddingLeft: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: colors.white,
  },
});
