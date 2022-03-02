import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Routes from './Routes';
import Login from '../../Screens/Login';
import NavigationHeader from './Header';

import Signup from '../../Screens/Signup/Signup-step1';
import SignupStepTwo from '../../Screens/Signup/Signup-step2';
import SignupStepThree from '../../Screens/Signup/Signup-step3';
import SignupStepFour from '../../Screens/Signup/Signup-step4';
import PasswordResetStepOne from '../../Screens/PasswordReset/PasswordReset-step1';
import PasswordResetStepTwo from '../../Screens/PasswordReset/PasswordReset-step2';
import PasswordResetStepThree from '../../Screens/PasswordReset/PasswordReset-step3';

const Stack = createNativeStackNavigator();

export default function AuthNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          gestureEnabled: true,
          gestureDirection: 'vertical',

          contentStyle: {
            backgroundColor: '#fff',
          },
          header: props =>
            props.options.title !== 'Login' ? (
              <NavigationHeader {...props} />
            ) : null,
        }}>
        <Stack.Screen
          name={Routes.LOGIN}
          component={Login}
          options={{title: 'Login'}}
        />
        <Stack.Screen
          name={Routes.SIGNUP}
          options={{title: 'Join with us'}}
          component={Signup}
        />
        <Stack.Screen
          name={Routes.SIGNUP_STEP_TWO}
          options={{title: 'Date of birth'}}
          component={SignupStepTwo}
        />
        <Stack.Screen
          name={Routes.SIGNUP_STEP_THREE}
          options={{title: 'Enter your email'}}
          component={SignupStepThree}
        />
        <Stack.Screen
          name={Routes.SIGNUP_STEP_FOUR}
          options={{title: 'Password'}}
          component={SignupStepFour}
        />
        <Stack.Screen
          name={Routes.PASSWORD_RESET_STEP_ONE}
          options={{title: "Let's find your account"}}
          component={PasswordResetStepOne}
        />
        <Stack.Screen
          name={Routes.PASSWORD_RESET_STEP_TWO}
          options={{title: 'Confirm your account'}}
          component={PasswordResetStepTwo}
        />
        <Stack.Screen
          name={Routes.PASSWORD_RESET_STEP_THREE}
          options={{title: 'Choose new Password'}}
          component={PasswordResetStepThree}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
