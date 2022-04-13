import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Text,
} from 'react-native';
import CommentTextField from '../components/comments/CommentTextField';
import {HeaderWithBackArrow} from '../components/headers';
import UserProfilePicture from '../components/UserProfilePicture';

export default function AddCommentsOnReels({navigation}) {
  const CommentCard = () => {
    return (
      <View
        style={{
          // backgroundColor:"crimson",
          marginVertical: 5,
          padding: 5,
          borderRadius: 5,
          borderBottomColor: '#cacaca40',
          borderBottomWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <UserProfilePicture size={45} style={{marginHorizontal: 15}} />
        <View>

        <View style={{
            backgroundColor:'#eee',
            paddingVertical: 5,
            paddingHorizontal: 15,
            borderRadius:15,
            maxWidth:'90%'
        }}>
          <Text style={{fontWeight:'600',color:'#000000', fontSize:13}}>Kaneshamoorthi Lokeesan</Text>
          <Text style={{fontSize:13}}>This is awesomeThis is awesomeThis is awesomeThis </Text>
        </View>
          <Text style={{fontSize:11,}}>2 hours ago</Text>
            </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <HeaderWithBackArrow
        title={'Comments'}
        titleStyle={{fontSize: 19}}
        onBackButton={_ => navigation.goBack()}
      />
      <View
        // activeOpacity={0.9}
        // onPress={Keyboard.dismiss}
        style={{
          marginHorizontal: 10,
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <FlatList
          data={['hi','hi','hi','hi','hi','hi','hi','hi','hi','hi','hi','hi','hi','hi','hi', '125']}
          key={(item, i) => i.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <CommentCard item={item} />}
          scrollsToTop
        />
        <View
          style={{
            marginBottom: '5%',
          }}>
          <CommentTextField />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd90',
  },
});
