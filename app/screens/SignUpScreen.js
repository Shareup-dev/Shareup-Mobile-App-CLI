import React from 'react';
import {StyleSheet} from 'react-native';
import * as Yup from 'yup';

import {Form, FormField, SubmitButton} from '../components/forms';
import AlternativeRegistrationContainer from '../components/AlternativeRegistrationContainer';
import Separator from '../components/Separator';
import routes from '../navigation/routes';

import defaultStyles from '../config/styles';
import RegistrationContainer from '../components/forms/RegistrationContainer';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required().label('First Name'),
  lastName: Yup.string().required().label('Last Name'),
  email: Yup.string().required().email().label('Email'),
});

export default function SignUpScreen({navigation}) {
  const handleSubmit = async values => {
    navigation.navigate(routes.SIGNUP_STEP2, {
      ...values,
    });
  };

  return (
    <RegistrationContainer>
      <Form
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        <FormField
          autoCorrect={false}
          name="firstName"
          placeholder="First Name"
          style={defaultStyles.formField}
        />
        <FormField
          autoCorrect={false}
          name="lastName"
          placeholder="Last Name"
          style={defaultStyles.formField}
        />

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

        <Separator text="or" />

        <AlternativeRegistrationContainer />
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
