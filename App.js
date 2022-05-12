import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import OfflineNotice from './app/components/OfflineNotice';
import Toast from 'react-native-toast-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ShareupAuthentication from './app/util/ShareupAuthentication';
import routes from './app/navigation/routes';

export default function App() {
  console.disableYellowBox = true;

  const config = {
    screens: {
      'PostByID': {
        path: 'post/:id',
        parse: {
          id: id => `${id}`,
        },
      },
    },
  };
  const linking = {
    prefixes: ['shareup://', 'https://shareup.qa'],
    config,
  };
  return (
    <>
      <OfflineNotice />
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer linking={linking}>
          <ShareupAuthentication />
        </NavigationContainer>
      </GestureHandlerRootView>
      <Toast />
    </>
  );
}
