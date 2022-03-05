import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import {useDispatch} from 'react-redux';

import {PasswordField, TextField} from '../components/FormField/FormikControls';
import Routes from '../components/StackNavigation/Routes';
import {SubTitle, Title} from '../components/TEXT/Text';
import PrimaryBtn from '../components/FormField/PrimaryBtn';
import colors from '../config/colors';
import {AuthContext} from '../components/context';
import settings from '../config/settings';
import useIsReachable from '../hooks/useIsReachable';
import {snackbarActions} from '../redux/snackbar';

import AuthService from '../services/auth.services';
import Loading from '../components/FormField/Loading';

export default function Login(props) {
  const {navigation} = props;
  const dispatch = useDispatch();

  const AuthActions = useContext(AuthContext);

  const {isReachable, checkIfReachable} = useIsReachable();

  const initValue = {
    email: '',
    password: '',
  };

  const validation = yup.object().shape({
    email: yup.string().email('Invalid email').required('Required'),
    password: yup
      .string()
      .min(6, 'Password must be more-than 6 characters')
      .required('Required'),
  });

  const handleSubmit = async ({email, password}) => {
    const isReachable = await checkIfReachable(settings.apiUrl);

    if (isReachable === false) {
      return dispatch(
        snackbarActions.openSnackbar({
          text: "Can't reach server please try later",
          open: true,
        }),
      );
    }

    const result = await AuthService.login(email, password);

    if (result.status !== 200) {
      return dispatch(
        snackbarActions.openSnackbar({
          text: 'Invalid email and/or password.',
          open: true,
        }),
      );
    }

    dispatch(
      snackbarActions.openSnackbar({
        text: 'Logged in Successfully 👋',
        open: true,
      }),
    );
    await AuthActions.login(result.data.username, result.data.jwt);
    // console.log(result.data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Formik
          validateOnBlur={false}
          initialValues={initValue}
          validationSchema={validation}
          validateOnChange={false}
          onSubmit={handleSubmit}>
          {({
            handleSubmit,
            values,
            handleChange,
            errors,
            isSubmitting,
            validateOnChange,
          }) =>
            isSubmitting ? (
              <Loading text={'Logging in...'} />
            ) : (
              <>
                <View style={styles.titleContainer}>
                  <Title>Let's Shareup</Title>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate(Routes.SIGNUP)}>
                    <SubTitle style={styles.subtitle}>
                      No account? Signup here
                    </SubTitle>
                  </TouchableOpacity>
                </View>
                <View style={styles.fieldContainer}>
                  <TextField
                    placeholder="Email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    error={errors['email']}
                    noErrorTag={true}
                  />

                  <PasswordField
                    placeholder="Password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    error={errors['password']}
                  />
                  <PrimaryBtn onPress={handleSubmit}>Let's Shareup</PrimaryBtn>

                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() =>
                      navigation.navigate(Routes.PASSWORD_RESET_STEP_ONE)
                    }>
                    <SubTitle style={styles.subtitle}>
                      Forgot Password?
                    </SubTitle>
                  </TouchableOpacity>
                </View>
              </>
            )
          }
        </Formik>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.primaryBackground,
  },
  subtitle: {
    marginTop: 5,
    color: colors.secondaryColor,
  },

  titleContainer: {
    alignItems: 'center',
  },
  fieldContainer: {
    marginTop: 30,
    marginHorizontal: 20,
  },
});
