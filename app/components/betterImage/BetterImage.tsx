import React from 'react';
import {ImageStyle, StyleSheet} from 'react-native';
import FastImage, {FastImageProps} from 'react-native-fast-image';
import colors from '../../config/colors';

interface Props {
  style?: ImageStyle;
  noBackground?: boolean;
  minHeight?: number;
}

const BetterImage: React.FC<Props & FastImageProps> = props => {
  const {style, minHeight, noBackground, ...rest} = props;
  return (
    <FastImage
      {...rest}
      style={[
        style,
        {backgroundColor: noBackground ? null : colors.lighterGray},
        {minHeight},
      ]}
    />
  );
};

export default BetterImage;
