import React, {memo, useRef, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import BetterImage from '../betterImage/BetterImage';
import ImageView from 'react-native-image-viewing';
import Video from 'react-native-video';
import VideoPlayer from '../ShareupVideoPlayer/shareupVideoPlayer';

function CustomImageSlider({media = [], width, height}) {
  const [imageSlider, setImageSlider] = useState({
    state: false,
    index: 0,
  });

  const styles = StyleSheet.create({
    imgWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

  const imgGridViewer = index => {
    switch (media.length) {
      case 4:
        return width / 2;
      case 3:
        if (index + 1 === media.length) {
          return width;
        }
        return width / 2;
      default:
        return width / media.length;
    }
  };

  return (
    <>
      <View style={[styles.imgWrapper]}>
        <ImageView
          visible={imageSlider.state}
          images={media.map(media => ({uri: media.mediaPath}))}
          keyExtractor={(item, index) => index.toString()}
          imageIndex={imageSlider.index}
          onRequestClose={() => {
            setImageSlider(prev => ({...prev, state: false}));
          }}
        />
        {media.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setImageSlider({state: true, index: index})}>
            {image.mediaPath ? (
              image.mediaPath.split('.').pop() === 'mp4' ||
              image.mediaPath.split('.').pop() === 'mov' ? (
                <VideoPlayer
                  source={{uri: image.mediaPath}}
                  navigator={navigator}
                  tapAnywhereToPause={false}
                  toggleResizeModeOnFullscreen={false}
                  isFullScreen={false}
                  //thumbnail={require('../../assets/images/9.jpg')}
                  disableBack={false}
                  disableVolume={false}
                  controlTimeout={5000}
                  paused={true}
                  seekColor={'#576CEC'}
                  style={[{width: imgGridViewer(index) - 2, margin: 1, height}]}
                  videoStyle={{width: '100%', height: '100%'}}
                  resizeMode={'cover'}
                />
              ) : (
                <BetterImage
                  key={index}
                  style={[{width: imgGridViewer(index) - 2, margin: 1, height}]}
                  resizeMode={'cover'}
                  source={{uri: image.mediaPath}}
                />
              )
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

export default React.memo(CustomImageSlider);
