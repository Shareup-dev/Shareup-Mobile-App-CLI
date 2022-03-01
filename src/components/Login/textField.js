import React from 'react';
import {
  TextInput,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import colors from '../../config/colors';
import Icons from '../Icons';

export default React.memo(function TextField(props) {
  return (
    <View style={styles.input}>
      <TextInput {...props} />
    </View>
  );
});
export function PasswordField(props) {
  const [secureText, setSecureText] = React.useState(true);
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
    paddingVertical: Platform.OS === 'ios' ? 15 : 0,
    fontSize: 16,
    marginVertical: 5,
  },
  inputPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#cacaca',

    paddingVertical: Platform.OS === "ios"? 10:0,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 5,
    fontSize: 16,
    marginVertical: 5,
  },
  btn: {marginRight: 5},
});
