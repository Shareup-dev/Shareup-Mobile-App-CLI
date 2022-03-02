import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
} from 'react-native';
import PrimaryBtn from '../../components/FormField/PrimaryBtn';
import {PasswordField} from '../../components/FormField/textField';
import Routes from '../../components/StackNavigation/Routes';
import {Content} from '../../components/TEXT/Text';
import colors from '../../config/colors';

export default function SignupStepFour(props) {
  const {navigation} = props;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
          <View style={styles.fieldContainer}>
            <Content>Choose a Password with at least 8 characters?</Content>
            <PasswordField placeholder="Password" />
            <PasswordField placeholder="Confirm Password" />
            <PrimaryBtn text="Let's shareup" />
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginTop: 30,
    marginHorizontal: 20,
  },
});
