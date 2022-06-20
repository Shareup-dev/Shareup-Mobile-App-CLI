import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';

import colors from '../../config/colors';
import { Texts } from '../../Materials/Text';

export default function Tab({
  text,
  onPress,
  tabbed,
  activeUnderLineColor = '#4485F2',
  fontSize = 20,
  underLineWidth = 35,
  underLineHight = 4,
}) {
  return (
    <TouchableOpacity style={[styles.container]} onPress={onPress}>
      <View>
        <Texts
          size={15}
          style={[
            tabbed ? styles.active : styles.inactive,
            {
              fontWeight: '500',
              fontSize: fontSize,
            },
          ]}>
          {text}
        </Texts>

        {tabbed && (
          <View
            style={[
              styles.underLine,
              {
                backgroundColor: activeUnderLineColor,
                width: underLineWidth,
                height: underLineHight,
              },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  active: {
    color: colors.dark,
  },
  inactive: {
    color: colors.dimGray,
  },

  underLine: {
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 5,
  },
});
