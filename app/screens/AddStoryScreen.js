import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

import colors from '../config/colors';

import {RNCamera} from 'react-native-camera';
import CameraBottomActions from '../components/CameraBottomActions';
import CameraHeader from '../components/headers/CameraHeader';
import Icon from '../components/Icon';
import {launchImageLibrary} from 'react-native-image-picker';
import StoryService from '../services/story.service';
import AuthContext from '../authContext';
import store from '../redux/store';
import {storiesAction} from '../redux/stories';

export default function AddStoryScreen({navigation}) {
  let cameraRef;

  const {userData} = useContext(AuthContext)?.userState;

  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState('capture');
  const [cameraType, setCameraType] = useState('back');
  const [cameraImg, setCameraImg] = useState(false);
  const [storyPhoto, setstoryPhoto] = useState({});

  async function captureImage() {
    let editedResult;
    let photo = await cameraRef.takePictureAsync({
      skipProcessing: true,
    });
    setCameraImg(true);
    console.log('Captured photo: ', photo.uri);
    try {
      // editedResult = await ImageManipulator.manipulateAsync(
      //   photo.uri,
      //   [{resize: {width: 960}}],
      //   {compress: 0.5},
      // );
    } catch (error) {
      console.log('Edited error: ', error);
    }
    // console.log("cameraimg: ", cameraImg);
    setMode('view');
    setstoryPhoto(photo);
  }

  const imagePickHandler = async () => {
    try {
      // const result = await ImagePicker.launchImageLibraryAsync({
      //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //   quality: 0.5,
      // });
      const result = await launchImageLibrary({
        quality: 0.5,
        mediaType: 'photo',
      });
      setstoryPhoto(result.assets[0]);
      setCameraImg(false);
      setMode('view');
      if (!result.uri) {
        return;
      }
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
      uri: storyPhoto.uri,
    });

    try {
      // const result = await StoryService.addStory(userData.id, storyData);

      console.log('Story add resp: ', storyData);
      // store.dispatch(storiesAction.addNewStory(result.data));
      setIsUploading(false);
      // navigation.popToTop();
    } catch (e) {
      console.log('Error occurred while posting story');
    }
  };

  return (
    <View style={styles.container}>
      {mode === 'capture' ? (
        <RNCamera
          style={styles.camera}
          ratio={'16:9'}
          ref={ref => {
            cameraRef = ref;
          }}
          type={cameraType}>
          <CameraBottomActions
            onPickFile={imagePickHandler}
            onCapture={captureImage}
            onRevertCamera={handelRevertCamera}
          />
        </RNCamera>
      ) : (
        <View style={styles.storyImgViewer}>
          <CameraHeader title="Story" onClosePress={() => setMode('capture')} />
          <TouchableOpacity
            style={styles.forwardArrow}
            activeOpacity={0.6}
            disabled={isUploading}
            onPress={addStoryHandler}>
            <Icon
              type={'AntDesign'}
              color={'#333'}
              name={'arrowright'}
              size={64}
            />
          </TouchableOpacity>
          <Image
            source={storyPhoto}
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
    bottom: 50,
    right: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: colors.white,
  },
});
