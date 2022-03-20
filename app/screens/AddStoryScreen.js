import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import colors from '../config/colors';

import {RNCamera} from 'react-native-camera';
import CameraBottomActions from '../components/CameraBottomActions';
import CameraHeader from '../components/headers/CameraHeader';
import Icon from '../components/Icon';
import {launchImageLibrary} from 'react-native-image-picker';
import AuthContext from '../authContext';
import store from '../redux/store';
import {storiesAction} from '../redux/stories';
import storyService from '../services/story.service';
import {ScrollView} from 'react-native-gesture-handler';

export default function AddStoryScreen({navigation}) {
  let cameraRef;

  const {userData} = useContext(AuthContext)?.userState;

  const [isUploading, setIsUploading] = useState(false);
  const [screen, setScreen] = useState('capture');
  const [mode, setMode] = useState('photo');
  const [cameraType, setCameraType] = useState('back');
  const [capturing, setCapturing] = useState(false);
  const [story, setStory] = useState({});

  async function onCapture() {
    if (mode === 'photo') {
      let photo = await cameraRef.takePictureAsync({
        skipProcessing: true,
        quality: 0.5,
      });
      setStory(photo);
    } else if (mode === 'video') {
      setCapturing(true);
      // let video = await cameraRef.takePictureAsync({
      //   skipProcessing: true,
      //   quality: 0.5,
      // });

      const {uri, codec = 'mp4'} = await cameraRef.current.recordAsync();
      console.info(uri);

      setStory(video);
    }
    setScreen('view');
  }

  const StopRecording = () => {
    cameraRef.current.stopRecording();
  };

  const imagePickHandler = async () => {
    try {
      const result = await launchImageLibrary({
        quality: 0.5,
        mediaType: 'photo',
      });

      setStory(result.assets[0]);
      setScreen('view');
    } catch (error) {
      console.log('Error reading an image', error);
    }
  };

  const handelRevertCamera = () => {
    setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const addStoryHandler = async () => {
    setIsUploading(true);

    let storyData = new FormData();

    storyData.append('stryfiles', {
      name: 'stryfiles',
      type: 'image/jpg',
      uri: story.uri,
    });

    storyService
      .addStory(userData.id, storyData)
      .then(res => {
        console.log(res);
      })
      .catch(e => console.log(e.message))
      .finally(_ => setIsUploading(false));
  };

  return (
    <View style={styles.container}>
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
          <Image
            source={story}
            resizeMode={'cover'}
            style={{height: '100%', width: '100%', zIndex: -10}}
          />
          <Text>Uploading...</Text>
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
