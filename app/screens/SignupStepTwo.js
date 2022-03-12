import React, {useState, useContext} from 'react';
import * as Yup from 'yup';
import {ErrorMessage, Form, FormField, SubmitButton} from '../components/forms';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import EncryptedStorage from 'react-native-encrypted-storage';

import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from '../components/Text';
import AuthService from '../services/auth.service';
import Icon from '../components/Icon';
import FormRadio from '../components/forms/FormRadio';
import authContext from '../authContext';
import settings from '../config/settings';
import useIsReachable from '../hooks/useIsReachable';
import RegistrationContainer from '../components/forms/RegistrationContainer';
import Loading from '../components/Loading';

const SignupStepTwo = ({navigation, route}) => {
  const prevStepValues = route?.params;

  const [agreed, setagreed] = useState(false);
  const [registerFailed, setRegisterFailed] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);

  const {authActions} = useContext(authContext);

  const {isReachable, checkIfReachable} = useIsReachable();

  const validationSchema = Yup.object().shape({
    password: Yup.string().required().min(3).label('Password'),
    gender: Yup.string().required(),
    confirmPassword: Yup.string()
      .required()
      .label('Re-Enter Password')
      .when('password', {
        is: val => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref('password')],
          'Password not matched.',
        ),
      }),
  });

  const handleSubmit = async values => {
    setLoading(true);
    const isReachable = await checkIfReachable(settings.apiUrl);

    if (isReachable === false) {
      setLoading(false);
      setRegisterError("Can't reach server please try later");
      return setRegisterFailed(true);
    }

    if (!agreed) {
      Toast.show({
        position: 'bottom',
        visibilityTime: 5000,
        type: 'error',
        text1: 'Error',
        text2: 'Please agree to the terms 👋',
      });
      setLoading(false);
      return;
    }

    const userCompleteData = {...prevStepValues, ...values};

    try {
      const result = await AuthService.signup(userCompleteData);
      console.log(result);
    } catch (e) {
      Toast.show({
        position: 'bottom',
        visibilityTime: 5000,
        type: 'error',
        text1: 'Error',
        text2: e.message,
      });
    }
    setLoading(false);

    // UserService.createUser(userCompleteData)
    //   .then(res => {
    //     AuthServer.login(
    //       userCompleteData.email,
    //       userCompleteData.password,
    //     ).then(async res => {
    //       UserService.getUserByEmail(userCompleteData.email);
    //       setUser(res.data);
    //       await EncryptedStorage.setItem('user', JSON.stringify(res.data));
    //     });
    //   })
    //   .catch(error => {
    //     console.log('Error occurred while registering: ', error);
    //     setRegisterFailed(true);
    //     // setRegisterError('User Already Exist');
    //   });
  };

  return (
    <>
      {loading ? (
        <Loading text="Signing up..." />
      ) : (
        <RegistrationContainer>
          <View style={styles.registerError}>
            <ErrorMessage error={registerError} visible={registerFailed} />
          </View>

          <Form
            initialValues={{
              password: '',
              confirmPassword: '',
              gender: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            <FormRadio
              name="gender"
              style={[styles.formField, styles.formRadio]}
            />

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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styles.agree}
                onPress={() => setagreed(!agreed)}>
                <Icon
                  name={agreed ? 'check-box' : 'check-box-outline-blank'}
                  type={'MaterialIcons'}
                  size={30}
                  backgroundSizeRatio={0.9}
                  style={styles.checkIcon}
                />
              </TouchableOpacity>
              <Text style={{marginLeft: 10}}>
                {'Agree to terms & conditions'}
              </Text>
            </View>

            <SubmitButton title="Register" style={styles.submitButton} />
          </Form>
        </RegistrationContainer>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    alignSelf: 'center',
    width: '60%',
    justifyContent: 'center',
    marginVertical: 20,
  },
  agree: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  registerError: {
    alignItems: 'center',
  },
  formField: {
    width: '90%',
    marginBottom: 5,
  },
  formRadio: {
    marginBottom: 20,
  },
});
export default SignupStepTwo;
