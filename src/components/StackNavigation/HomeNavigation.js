import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import {AuthContext} from '../context';

export default function HomeNavigation(props) {
  const AuthActions = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <TouchableOpacity onPress={() => AuthActions.logout()}>
        <Text>out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
