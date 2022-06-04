import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

import colors from '../../config/colors';
import Icon from '../Icon';

export default function OptionBox({currentOption, onPress}) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {currentOption.icon && (
        <Icon
          image={currentOption.icon}
          type="FontAwesome5"
          backgroundSizeRatio={1}
          size={15}
          color={colors.dimGray}
          style={{marginLeft: 5, marginRight: 6}}
        />
      )}

      <Text style={styles.text}>{currentOption.value}</Text>
      <Icon
        type="MaterialIcons"
        name="keyboard-arrow-down"
        size={15}
        backgroundSizeRatio={1}
        color={colors.dimGray}
        style={{marginLeft: 5, marginRight: 5}}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.dimGray,
    borderRadius: 5,
    padding: 2,
  },
  text: {
    fontSize: 14,
    color: colors.dimGray,
  },
});
