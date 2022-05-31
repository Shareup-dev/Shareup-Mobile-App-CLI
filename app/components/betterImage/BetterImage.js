import React from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../config/colors';

export default function BetterImage({style, noBackground = false, minHeight, ...props}) {
  return (
    <FastImage
      style={[
        style,
        {backgroundColor: noBackground ? null: colors.lighterGray},
        {minHeight}
      ]}

      {...props}
    />
  );
}
