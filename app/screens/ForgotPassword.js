import React from 'react';
import {StyleSheet} from 'react-native';
import * as Yup from 'yup';

import {Form, FormField, SubmitButton} from '../components/forms';
import routes from '../navigation/routes';

import defaultStyles from '../config/styles';
import RegistrationContainer from '../components/forms/RegistrationContainer';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
});

export default function ForgotPassword({navigation}) {
  const handleSubmit = async values => {
    navigation.navigate(routes.PASSWORD_RESET_OTP, {
      ...values,
    });
  };

  return (
    <RegistrationContainer title="Forgot Password">
      <Form
        initialValues={{
          email: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress" // Only for ios
          style={defaultStyles.formField}
        />

        <SubmitButton title="Next" style={styles.submitButton} />
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
