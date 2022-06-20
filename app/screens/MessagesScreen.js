import React, {useCallback, useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Screen from '../components/Screen';
import {HeaderWithBackArrow} from '../components/headers';
import UserProfilePicture from '../components/UserProfilePicture';
import authContext from '../Contexts/authContext';
import TextField from '../components/TextField';
import Bar from '../components/tab-bar/Bar';
import colors from '../config/colors';
import ChatsList from '../components/messages/ChatsList';
import FriendsList from '../components/messages/FriendsList';
import userService from '../services/user.service';
import chatService from '../services/chat.service';
import { useFocusEffect } from '@react-navigation/native';
import { Texts } from '../Materials/Text';

const tabes = [
  {name: 'Chat'},
  {name: 'Friends'},
  // {name: GROUPS},
  // {name: FAVORITES},
];

export default function MessagesScreen({navigation}) {
  const {
    userState: {userData: user, username},
  } = useContext(authContext);

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('Chat');
  const [chats, setChats] = useState({
    state: [],
    loading: false,
  });

  const fetchChats = () => {
    setChats(prev => ({...prev, loading: true}));
    chatService
      .getAllConversations(username)
      .then(({data}) => {
        setChats(prev => ({...prev, state: data}));
      })
      .catch(e => console.error(e.message))
      .finally(_ => setChats(prev => ({...prev, loading: false})));
  };

  useFocusEffect(
    useCallback(() => {
      if (currentTab === 'Chat') {
      fetchChats();
    }
    }, [currentTab]),
  );

  // useEffect(() => {
  //   if (currentTab === 'Chat') {
  //     fetchChats();
  //   }
  // }, [currentTab]);

  useEffect(() => {
    getFriends();
  }, []);

  const getFriends = async () => {
    setLoading(true);
    userService
      .getFriends(user.email)
      .then(({data}) => setFriends(data))
      .catch(e => console.error(e.message))
      .finally(_ => setLoading(false));
  };

  const handleTabbed = name => {
    setCurrentTab(name);
  };

  return (
    <Screen>
      <HeaderWithBackArrow
        title={user.firstName}
        leftComponent={
          <UserProfilePicture size={45} style={styles.userProfilePicture} />
        }
        onBackButton={() => navigation.goBack()}
      />
      <View style={styles.containerTop}>
        <Texts style={styles.bigFontBlack}>Messages</Texts>
        <TextField
          placeholder="Search"
          iconName="search1"
          iconType="AntDesign"
          style={styles.searchbar}
        />

        <View style={styles.bar}>
          <Bar tabes={tabes} onTab={handleTabbed} currentTab={currentTab} />
        </View>
        {/* <View style={styles.addGroupsContainer}>
          <FancyAddButton style={styles.fancyAddButton} SizeRatio={0.7} />
          <Text style={styles.smallerFont}>Add Groups...</Text>
        </View> */}
      </View>

      <View style={styles.separator} />

      {currentTab === 'Chat' && (
        <ChatsList
          navigation={navigation}
          chats={chats.state}
          loading={chats.loading}
        />
      )}
      {currentTab === 'Friends' && (
        <FriendsList
          navigation={navigation}
          friends={friends}
          loading={loading}
          refresh={getFriends}
        />
      )}

      {currentTab == ''}
    </Screen>
  );
}

const styles = StyleSheet.create({
  containerTop: {
    marginHorizontal: 20,
  },
  userProfilePicture: {
    marginHorizontal: 10,
  },
  bigFontBlack: {
    fontSize: 25,
    fontWeight: '500',
  },
  searchbar: {
    marginTop: 10,
  },
  bar: {marginTop: 5},
  addGroupsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  smallerFont: {
    marginLeft: 20,
    fontSize: 11,
    color: colors.mediumGray,
  },
  separator: {
    width: '100%',
    height: 2,
    backgroundColor: colors.LightGray,
    marginVertical: 16,
  },
});
