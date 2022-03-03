import {Field} from 'formik';
import React from 'react';
import {View, StyleSheet, TextInput, Text} from 'react-native';

export default function TextField(props) {
  const {icon, error, ...rest} = props;

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
    error: {
      color: 'crimson',
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 10,
    },
  });

  return (
    <View>
      <View style={styles.input}>
        {props.icon ? props.icon : null}

        <TextInput style={{width: '100%'}} {...rest} />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
