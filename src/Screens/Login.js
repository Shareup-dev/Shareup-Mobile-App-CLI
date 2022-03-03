import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {PasswordField, TextField} from '../components/FormField/FormikControls';
import Routes from '../components/StackNavigation/Routes';
import {SubTitle, Title} from '../components/TEXT/Text';
import colors from '../config/colors';
import PrimaryBtn from '../components/FormField/PrimaryBtn';
import {useDispatch} from 'react-redux';
import {AuthContext} from '../components/context';
import {Formik} from 'formik';
import * as yup from 'yup';

export default function Login(props) {
  const dispatch = useDispatch();
  const AuthActions = useContext(AuthContext);
  const initValue = {
    username: '',
    password: '',
  };

  const validation = yup.object().shape({
    username: yup.string().email('Invalid email').required('Required'),
    password: yup.string().min(6, 'Invalid password').required('Required'),
  });

  const {navigation} = props;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
            <Formik
              initialValues={initValue}
              validationSchema={validation}
              onSubmit={values => console.log(values)}>
              {({handleBlur, handleSubmit, values, handleChange, errors}) => (
                <>
                  <TextField
                    placeholder="Email"
                    value={values.username}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    error={errors['username']}
                  />
                  <PasswordField
                    placeholder="Password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                  />
                  <PrimaryBtn onPress={handleSubmit} text={"Let's Shareup"} />
                </>
              )}
            </Formik>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate(Routes.PASSWORD_RESET_STEP_ONE)
              }>
              <SubTitle style={styles.subtitle}>Forgot Password?</SubTitle>
            </TouchableOpacity>
          </View>
        </>
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
