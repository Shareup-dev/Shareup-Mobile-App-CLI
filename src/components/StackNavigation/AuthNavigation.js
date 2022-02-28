import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Routes from './Routes';
import Login from '../../Screens/Login';
import Signup from '../../Screens/Signup';

const Stack = createNativeStackNavigator();

export default function AuthNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}>
        <Stack.Screen name={Routes.LOGIN} component={Login} />
        <Stack.Screen name={Routes.SIGNUP} component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
