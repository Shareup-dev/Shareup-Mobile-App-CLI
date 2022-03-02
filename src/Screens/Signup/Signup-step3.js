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
import TextField from '../../components/FormField/textField';
import Routes from '../../components/StackNavigation/Routes';
import {Content} from '../../components/TEXT/Text';
import colors from '../../config/colors';

export default function SignupStepThree(props) {
  const {navigation} = props;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
          <View style={styles.fieldContainer}>
            <Content>What's your email address?</Content>
            <TextField placeholder="Email" />

            <PrimaryBtn
              text="Verify"
              onPress={() => navigation.navigate(Routes.SIGNUP_STEP_FOUR)}
            />
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
