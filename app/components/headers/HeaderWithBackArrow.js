import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import colors from '../../config/colors';
import { Header, Texts } from '../../Materials/Text';

import Icon from '../Icon';

export default function HeaderWithBackArrow({
  onBackButton,
  title,
  component,
  leftComponent,
  rightComponent,
  titleStyle,
}) {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onBackButton}  >
        <Icon
          name="chevron-back"
          type="Ionicons"
          size={25}
          backgroundSizeRatio={1}
        />
      </TouchableWithoutFeedback>
      {leftComponent}
      {title && <Header style={[styles.title, titleStyle]}>{title}</Header>}
      {component}
      {rightComponent && (
        <View style={styles.rightComponent}>{rightComponent}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    //paddingVertical: 10,
    paddingHorizontal: 10,
    height: 60,
    backgroundColor: '#FFF',
    zIndex: 100
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingLeft:10,
  },
  rightComponent: {
    position: 'absolute',
    right: '2%',
  },
});
