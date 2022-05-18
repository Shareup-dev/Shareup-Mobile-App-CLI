import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import {HeaderWithBackArrow} from '../components/headers';
import Icon from '../components/Icon';
import colors from '../config/colors';

export default function ChatScreen({navigation}) {
  const [message, setMessage] = useState('');

  const MessageCard = ({right}) => {
    return (
      <View
        style={{
          alignSelf: right ? 'flex-end' : 'flex-start',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            margin: 5,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 10,
            maxWidth: '70%',
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
        <Text
          style={{
            textAlign: right ? 'right' : 'left',
            marginHorizontal: 15,
            fontSize: 12,
          }}>
          12:00
        </Text>
      </View>
    );
  };
  const {width} = Dimensions.get('window');
  return (
    <View style={styles.container}>
      <HeaderWithBackArrow
        title={'Kaneshamoorthi Lokeesan'}
        titleStyle={{fontSize: 16}}
        onBackButton={_ => navigation.goBack()}
        rightComponent={
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="md-videocam-outline"
              type="Ionicons"
            />
            <Icon name="phone-call" type="Feather" />
            <Icon name="options" type="SimpleLineIcons" />
          </View>
        }
      />
      <FlatList 
      inverted
        style={{
          paddingHorizontal: 10,
          flex: 1,
          marginBottom: 90,
        }}       
        
        data={[1,20,3,4,56,7,6,85,6]}
        keyExtractor={(item,i) => i.toString()}
        renderItem={({item}) => <MessageCard right={item >10 ? true : false} />}
      />
  
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 15,
          justifyContent: 'space-between',
          width: width,
          backgroundColor: '#fff',
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
    backgroundColor: '#cacaca60',
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
