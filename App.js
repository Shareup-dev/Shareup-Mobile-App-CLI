import React, {useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  View,
} from 'react-native';

import {Provider, useDispatch} from 'react-redux';
// import {Provider} from 'react-redux';

import {AuthContext} from './src/components/context';
import Snackbar from './src/components/Snackbar';
import AuthNavigation from './src/components/StackNavigation/AuthNavigation';
import HomeNavigation from './src/components/StackNavigation/HomeNavigation';
import colors from './src/config/colors';
import EncryptedStorage from 'react-native-encrypted-storage';

import store from './src/redux/store';

export default function App(props) {
  const initValue = {
    username: null,
    isLoading: true,
    userToken: null,
  };

  const authReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.userToken,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          username: action.username,
          userToken: action.userToken,
          isLoading: false,
        };
      case 'SIGNUP':
        return {
          ...prevState,
          username: action.username,
          userToken: action.userToken,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          username: null,
          userToken: null,
          isLoading: false,
        };

      default:
        return initValue;
    }
  };
  const [loginState, dispatch] = React.useReducer(authReducer, initValue);

  // checking if the token available

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        const userToken = await EncryptedStorage.getItem('auth_session');
        dispatch({type: 'RETRIEVE_TOKEN', userToken});
      } catch (error) {
        console.log(error);
      }
    };
    retrieveToken();
  }, []);

  const userContext = React.useMemo(
    () => ({
      // Login
      login: async (username, userToken) => {
        dispatch({type: 'LOGIN', username, userToken});
        try {
          await EncryptedStorage.setItem(
            'auth_session',
            JSON.stringify({
              userToken,
              username,
            }),
          );
        } catch (error) {
          console.log(error);
        }
      },
      // logout
      logout: async () => {
        dispatch({type: 'LOGOUT'});
        try {
          await EncryptedStorage.removeItem('auth_session');
        } catch (error) {
          console.log(error);
        }
      },
      // signup
      signup: async (username, userToken) => {
        dispatch({type: 'SIGNUP', username, userToken});
        try {
          await EncryptedStorage.setItem(
            'auth_session',
            JSON.stringify({
              userToken,
              username,
            }),
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    [],
  );

  if (loginState.isLoading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size={'large'} />
      </View>
    );
  else
    return (
      <AuthContext.Provider value={userContext}>
        <Provider store={store}>
          <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle={'dark-content'} />
            {loginState.userToken ? <HomeNavigation /> : <AuthNavigation />}
          </SafeAreaView>
          <Snackbar />
        </Provider>
      </AuthContext.Provider>
    );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
