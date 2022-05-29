import React, {useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import routes from '../../navigation/routes';

import ChatListItem from './ChatListItem';
import EmptyNotice from './EmptyNotice';
import ListWrapper from './ListWrapper';

export default function ChatsList({navigation, loading, chats}) {
  const ArchivedChatComponent = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate(routes.ARCHIVED_CHAT)}
      style={{
        alignItems: 'center',
      }}>
      <Text style={{fontWeight: '600', fontSize: 15, marginVertical: 10}}>
        Archived chats
      </Text>
    </TouchableOpacity>
  );

  return (
    <ListWrapper loading={loading}>
      <FlatList
        data={chats}
        keyExtractor={item => item.id.toString()}
        refreshing={loading}
        ListEmptyComponent={<EmptyNotice navigation={navigation} />}
        ListFooterComponent={<ArchivedChatComponent />}
        renderItem={({item}) => (
          <ChatListItem
            item={item}

            profilePicture={item.user2ProfilePicture}
            navigation={navigation}
            onPress={() => {
              navigation.navigate(routes.CHAT_SCREEN, {
                user: {
                  email: item.user2,
                  firstName: item.user2FullName,
                  lastName: '',
                },
              });
            }}
          />
        )}
      />
    </ListWrapper>
  );
}
