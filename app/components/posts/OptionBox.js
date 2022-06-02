import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';

import {FontAwesome5} from 'react-native-vector-icons';
//import MaterialIcons from 'react-native-vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import colors from '../../config/colors';
import { Texts } from '../../Materials/Text';
import Icon from '../Icon';

export default function OptionBox({currentOption, onPress}) {

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {currentOption.icon && (
        <Icon
          image={currentOption.icon}
          type='FontAwesome5'
          backgroundSizeRatio={1}
          size={15}
          color={colors.dimGray}
          style={{marginLeft:5,marginRight:6}}
        />
      )}

   
      <Texts style={styles.text}>{currentOption.value}</Texts>
      <Icon
      type='Entypo'
        name="chevron-small-down"
        size={15}
        backgroundSizeRatio={1}
        color={colors.dimGray}
        style={{marginLeft:5,marginRight:5}}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:'center',
    borderWidth: 1,
    borderColor: colors.dimGray,
    margin: 0,
    borderRadius: 5,
    padding: 2,
  },
  text: {
    fontSize: 14,
    color: colors.dimGray,
   
  },
});
