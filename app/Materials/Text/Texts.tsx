import React, {useState} from 'react';
import {
  ColorValue,
  Text,
  TextStyle,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  children: String;
  style?: TextStyle;
  size?: number;
  color?: ColorValue;
  light?: Boolean;
  truncate?: Boolean;
  lines?: number;
  opacity?: number;
};

const Texts: React.FC<Props> = ({
  children,
  style,
  size = 12,
  light = false,
  color = '#333',
  truncate = false,
  lines = 2,
  opacity = 1,
  ...rest
}) => {
  const [isTruncatedText, setIsTruncatedText] = useState(false);
  const [textCollapse, setTextCollapse] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState(lines);

  const checkNumOfLines = event => {
    const {lines} = event.nativeEvent;
    setIsTruncatedText(lines?.length > numberOfLines);
  };

  const toggleBtnHandler = () => {
    setTextCollapse(prev => !prev);
    setNumberOfLines(prev => (prev ? null : lines));
  };

  const styles = StyleSheet.create({
    text: {
      fontSize: size,
      color: light ? '#33333399' : color,
      opacity: opacity,
    },
  });

  if (truncate) {
    return (
      <View>
        <Text
          ellipsizeMode="tail"
          allowFontScaling={false}
          onTextLayout={checkNumOfLines}
          numberOfLines={numberOfLines}
          {...rest}
          style={[style, styles.text]}>
          {children}
        </Text>
        {isTruncatedText && children !== '' && (
          <TouchableOpacity
            style={{marginVertical: 5}}
            onPress={toggleBtnHandler}>
            <Text
              style={{fontSize: 12, color: color}}
              allowFontScaling={false}
              numberOfLines={numberOfLines}>
              {textCollapse ? `Show Less..` : `Show more..`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  } else {
    return (
      <Text {...rest} style={[style, styles.text]}>
        {children}
      </Text>
    );
  }
};

export default React.memo(Texts);
