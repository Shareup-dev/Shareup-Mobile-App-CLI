import React from 'react';
import {StyleSheet} from 'react-native';
import * as Yup from 'yup';

import {Form, FormField, SubmitButton} from '../components/forms';
import routes from '../navigation/routes';

import defaultStyles from '../config/styles';
import RegistrationContainer from '../components/forms/RegistrationContainer';

const validationSchema = Yup.object().shape({
  otp: Yup.string('Invalid Code')
    .required()
    .label('Verification code')
    .length(6),
});

export default function PasswordResetOTP({navigation}) {
  const handleSubmit = async values => {
    navigation.navigate(routes.PASSWORD_RESET, {
      ...values,
    });
  };

  return (
    <RegistrationContainer title="Forgot Password">
      <Form
        initialValues={{
          otp: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="number-pad"
          name="otp"
          placeholder="Verification code"
          textContentType="number" // Only for ios
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
