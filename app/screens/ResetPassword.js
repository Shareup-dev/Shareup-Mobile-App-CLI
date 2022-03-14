import React from 'react';
import {StyleSheet} from 'react-native';
import * as Yup from 'yup';

import {Form, FormField, SubmitButton} from '../components/forms';
import routes from '../navigation/routes';

import defaultStyles from '../config/styles';
import RegistrationContainer from '../components/forms/RegistrationContainer';

const validationSchema = Yup.object().shape({
  password: Yup.string().required().min(3).label('Password'),
  confirmPassword: Yup.string()
    .required()
    .label('Re-Enter Password')
    .when('password', {
      is: val => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], 'Password not matched.'),
    }),
});

export default function ResetPassword({navigation}) {
  const handleSubmit = async values => {
    navigation.navigate(routes.PASSWORD_RESET_OTP, {
      ...values,
    });
  };

  return (
    <RegistrationContainer title="Forgot Password">
      <Form
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        <FormField
          autoCorrect={false}
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password" // Only for ios
          style={styles.formField}
        />

        <FormField
          autoCorrect={false}
          name="confirmPassword"
          placeholder="Re-Enter Password"
          secureTextEntry
          textContentType="password" // Only for ios
          style={styles.formField}
        />

        <SubmitButton title="Confirm" style={styles.submitButton} />
      </Form>
    </RegistrationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  submitButton: {
    alignSelf: 'center',
    width: '60%',
    paddingTop: '10%',
  },
});
