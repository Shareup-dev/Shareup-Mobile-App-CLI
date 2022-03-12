import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  View,
  Dimensions,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import store from './app/redux/store';

import {Provider, useDispatch} from 'react-redux';

import AuthContext from './app/authContext';
import {SafeAreaProvider, SafeAreaView} from 'react-native';
import {AuthNavigator} from './app/navigation';
import colors from './app/config/colors';
import EncryptedStorage from 'react-native-encrypted-storage';

import OfflineNotice from './app/components/OfflineNotice';
import Toast from 'react-native-toast-message';
import HomeNavigator from './app/navigation/HomeNavigator';
import UserService from './app/services/user.service';
import {removeAxiosToken, setTokenForAxios} from './app/services/authHeader';

export default function App() {
  const initState = {
    username: null,
    userData: {},
    isLoading: true,
    userToken: null,
  };
  const actions = {
    SET_STATE: 'SET_STATE',
    CLEAR_STATE: 'CLEAR_STATE',
  };

  // ------------------ handle user auth data with Reducer ------------------
  const authReducer = (prevState, action) => {
    switch (action.type) {
      case actions.SET_STATE:
        return {
          ...prevState,
          username: action.username,
          userToken: action.userToken,
          userData: action.userData,
          isLoading: false,
        };

      case actions.CLEAR_STATE:
        return {
          ...initState,
          isLoading: false,
        };

      default:
        return {
          ...initState,
          isLoading: false,
        };
    }
  };
  const [userState, dispatch] = React.useReducer(authReducer, initState);

  // ------------------ Based on the action change the auth STATE  ------------------
  const authActions = React.useMemo(
    () => ({
      //   retrieving Token from the secure
      retrieveToken: async () => {
        try {
          const session = await EncryptedStorage.getItem('auth_session');
          if (session) {
            const {username, userToken} = JSON.parse(session);
            setTokenForAxios(userToken);

            // getting user information
            const user = await UserService.getUserByEmail(username);

            dispatch({
              type: actions.SET_STATE,
              username,
              userToken,
              userData: user.data,
            });
          } else {
            dispatch({type: actions.CLEAR_STATE});
          }
        } catch (error) {
          console.log(error.message);
        }
      },
      // Login
      login: async (username, userToken) => {
        try {
          await EncryptedStorage.setItem(
            'auth_session',
            JSON.stringify({
              userToken,
              username,
            }),
          );
          setTokenForAxios(userToken);
          // getting user information
          const user = await UserService.getUserByEmail(username);

          dispatch({
            type: actions.SET_STATE,
            username,
            userToken,
            userData: user.data,
          });
        } catch (error) {
          console.log(error);
        }
      },
      // logout
      logout: async () => {
        try {
          await EncryptedStorage.removeItem('auth_session');
          removeAxiosToken();
          dispatch({type: actions.CLEAR_STATE});
        } catch (error) {
          console.log(error);
        }
      },
      // signup
      signup: async (username, userToken) => {
        try {
          await EncryptedStorage.setItem(
            'auth_session',
            JSON.stringify({
              userToken,
              username,
            }),
          );
          setTokenForAxios(userToken);
          // getting user information
          const user = await UserService.getUserByEmail(username);
          dispatch({
            type: actions.SET_STATE,
            username,
            userToken,
            userData: user.data,
          });
        } catch (error) {
          console.log(error);
        }
      },
    }),
    [],
  );
  // initial check if token exist
  useEffect(() => {
    authActions.retrieveToken();
  }, []);

  if (userState.isLoading) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator
          style={styles.gobalLoadingIndicator}
          size="large"
          color="#044566"
        />
      </View>
    );
  } else {
    return (
      <AuthContext.Provider value={{authActions, userState}}>
        <Provider store={store}>
          <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
          <OfflineNotice />
          <SafeAreaView style={{flex: 1}}>
            <NavigationContainer>
              {userState.userToken ? <HomeNavigator /> : <AuthNavigator />}
            </NavigationContainer>
          </SafeAreaView>
          <Toast ref={ref => Toast.setRef(ref)} />
        </Provider>
      </AuthContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  loadingOverlay: {
    flex: 1,
    position: 'absolute',
    zIndex: 1,
    elevation: 1,
    opacity: 1,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    alignContent: 'center',
    justifyContent: 'center',
  },
  listItem: {
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 6,
  },
});
