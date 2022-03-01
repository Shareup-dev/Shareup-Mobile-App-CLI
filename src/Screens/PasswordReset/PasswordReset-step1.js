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

export default function PasswordResetStepOne(props) {
  const {navigation} = props;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
          <View style={styles.titleContainer}>
            <SubTitle>Help us to find your account</SubTitle>
          </View>
          <View style={styles.fieldContainer}>
            <Content>What's your Email?</Content>
            <TextField placeholder="Email" />

            <PrimaryBtn
              text="Find"
              onPress={() =>
                navigation.navigate(Routes.PASSWORD_RESET_STEP_TWO)
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
