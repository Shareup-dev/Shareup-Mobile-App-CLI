import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Text,
  View,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import store from './app/redux/store';
import {Provider, useDispatch} from 'react-redux';

import AuthContext from './app/authContext';

import {AuthNavigator} from './app/navigation';
import colors from './app/config/colors';
import EncryptedStorage from 'react-native-encrypted-storage';

import OfflineNotice from './app/components/OfflineNotice';
import Toast from 'react-native-toast-message';
import HomeNavigator from './app/navigation/HomeNavigator';
import UserService from './app/services/UserService';

export default function App() {
  const [user, setUser] = useState({});

  const initState = {
    username: null,
    isLoading: true,
    userToken: null,
  };
  const actions = {
    RETRIEVE_TOKEN: 'RETRIEVE_TOKEN',
    LOGIN: 'LOGIN',
    SIGNUP: 'SIGNUP',
    LOGOUT: 'LOGOUT',
  };

  // ------------------ handle user auth data with Reducer ------------------
  const authReducer = (prevState, action) => {
    switch (action.type) {
      case actions.RETRIEVE_TOKEN:
        return {
          ...prevState,
          userToken: action.userToken,
          isLoading: false,
        };
      case actions.LOGIN:
        return {
          ...prevState,
          username: action.username,
          userToken: action.userToken,
          isLoading: false,
        };
      case actions.SIGNUP:
        return {
          ...prevState,
          username: action.username,
          userToken: action.userToken,
          isLoading: false,
        };
      case actions.LOGOUT:
        return {
          ...prevState,
          username: null,
          userToken: null,
          isLoading: false,
        };

      default:
        return initState;
    }
  };
  const [userState, dispatch] = React.useReducer(authReducer, initState);

  // ------------------ Based on the action change the auth data  ------------------
  const authActions = React.useMemo(
    () => ({
      //   retrieving Token from the secure
      retrieveToken: async () => {
        try {
          const userToken = await EncryptedStorage.getItem('auth_session');
          dispatch({type: actions.RETRIEVE_TOKEN, userToken});
          if (userToken) {
            const email = JSON.parse(userToken).username;
            await UserService.getUserByEmail(email).then(res => {
              setUser(res.data);
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
      // Login
      login: async (username, userToken) => {
        dispatch({type: actions.LOGIN, username, userToken});
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
        dispatch({type: actions.LOGOUT});
        try {
          await EncryptedStorage.removeItem('auth_session');
        } catch (error) {
          console.log(error);
        }
      },
      // signup
      signup: async (username, userToken) => {
        dispatch({type: actions.SIGNUP, username, userToken});
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
      <AuthContext.Provider value={{authActions, userState, user, setUser}}>
        <Provider store={store}>
          <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
          <OfflineNotice />
          <NavigationContainer>
            {userState.userToken ? <HomeNavigator /> : <AuthNavigator />}
            {/* {userState.userToken ? <AuthNavigator /> : <AuthNavigator />} */}
          </NavigationContainer>
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
