import React from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import Icon from '../components/Icon';
import colors from '../config/colors';
import defaultStyles from '../config/GlobalStyles';
import {Texts} from '../Materials/Text';

export default function DrawerButtons({iconImage, title, onPress}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.container, defaultStyles.lightShadow]}>
        <Icon image={iconImage} backgroundSizeRatio={1} size={23} />
        <Texts style={styles.title}>{title}</Texts>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    width: 120,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    margin: 5,
    marginBottom: 10,
    paddingLeft: 5,
  },
  title: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '500',
  },
});
