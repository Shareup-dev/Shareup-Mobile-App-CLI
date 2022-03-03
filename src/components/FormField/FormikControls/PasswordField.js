import {Field} from 'formik';
import React from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import colors from '../../../config/colors';
import Icons from '../../Icons';

export default function PasswordField(props) {
  const {icon, ...rest} = props;

  const [secureText, setSecureText] = React.useState(true);

  return (
    <View style={styles.inputPassword}>
      {props.icon ? props.icon : null}

      <TextInput
        style={{width: '80%'}}
        {...rest}
        secureTextEntry={secureText}
      />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => setSecureText(prev => !prev)}>
        {secureText ? (
          <Icons name="eye" color={colors.primary} />
        ) : (
          <Icons name="eye-off-sharp" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#cacaca',

    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 5,
    fontSize: 16,
    marginVertical: 5,
  },
  btn: {marginRight: 5},
});
