import {Field} from 'formik';
import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import colors from '../../../config/colors';
import Icons from '../../Icons';
import ErrorMessage from './ErrorMessage';

export default React.memo(function PasswordField(props) {
  const {icon, error, ...rest} = props;

  const [secureText, setSecureText] = React.useState(true);

  const styles = StyleSheet.create({
    inputPassword: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderColor: error ? 'red' : '#cacaca',

      paddingVertical: Platform.OS === 'ios' ? 10 : 0,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 5,
      fontSize: 16,
      marginVertical: 5,
    },
    btn: {marginRight: 5},
  });

  return (
    <View>
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
      {error && <ErrorMessage> {error}</ErrorMessage>}
    </View>
  );
});
