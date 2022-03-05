import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import colors from '../../config/colors';

function PrimaryBtn(props) {
  const {children, ...rest} = props;
  return (
    <TouchableOpacity style={styles.btn} activeOpacity={0.8} {...rest}>
      <Text style={styles.btnText}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: '700',
    marginVertical: 10,
  },
});
export default React.memo(PrimaryBtn);
