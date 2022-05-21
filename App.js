import React from 'react';
import {SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import OfflineNotice from './app/components/OfflineNotice';
import Toast from 'react-native-toast-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ShareupAuthentication from './app/util/ShareupAuthentication';

export default function App() {
  console.disableYellowBox = true;

  const config = {
    screens: {
      PostByID: {
        path: 'post/:id/:postType',
        parse: {
          id: id => `${id}`,
          postType: postType => `${postType}`,
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
      <SafeAreaView style={{flex: 1}}>
        <OfflineNotice />
        <GestureHandlerRootView style={{flex: 1}}>
          <NavigationContainer linking={linking}>
            <ShareupAuthentication />
          </NavigationContainer>
        </GestureHandlerRootView>
        <Toast />
      </SafeAreaView>
    </>
  );
}
