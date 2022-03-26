import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  Touchable,
} from 'react-native';
import {useSelector} from 'react-redux';

import AppButton from '../components/buttons/Button';
import FeedTop from '../components/FeedTop';
import Icon from '../components/Icon';
import Card from '../components/lists/Card';
import Screen from '../components/Screen';
import WritePost from '../components/WritePost';
import colors from '../config/colors';
import GroupService from '../services/group.service';
import routes from '../navigation/routes';
import {groupPostsActions} from '../redux/groupPosts';
import store from '../redux/store';

import {HeaderWithBackArrow} from '../components/headers';
import Tab from '../components/buttons/Tab';
import fileStorage from '../config/fileStorage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AuthContext from '../authContext';
import {Divider} from 'react-native-paper';

const GroupFeedScreen = ({navigation, route}) => {
  const posts = useSelector(state => state.groupPosts);
  const {userData} = useContext(AuthContext).userState;
  const {params: groupData} = route;

  const [group, setGroup] = useState(groupData);
  const [join, setJoin] = useState(false);

  // useEffect(() => {
  //   GroupService.getGroupsPostsById(route.params.groupId).then(resp => {
  //     store.dispatch(groupPostsActions.setPosts(resp.data));
  //   });
  //   return () => {
  //     store.dispatch(groupPostsActions.setPosts(null));
  //   };
  // }, [route.params.groupId]);

  useEffect(() => {
    GroupService.getGroupById(groupData.id)
      .then(res => setGroup(res.data))
      .catch(e => console.log(e));
  }, []);

  const handleJoinGroup = () => {
    GroupService.joinRequest(userData.id, groupData.id)
      .then(res => setJoin(true))
      .catch(e => e);
  };
  const handleExitGroup = () => {
    GroupService.leavegroup(userData.id, groupData.id)
      .then(res => setJoin(false))
      .catch(e => e);
  };

  return (
    <Screen style={styles.feedContainer}>
      <HeaderWithBackArrow
        title={group.name}
        onBackButton={() => {
          navigation.popToTop();
        }}
      />
      <FlatList
        data={posts}
        ListHeaderComponent={() => {
          return (
            <View>
              <Image
                style={styles.groupCoverImage}
                // resizeMode={route.params.image ? 'contain' : 'cover'}
                // resizeMode={'cover'}
                source={
                  group.image
                    ? {
                        uri: fileStorage.baseUrl + group.image,
                      }
                    : require('../assets/images/group-texture.png')
                }
              />
              <View style={styles.detailContainer}>
                <View style={{marginHorizontal: 20}}>
                  <Text style={styles.title}>{group.name}</Text>
                  <Text style={styles.subTitle}>{group.description}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name={group.privacySetting ? 'lock' : 'earth'} />
                    <Text style={styles.subTitle}>
                      {group.privacySetting ? 'Private' : 'Public'} Group
                    </Text>
                  </View>
                  {userData.id === group.owner?.id ? (
                    <Tab
                      iconName="add-circle"
                      iconType="Ionicons"
                      title={'invite'}
                      fontColor={colors.dark}
                      style={styles.inviteButton}
                      onPress={() => {
                        navigation.navigate(routes.INVITE_GROUP_MEMBERS, {
                          id: group.id,
                          newGroup: false,
                        });
                      }}
                    />
                  ) : (
                    <Tab
                      iconName={!join ? 'people' : 'exit'}
                      iconType="Ionicons"
                      title={!join ? 'Join Group' : 'Left Group'}
                      fontColor={colors.dark}
                      style={[styles.inviteButton]}
                      onPress={() => {
                        !join ? handleJoinGroup() : handleExitGroup();
                      }}
                    />
                  )}

                  {/* <AppButton
                    icon={
                      <Icon
                        style={styles.inviteIcon}
                        size={40}
                        type={"Ionicons"}
                        name={"add-circle"}
                      />
                    }
                    title={"invite"}
                    fontColor={colors.dark}
                    style={styles.inviteButton}
                    onPress={() => {
                      navigation.navigate(routes.INVITE_GROUP_MEMBERS, {
                        groupId: route.params.groupId,
                        newGroup: false,
                      });
                    }}
                  /> */}
                </View>
                {userData.id === group.owner?.id ? (
                  <WritePost
                    groupPost={true}
                    groupId={group.id}
                    navigation={navigation}
                  />
                ) : (
                  <View
                    style={{
                      borderBottomColor: '#cacaca',
                      borderWidth: 0.5,
                      opacity: 0.5,
                    }}
                  />
                )}
                {posts?.length === 0 && (
                  <View>
                    <Text style={styles.noPostsLabel}>No posts found !</Text>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        keyExtractor={post => {
          return post.id.toString();
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <Card
            postId={item.id}
            userId={item.user.id}
            firstName={item.user.firstName}
            lastName={item.user.lastName}
            profileImage={item.user.profilePicturePath}
            date={item.lastEdited}
            postText={item.content}
            imageURL={item.imagePath}
            reactions={item.reactions}
            comments={item.comments}
            navigation={navigation}
            postImages={item.media}
          />
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  feedContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: colors.white,
    // flex: 1,
  },
  groupCoverImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    // backgroundColor: "crimson",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 14,
    color: colors.mediumGray,
  },
  inviteIcon: {
    fontSize: 30,
    marginHorizontal: 10,
    backgroundColor: colors.lighterGray,
  },
  inviteButton: {
    backgroundColor: colors.lighterGray,
    color: colors.dark,
    elevation: 0,
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  noPostsLabel: {
    fontSize: 24,
    color: colors.LightGray,
    textAlign: 'center',
    marginTop: 80,
  },
});

export default GroupFeedScreen;
