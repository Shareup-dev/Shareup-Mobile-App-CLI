import react from 'react';
import React from 'react';
import {
  TextInput,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import colors from '../../config/colors';
import Icons from '../Icons';

export default function TextField(props) {
  return (
    <View style={styles.input}>
      <TextInput {...props} />
    </View>
  );
}
export function PasswordField(props) {
  const [secureText, setSecureText] = react.useState(true);
  return (
    <View style={styles.inputPassword}>
      <TextInput
        style={{width: '80%'}}
        {...props}
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
  input: {
    borderColor: '#cacaca',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical:15,
    fontSize: 16,
    marginVertical: 5,
  },
  inputPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#cacaca',
    paddingVertical:10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 5,
    fontSize: 16,
    marginVertical: 5,
  },
  btn: {marginRight: 5},
});
