import React, {useContext, useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';

import {HeaderWithBackArrow} from '../components/headers';
import ChatListItem from '../components/messages/ChatListItem';
import AuthContext from '../Contexts/authContext';
import chatService from '../services/chat.service';

export default function ArchivedChatScreen({navigation}) {
  const {
    userState: {username},
  } = useContext(AuthContext);

  const [archivedChat, setArchivedChat] = useState({
    state: [],
    loading: false,
  });

  const fetchArchivedChat = () => {
    setArchivedChat(prev => ({...prev, loading: true}));
    chatService
      .getAllArchivedChat(username)
      .then(({data}) => setArchivedChat(prev => ({...prev, state: data})))
      .catch(e => console.error(e.message))
      .finally(_ => setArchivedChat(prev => ({...prev, loading: false})));
  };

  useEffect(() => {
    fetchArchivedChat();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderWithBackArrow
        title={'Archived Chat'}
        onBackButton={_ => navigation.goBack()}
      />
      <FlatList
        data={archivedChat.state}
        keyExtractor={item => item.id.toString()}
        refreshing={archivedChat.loading}
        ListEmptyComponent={
          <View
            style={{
              marginVertical: 15,
              alignItems: 'center',
            }}>
            <Text>No item found</Text>
          </View>
        }
        renderItem={({item}) => (
          <ChatListItem
            item={item}
            navigation={navigation}
            onPress={() => {
              navigation.navigate(routes.CHAT_SCREEN, {
                user: {
                  email: item.user1,
                  firstName: item.user1FullName,
                  lastName: '',
                },
              });
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
