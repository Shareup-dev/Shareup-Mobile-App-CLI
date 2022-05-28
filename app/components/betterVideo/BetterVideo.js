import React from 'react';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';

export default function BetterVideo({style, uri, ...props}) {
  return (
    <Video
      style={style}
      maxBitRate={2000000} // 2 megabits
      source={{uri: convertToProxyURL(uri)}}
      {...props}
    />
  );
}

