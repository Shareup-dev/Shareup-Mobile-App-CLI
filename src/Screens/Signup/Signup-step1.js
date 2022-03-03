import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import PrimaryBtn from '../../components/FormField/PrimaryBtn';
import RadioButton from '../../components/FormField/RadioButton';
import TextField from '../../components/FormField/textField';
import Routes from '../../components/StackNavigation/Routes';
import {Content, SubTitle, Title} from '../../components/TEXT/Text';
import colors from '../../config/colors';

export default function Signup(props) {
  const {navigation} = props;
  const radioOptions = ['male', 'female'];
  const [data, setData] = useState({
    gender: 'male',
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
          <View style={styles.titleContainer}>
            <Title>Tell us about your self</Title>
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

            <Content style={{marginTop: 10}}>What's your gender?</Content>
            <RadioButton
              options={radioOptions}
              data={data.gender}
              setData={opt => setData({...data, gender: opt})}
            />
            <PrimaryBtn
              text="Next"
              onPress={() => navigation.navigate(Routes.SIGNUP_STEP_TWO)}
            />
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 5,
    color: colors.secondaryColor,
  },

  titleContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  fieldContainer: {
    marginTop: 30,
    marginHorizontal: 20,
  },
});
