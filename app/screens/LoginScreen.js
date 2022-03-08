import * as Yup from 'yup';
import React, {useContext, useState} from 'react';
import {StyleSheet, View, PixelRatio} from 'react-native';
import Toast from 'react-native-toast-message';

import {ErrorMessage, Form, FormField, SubmitButton} from '../components/forms';
import AlternativeRegistrationContainer from '../components/AlternativeRegistrationContainer';
import AuthService from '../services/auth.service';
import LinkButton from '../components/buttons/LinkButton';
import Separator from '../components/Separator';
import authContext from '../authContext';
import colors from '../config/colors';
import routes from '../navigation/routes';

import useIsReachable from '../hooks/useIsReachable';
import settings from '../config/settings';
import defaultStyles from '../config/styles';
import LoginContainer from '../components/forms/LoginContainer';
import Loading from '../components/Loading';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(3).label('Password'),
});

export default function LoginScreen({navigation}) {
  const {setUser, authActions} = useContext(authContext);
  const {isReachable, checkIfReachable} = useIsReachable();

  const [loading, setLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async ({email, password}) => {
    setLoading(true);

    // checking if the server is reachable
    const isReachable = await checkIfReachable(settings.apiUrl);

    if (isReachable === false) {
      setLoading(false);
      setError("Can't reach server please try later");
      return setLoginFailed(true);
    }

    // --------- login ----------
    const result = await AuthService.login(email, password);

    if (result.status !== 200) {
      setLoading(false);
      setError('Invalid email and/or password.');
      return setLoginFailed(true);
    }

    setLoading(false);
    Toast.show({
      position: 'bottom',
      visibilityTime: 5000,
      type: 'success',
      text1: 'Success',
      text2: 'Logged in Successfully 👋',
    });

    if (result.ok) return setLoginFailed(true);

    // storing the token into secure store
    authActions.login(result.data.username, result.data.jwt);

    setLoginFailed(false);
    setLoading(false);
  };

  // ToDO: Fix the layout
  return (
    <>
      {loading ? (
        <Loading text="Logging in..." />
      ) : (
        <LoginContainer>
          <Form
            initialValues={{email: '', password: ''}}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}>
            <ErrorMessage error={error} visible={loginFailed} />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="email"
              keyboardType="email-address"
              name="email"
              placeholder="Email Address"
              textContentType="emailAddress" // Only for ios
              style={defaultStyles.formField}
            />

            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="lock"
              name="password"
              placeholder="Password"
              secureTextEntry
              textContentType="password" // Only for ios
              style={defaultStyles.formField}
            />

            <SubmitButton title="Share in" style={styles.submitButton} />
            <AlternativeRegistrationContainer />

            <Separator text="or" style={styles.separator} />
            {/* added a comment here */}
            <View style={styles.thirdContainer}>
              <LinkButton
                title="Create new account?"
                style={styles.linkedButton}
                onPress={() => {
                  navigation.navigate(routes.SIGNUP);
                }}
              />
            </View>
          </Form>
        </LoginContainer>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  thirdContainer: {
    padding: PixelRatio.get() < 2.5 ? 0 : 20,
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    color: colors.dimGray,
  },
  linkedButton: {
    margin: 10,
  },
  secondContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  iconButton: {
    margin: 20,
  },
  separator: {
    paddingHorizontal: 20,
  },
  formField: {
    width: '90%',
    marginBottom: 5,
  },
  submitButton: {
    width: '60%',
    marginTop: PixelRatio.get() < 2.5 ? 7 : 20,
  },
});
