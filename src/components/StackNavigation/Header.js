import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import Icons from '../Icons';

export default function Header(props) {
  const window = Dimensions.get('window');

  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      height: parseInt((window.height / 100) * 8),
      borderBottomColor: '#cacaca',
      borderBottomWidth: 1,
      paddingHorizontal: 15,
    },
    HeaderText: {
      fontSize: 19,
      fontWeight: '500',
      color: '#333',
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <Icons name="arrow-back" color="#333" size={30} />
      </TouchableOpacity>
      <View>
        <Text style={styles.HeaderText}>{props.options.title}</Text>
      </View>
    </View>
  );
}
