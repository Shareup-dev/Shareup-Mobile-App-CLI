import React, { useState} from 'react';
import {FlatList} from 'react-native';
import routes from '../../navigation/routes';

import ChatListItem from './ChatListItem';
import EmptyNotice from './EmptyNotice';
import ListWrapper from './ListWrapper';

export default function ChatsList({navigation, loading,chats}) {

  return (
    <ListWrapper loading={loading}>
      <FlatList
        data={chats}
        keyExtractor={item => item.id.toString()}
        refreshing={loading}
        ListEmptyComponent={<EmptyNotice navigation={navigation} />}
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
    </ListWrapper>
  );
}
