import {Field} from 'formik';
import React from 'react';
import {View, StyleSheet, TextInput, Text} from 'react-native';
import ErrorMessage from './ErrorMessage';

export default React.memo(function TextField(props) {
  const {icon, error, noErrorTag, ...rest} = props;

  const styles = StyleSheet.create({
    input: {
      flexDirection: 'row',
      alignItems: 'center',

      borderColor: error ? 'red' : '#cacaca',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 5,
      paddingVertical: Platform.OS === 'ios' ? 15 : 0,
      fontSize: 16,
      marginVertical: 5,
    },
  });

  return (
    <View>
      <View style={styles.input}>
        {props.icon ? props.icon : null}

        <TextInput style={{width: '100%'}} {...rest} />
      </View>
      {noErrorTag ? null : error && <ErrorMessage>{error}</ErrorMessage>}
    </View>
  );
});
