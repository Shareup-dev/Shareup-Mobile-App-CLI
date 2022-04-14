import React from 'react';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import colors from '../config/colors';

export default React.memo(function Loading(props) {
  const {text , noBackground = false, color = colors.LightGray, ...rest} = props;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      marginTop: 10,
      fontWeight: '700',
      color: '#585858',
    },
  });

  return (
    <View style={[styles.container,!noBackground && { backgroundColor: '#fdfdfd20' }]}>
      <ActivityIndicator color={color} {...rest} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
});

