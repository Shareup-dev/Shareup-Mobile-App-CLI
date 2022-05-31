import React from 'react';
import {ColorValue, Text, TextStyle} from 'react-native';

type Props = {
  children: String;
  style?: TextStyle;
  size?: number;
  color?: ColorValue;
  light?: Boolean;
};

const Texts: React.FC<Props> = ({
  children,
  style,
  size = 12,
  light = false,
  color = '#333',
  ...rest
}) => {
  return (
    <Text
      {...rest}
      style={[style, {fontSize: size, color: light ? '#33333399' : color}]}>
      {children}
    </Text>
  );
};

export default React.memo(Texts);
