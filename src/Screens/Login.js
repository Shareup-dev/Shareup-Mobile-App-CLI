import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import TextField, {PasswordField} from '../components/Login/textField';
import Routes from '../components/StackNavigation/Routes';
import {SubTitle, Title} from '../components/TEXT/Text';
import colors from '../config/colors';

export default function Login(props) {
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
            <TextField placeholder="Email or Phone number" />
            <PasswordField placeholder="Password" />
            <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
              <Text style={styles.btnText}>Let's Shareup</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.5}>
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
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: '700',
    marginVertical: 10,
  },
});
