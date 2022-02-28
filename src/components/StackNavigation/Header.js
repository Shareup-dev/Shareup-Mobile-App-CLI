import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

export default function Header(props) {
  const window = Dimensions.get('window');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    head: {
      height: parseInt((window.height / 100) * 8),
      borderBottomWidth: 0.5,
      borderBottomColor: '#cacaca',
    },
    body: {
      flex: 1,
      marginTop: '5%',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.head}></View>
      <View style={styles.body}>{props.children}</View>
    </View>
  );
}
