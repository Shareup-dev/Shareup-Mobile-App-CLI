import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {HeaderWithBackArrow} from '../components/headers';
import Icon from '../components/Icon';
import colors from '../config/colors';

export default function ChatScreen({navigation}) {
  const [message, setMessage] = useState('');

  const MessageCard = ({left}) => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          margin: 5,
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 10,
          maxWidth: '70%',
          alignSelf: left ? 'flex-end' :'flex-start'
        }}>
        <Text
          style={{
            fontWeight: '800',
            fontSize: 14,
          }}>
          Kanesha Lokeesan
        </Text>
        <Text
          style={{
            marginVertical: 3,
            fontSize: 14,
          }}>
         document or a typeface without relying on meaningful content.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderWithBackArrow title={'Kaneshamoorthi Lokeesan'} titleStyle={{fontSize:16}} onBackButton={_ => navigation.goBack()} />
      <View
        style={{
          marginHorizontal: 10,
          justifyContent:'flex-start'

        }}>
        <MessageCard />
        <MessageCard left />
        <MessageCard />
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: 25,
            flexDirection: 'row',
            alignItems: 'center',
          marginHorizontal: 10,
          justifyContent: 'space-between',
          }}>
          <TextInput style={styles.message} placeholder="message" />
          <TouchableOpacity
            style={{
              backgroundColor: colors.iondigoDye,
              padding: 5,
              borderRadius: 25,
            }}>
            <Icon
              noBackground
              name={'send'}
              type="FontAwesome"
              color="#fff"
              backgroundSizeRatio={0.7}
            />
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  forwardArrow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    bottom: 20,
    paddingRight: 15,
    paddingLeft: 10,
  },
  message: {
    borderWidth: 1,
    borderColor: '#cacaca',
    maxHeight: 100,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    borderRadius: 30,
    justifyContent: 'center',
    fontSize: 18,
    height: 45,
    minWidth: '80%',
  },
});
