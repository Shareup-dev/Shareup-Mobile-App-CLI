import React from 'react';
import {View, StyleSheet, ActivityIndicator, Text, Modal, Dimensions} from 'react-native';
import colors from '../config/colors';

export default React.memo(function Loading(props) {
  const {
    text,
    noBackground = false,
    color = colors.LightGray,
    modal,
    visible,
    ...rest
  } = props;

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

  const {width,height} = Dimensions.get('window')

  if (modal) {
    return (
      <View
        style={{
          width: width,
          height: height,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
          backgroundColor: '#00000040',
          position: 'absolute',
        }}>
        <View
          style={{
            width: width,
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              height: 80,
              borderRadius:5,
              flexDirection:'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
           <ActivityIndicator color={color} style={{marginHorizontal:5}} {...rest} />
            <Text>{text}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        !noBackground && {backgroundColor: '#fdfdfd20'},
      ]}>
      <ActivityIndicator color={color} {...rest} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
});
