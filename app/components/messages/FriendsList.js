import React, {useContext, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';

import routes from '../../navigation/routes';
import defaultStyles from '../../config/GlobalStyles';
import ListItem from '../lists/ListItem';
import EmptyNotice from './EmptyNotice';
import ListWrapper from './ListWrapper';
import AuthContext from '../../Contexts/authContext';

export default function FriendsList({navigation, friends, loading, refresh}) {
  const [refreshing, setRefreshing] = useState(false);

  const {user} = useContext(AuthContext);

  const handelRefresh = () => {
    setRefreshing(true);
    refresh();
    setRefreshing(false);
  };

  const directToChatRoom = async item => {
    navigation.navigate(routes.CHAT_SCREEN, {user: item});
  };

  return (
    <ListWrapper loading={loading}>
      <FlatList
        data={friends}
        keyExtractor={friend => friend.id.toString()}
        refreshing={refreshing}
        onRefresh={handelRefresh}
        ListEmptyComponent={<EmptyNotice navigation={navigation} />}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={_ => navigation.navigate(routes.CHAT_SCREEN)}>
            <ListItem
              style={[defaultStyles.listItemStyle, defaultStyles.lightShadow]}
              title={item.firstName}
              image={item.profilePicturePath}
              subTitle="Accepted your request! "
              displayLeft={true}
              tabTitle="Send Message"
              showCloseButton={false}
              onPress={() => directToChatRoom(item)}
            />
          </TouchableOpacity>
        )}
      />
    </ListWrapper>
  );
}
