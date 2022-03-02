import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import PrimaryBtn from '../../components/FormField/PrimaryBtn';
import {PasswordField} from '../../components/FormField/textField';
import Routes from '../../components/StackNavigation/Routes';
import {Content, SubTitle, Title} from '../../components/TEXT/Text';
import colors from '../../config/colors';

export default function PasswordResetStepThree(props) {
  const {navigation} = props;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
          <View style={styles.titleContainer}>
            <SubTitle style={{textAlign: 'center', fontSize: 20}}>
              Change your password
            </SubTitle>
          </View>
          <View style={styles.fieldContainer}>
            <Content>Choose a Password with at least 8 characters?</Content>
            <PasswordField placeholder="Password" />
            <PasswordField placeholder="Confirm Password" />
            <PrimaryBtn text="Confirm" />
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
