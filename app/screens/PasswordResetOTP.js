import React from 'react';
import {StyleSheet, Text, Alert, TouchableOpacity} from 'react-native';
import * as Yup from 'yup';

import {Form, FormField, SubmitButton} from '../components/forms';
import routes from '../navigation/routes';

import defaultStyles from '../config/styles';
import RegistrationContainer from '../components/forms/RegistrationContainer';
import colors from '../config/colors';
import authService from '../services/auth.service';

const validationSchema = Yup.object().shape({
  otp: Yup.string('Invalid Code')
    .required()
    .label('Verification code')
    .length(6),
});

export default function PasswordResetOTP({navigation, route}) {
  const {email: username} = route?.params;

  const [timeOver, setTimeOver] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          'Discard changes?',
          'Are you sure to discard and leave the screen?',
          [
            {text: "Don't leave", style: 'cancel', onPress: () => {}},
            {
              text: 'Discard',
              style: 'destructive',
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => navigation.dispatch(e.data.action),
            },
          ],
        );
      }),
    [navigation],
  );

  const handleSubmit = async (values, props) => {
    const {setFieldError} = props;

    setLoading(true);
    authService
      .verifyOTP(username, values.otp)
      .then(res => {
        if (res.status === 200) {
          navigation.navigate(routes.PASSWORD_RESET, {
            username,
          });
        }
      })
      .catch(e => {
        if (e.message === 'Request failed with status code 400')
          setFieldError('otp', 'Incorrect code');
        else setFieldError('otp', 'Unexpected error.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <RegistrationContainer title="Forgot Password">
      <Form
        initialValues={{
          otp: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        <Text>Shareup has sent you a verification code to the email</Text>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="number-pad"
          name="otp"
          placeholder="Verification code"
          textContentType="number" // Only for ios
          style={defaultStyles.formField}
        />
        <Text>Verification code will expire after 5 minutes</Text>
        {timeOver && (
          <TouchableOpacity activeOpacity={0.7} style={{marginVertical: 5}}>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 18,
                color: colors.iondigoDye,
              }}>
              Send again
            </Text>
          </TouchableOpacity>
        )}

        <SubmitButton title="Verify" style={styles.submitButton} />
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
