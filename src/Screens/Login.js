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
import PrimaryBtn from '../components/Login/PrimaryBtn';

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

            <PrimaryBtn text={"Let's Shareup"} />

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
    backgroundColor: '#fff',
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
