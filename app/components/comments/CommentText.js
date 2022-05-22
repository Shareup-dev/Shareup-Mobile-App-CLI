import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import colors from '../../config/colors';

const {width} = Dimensions.get('window');
export default function CommentText({children}) {
  const [textCollapse, setTextCollapse] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState(2);
  const [isTruncatedText, setIsTruncatedText] = useState(false);

  return (
    <View style={styles.container}>
      <Text
        ellipsizeMode="tail"
        onTextLayout={event => {
          const {lines} = event.nativeEvent;
          setIsTruncatedText(lines?.length > numberOfLines);
        }}
        numberOfLines={numberOfLines}>
        {children}
      </Text>
      {isTruncatedText && (
        <TouchableOpacity
          style={{marginVertical: 5}}
          onPress={_ => {
            setTextCollapse(prev => !prev);
            setNumberOfLines(prev => (prev ? null : 2));
          }}>
          <Text style={{color: colors.iondigoDye, fontSize: 12}}>
            {textCollapse ? `Read Less..` : `Read more..`}{' '}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width / 1.5,
  },
});
