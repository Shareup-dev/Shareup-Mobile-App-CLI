import {Formik} from 'formik';
import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AuthContext from '../../authContext';
import {HeaderWithBackArrow} from '../../components/headers';
import colors from '../../config/colors';
import * as Yup from 'yup';
import Loading from '../../components/Loading';
import userService from '../../services/user.service';
import Icon from '../../components/Icon';
import profileService from '../../services/profile.service';

export default function UpdateEmail({navigation}) {
  const {
    userState: {userData, username},
    authActions,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [optionalEmail, setOptionalEmail] = useState('');
  const [step, setStep] = useState(0);

  const Validation = Yup.object().shape({
    email: Yup.string().email().label('Email').required()
  })

  const handleSubmit = values => {
    setLoading(true);
    // Keyboard.dismiss();
    userService
      .editProfile(username, values)
      .then(({status, data}) => {
        if (status === 200) {
          authActions.updateUserInfo(data);
          setLoading(false);
          navigation.goBack();
        }
      })
      .catch(e => console.error(e.message));
  };

  const sendOtp = ({email}) => {
    if (!email) {
      return;
    }
    setVerifying(true);
    console.log('works', email);
    profileService
      .sendOTPtoVerifyEmail(userData.id, email)
      .then(res => console.log(res))
      .catch(e => console.error(e))
      .finally(_ => setVerifying(false));
  };

  const Stepper = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.card}>
            <TouchableOpacity
              style={{
                marginVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row'}}>
                <Icon name={'email'} color="#fff" backgroundColor="#333333" />
                <View style={{marginLeft: 10}}>
                  <Text style={styles.label}>Primary Email</Text>
                  <Text>{userData.email}</Text>
                </View>
              </View>
              <Icon name={'chevron-right'} noBackground size={55} />
            </TouchableOpacity>

            {userData.optional_email ? (
              <TouchableOpacity
                style={{
                  marginVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Icon name={'email'} color="#fff" backgroundColor="#333333" />
                  <View style={{marginLeft: 10}}>
                    <Text style={styles.label}>Secondary Email</Text>
                    <Text>{userData.optional_email}</Text>
                  </View>
                </View>
                <Icon name={'chevron-right'} noBackground size={55} />
              </TouchableOpacity>
            ) : (
              <Formik initialValues={{email: ''}} onSubmit={sendOtp} validationSchema={Validation}>
                {({handleChange, handleBlur, values, handleSubmit,errors}) => (
                  <>
                    <Text style={styles.label}>Secondary Email</Text>
                    <TextInput
                      style={[styles.input, {borderColor: errors['email'] ? 'crimson' :'#cacaca'}]}
                      value={values['email']}
                      onBlur={handleBlur('email')}
                      keyboardType="email-address"
                      onChangeText={handleChange('email')}
                    />

                    <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                      <Text style={styles.btnText}>Add Email</Text>
                    </TouchableOpacity>
                  </>
                )}
              </Formik>
            )}
          </View>
        );
      case 1:
        return (
          <View style={styles.card}>
            <Text style={{textAlign: 'center', marginVertical: 10}}>
              Shareup has sent you a verification code to the email
            </Text>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.label}>Verification code</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: '#cacaca',
                    minWidth: 150,
                    textAlign: 'center',
                  },
                ]}
              />
            </View>

            <Text style={{textAlign: 'center'}}>
              Verification code will expire after 5 minutes
            </Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                marginVertical: 5,
                backgroundColor: '#cacaca60',
                paddingHorizontal: 15,
                paddingVertical: 6,
                borderRadius: 30,
                width: 100,
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: colors.iondigoDye, fontWeight: '700'}}>
                Re-send
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
              <Text style={styles.btnText}>Verify</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <HeaderWithBackArrow
        onBackButton={_ => navigation.goBack()}
        title="Email"
      />
      {loading ||
        (verifying && (
          <Loading
            text={verifying ? 'Verifying your Email' : 'Saving..'}
            modal
          />
        ))}
      <TouchableOpacity activeOpacity={1} style={{flex: 1}}>
        <Stepper />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  error: {
    alignSelf: 'flex-end',
    fontSize: 13,
    color: 'crimson',
    marginHorizontal: 5,
  },
  btn: {
    // alignSelf: 'flex-end',
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    margin: 5,
    backgroundColor: colors.iondigoDye,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  card: {
    marginVertical: 10,
    marginHorizontal: 5,
    padding: 5,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 15,
    color: '#242424',
    fontWeight: '800',
  },
  input: {
    // borderColor: '#cacaca',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginVertical: 5,
  },
});
