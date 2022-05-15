import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet,} from 'react-native';
import FastImage from 'react-native-fast-image';

export default function BetterImage({style, ...props}) {
  // const [isLoaded, setIsLoaded] = useState(false);

  return (
    <View style={styles.container}>
      <FastImage
        style={[styles.imgCard, style]}        
        {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { },
  imgCard: { 
    backgroundColor: '#cacaca60',
  },
});
