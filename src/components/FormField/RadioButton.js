import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import colors from '../../config/colors';

export default function RadioButton(props) {
  const {options, data, setData} = props;
  return (
    <View style={styles.radioContainer}>
      {options.map((option, i) => (
        <TouchableOpacity
          key={i}
          activeOpacity={0.6}
          onPress={() => setData(option)}>
          <View style={styles.radio}>
            <Text style={styles.radioText}>{option}</Text>
            <View style={styles.container}>
              {data === option ? <View style={styles.core} /> : null}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 24,
    width: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    height: 11,
    width: 11,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  radioContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  radioText: {
    color: '#333',
    marginRight: 10,
    textTransform: 'capitalize',
  },
  radio: {
    marginRight: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
