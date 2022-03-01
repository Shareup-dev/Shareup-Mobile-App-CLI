import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import DatePicker from 'react-native-date-picker';
import PrimaryBtn from '../../components/Login/PrimaryBtn';
import Routes from '../../components/StackNavigation/Routes';
import {Content} from '../../components/TEXT/Text';
import colors from '../../config/colors';

export default function SignupStepTwo({navigation}) {
  let today = new Date();
  var maxDate = new Date(today.setFullYear(today.getFullYear() - 10));

  const [date, setDate] = useState(today);
  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Content style={{marginVertical: 10}}>When is your birthday?</Content>
        <DatePicker
          mode="date"
          fadeToColor="#fff"
          date={date}
          onDateChange={setDate}
          maximumDate={maxDate}
        />
      </View>
      <PrimaryBtn
        text="Next"
        onPress={() => navigation.navigate(Routes.SIGNUP_STEP_THREE)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  dateContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
});
