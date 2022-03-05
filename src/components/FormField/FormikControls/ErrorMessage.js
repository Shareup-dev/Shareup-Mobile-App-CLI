import React from 'react';
import {StyleSheet, Text} from 'react-native';

export default React.memo(function ErrorMessage(props) {
  if (!props.visible) return null;
  else return <Text style={styles.error}>{props.children}</Text>;
});

const styles = StyleSheet.create({
  error: {
    textAlign: 'right',
    color: 'crimson',
    fontSize: 12,
    fontWeight: '500',
    marginRight: 10,
  },
});
