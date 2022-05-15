import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, ActivityIndicator, Animated} from 'react-native';
import FastImage from 'react-native-fast-image';

export default function BetterImage({style, ...props}) {
  // const [isLoaded, setIsLoaded] = useState(false);

  return (
    <View style={styles.container}>
      <FastImage
        style={[styles.imgCard, style]}
        // onLoad={e => setIsLoaded(true)}
        
        {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cacaca60',
  },
});
