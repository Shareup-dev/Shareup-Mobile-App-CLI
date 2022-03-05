import React from 'react';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import colors from '../../config/colors';

export default function Loading(props) {
  const {text, color = colors.LightGray, ...rest} = props;
  return (
    <View style={styles.container}>
      <ActivityIndicator color={color} {...rest} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    fontWeight: '700',
    color: '#585858',
  },
});
