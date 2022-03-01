import React, {useState} from 'react';
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
import PrimaryBtn from '../../components/Login/PrimaryBtn';
import TextField from '../../components/Login/textField';
import Routes from '../../components/StackNavigation/Routes';
import {Content, SubTitle, Title} from '../../components/TEXT/Text';
import colors from '../../config/colors';

export default function PasswordResetStepTwo(props) {
  const {navigation} = props;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
          <View style={styles.titleContainer}>
            <Title style={{textAlign: 'center'}}>
              Confirm that this is your account
            </Title>
            <SubTitle>We have sent an OTP to your email.</SubTitle>
          </View>
          <View style={styles.fieldContainer}>
            <Content>Please confirm the OTP</Content>
            <TextField placeholder="OTP" />

            <PrimaryBtn
              text="Confirm"
              onPress={() =>
                navigation.navigate(Routes.PASSWORD_RESET_STEP_THREE)
              }
            />
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  fieldContainer: {
    marginTop: 30,
    marginHorizontal: 20,
  },
});
