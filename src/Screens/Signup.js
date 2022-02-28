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
import Header from '../components/StackNavigation/Header';
import NavigationHeader from '../components/StackNavigation/navigationHeader';
import Routes from '../components/StackNavigation/Routes';
import {Content, SubTitle, Title} from '../components/TEXT/Text';
import colors from '../config/colors';

export default function Signup(props) {
  const {navigation} = props;

  return (
    <Header>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <>
            <View style={styles.titleContainer}>
              <Title>Join with us</Title>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.navigate(Routes.LOGIN)}>
                <SubTitle style={styles.subtitle}>
                  Do you have an existing shareup account?
                </SubTitle>
              </TouchableOpacity>
            </View>
            <View style={styles.fieldContainer}>
              <Content>What's your name?</Content>
              <TextField placeholder="First name" />
              <TextField placeholder="Surname" />
              <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
                <Text style={styles.btnText}>Next</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity activeOpacity={0.5}>
              <SubTitle style={styles.subtitle}>Forgot Password?</SubTitle>
            </TouchableOpacity> */}
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Header>
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
