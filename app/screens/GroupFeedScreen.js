import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import Icon from '../components/Icon';
import Card from '../components/lists/Card';
import Screen from '../components/Screen';
import WritePost from '../components/WritePost';
import colors from '../config/colors';
import GroupService from '../services/group.service';
import routes from '../navigation/routes';
import store from '../redux/store';
import {HeaderWithBackArrow} from '../components/headers';
import Tab from '../components/buttons/Tab';

import AuthContext from '../Contexts/authContext';
import DownModal from '../components/drawers/DownModal';
import groupScreenDetector from '../redux/groupScreenDetector';
import {postTypeSliceAction} from '../redux/groupIdSlice';
import {useDispatch} from 'react-redux';
import constants from '../config/constants';
import {Texts} from '../Materials/Text';

const windowWidth = Dimensions.get('screen').width;
const GroupFeedScreen = ({navigation, route}) => {
  // const posts = useSelector(state => state.groupPosts);
  const {userData} = useContext(AuthContext).userState;
  const {params: groupData} = route;
  const [group, setGroup] = useState(groupData);
  const [isMember, setIsMember] = useState(false);
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  const isAdmin = () =>
    !!groupData.admins.filter(admin => admin.id === userData.id).length;

  useEffect(() => {
    const getGroupInfo = async () => {
      setLoading(true);
      await Promise.all([
        GroupService.getGroupById(groupData.id),
        GroupService.checkIsMember(groupData.id, userData.id),
        GroupService.getGroupPost(groupData.id),
        GroupService.didRequested(userData.id, groupData.id),
      ])
        .then(res => {
          setGroup(res[0].data);
          setIsMember(res[1].data);
          setPosts(res[2].data);
          setRequested(res[3].data);
        })
        .catch(e => console.error(e))
        .finally(_ => setLoading(false));
    };
    getGroupInfo();
  }, [route.params]);

  useEffect(() => {
    store.dispatch(groupScreenDetector.actions.setGroupScreen());

    return () => {
      navigation.addListener('blur', () => {
        store.dispatch(groupScreenDetector.actions.unSetGroupScreen());
      });
    };
  }, []);
  const deleteGroup = _ => {
    Alert.alert('Delete group?', 'Are you sure to this group?', [
      {text: 'Cancel', style: 'cancel', onPress: () => {}},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          GroupService.deleteGroup(userData.id, groupData.id)
            .then(_ => {
              handleCloseModel();
              navigation.popToTop();
            })
            .catch(e => console.error(e.message)),
      },
    ]);
  };

  const handleJoinGroup = () => {
    GroupService.joinRequest(userData.id, groupData.id)
      .then(({status}) => status === 200 && setRequested(true))
      .catch(e => e);
  };
  const handleExitGroup = () => {
    GroupService.leavegroup(userData.id, groupData.id)
      .then(({status}) => status === 200 && setIsMember(false))
      .catch(e => e);
  };

  const handleCloseModel = () => {
    setMenuOpen(false);
  };

  const checkOwner = () => userData.id === groupData?.owner?.id;
  const DropDownMenu = () => {
    return (
      <View style={styles.menuContainer}>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: '#cacaca',
              width: 80,
              height: 6,
              borderRadius: 6,
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.menu}
          activeOpacity={0.6}
          onPress={_ => {
            navigation.navigate(routes.EDIT_GROUP, groupData);
            setMenuOpen(false);
          }}>
          <Text style={styles.menuText}>Edit</Text>
          <Text>Change the name and Description</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={deleteGroup}>
          <Text style={styles.menuText}>Delete</Text>
          <Text>Delete this group</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menu}
          onPress={_ => {
            navigation.navigate(routes.UPDATE_GROUP_PHOTO, groupData);
            setMenuOpen(false);
          }}>
          <Text style={styles.menuText}>Cover image</Text>
          <Text
            style={{
              maxWidth: windowWidth / 2,
            }}>
            Change cover image
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <Screen style={styles.feedContainer}>
      <HeaderWithBackArrow
        title={group.name}
        onBackButton={() => {
          navigation.popToTop();
        }}
        rightComponent={
          <>
            {checkOwner() && (
              <View style={{flexDirection:"row"}}>
                {/* <TouchableOpacity
                activeOpacity={0.6}
                onPress={_ => setMenuOpen(prev => !prev)}>
                <Icon type="MaterialIcons" name="group-add" />
              </TouchableOpacity> */}
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={_ => setMenuOpen(prev => !prev)}>
                <Icon type="SimpleLineIcons" name="options" />
              </TouchableOpacity>
              </View>
            )}
          </>
        }
      />
      <FlatList
        data={posts}
        ListHeaderComponent={() => {
          return (
            <View>
              <DownModal isVisible={menuOpen} setIsVisible={handleCloseModel}>
                <DropDownMenu />
              </DownModal>
              <Image
                style={styles.groupCoverImage}
                // resizeMode={route.params.image ? 'contain' : 'cover'}
                // resizeMode={'cover'}
                source={
                  group.groupImagePath
                    ? {
                        uri: group.groupImagePath,
                      }
                    : require('../assets/images/group-texture.png')
                }
              />
              <View style={styles.detailContainer}>
                <View style={{marginHorizontal: 10}}>
                  <Texts size={25} style={styles.title}>
                    {group.name}
                  </Texts>
                  <Texts size={15} style={styles.subTitle}>
                    {group.description}
                  </Texts>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Icon name={group.privacySetting ? 'lock' : 'earth'} />
                      <Texts size={12} style={styles.subTitle}>
                        {group.privacySetting ? 'Private' : 'Public'} Group
                      </Texts>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      disabled={!isMember && !checkOwner()}
                      onPress={() => {
                        navigation.navigate(routes.LIST_OF_MEMBERS, groupData);
                      }}>
                      <Texts
                        size={14}
                        style={{fontWeight: '600', fontSize: 15}}>
                        Members
                      </Texts>
                    </TouchableOpacity>
                  </View>

                  {isAdmin() ? (
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
                          data: groupData,
                        });
                      }}
                    />
                  ) : (
                    <Tab
                      iconName={loading ? null : !isMember ? 'people' : 'exit'}
                      iconType="Ionicons"
                      title={
                        loading
                          ? 'Loading'
                          : !isMember
                          ? requested
                            ? 'Requested'
                            : 'Ask to Join'
                          : 'Leave Group'
                      }
                      fontColor={colors.dark}
                      style={[styles.inviteButton]}
                      disabled={loading}
                      onPress={() => {
                        !isMember ? handleJoinGroup() : handleExitGroup();
                      }}
                    />
                  )}
                  <View style={styles.membersCard}></View>
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
                {checkOwner() || isMember ? (
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
            user={item.userdata}
            postData={item}
            postId={item.id}
            userId={item.userdata.id}
            firstName={item.userdata.firstName}
            lastName={item.userdata.lastName}
            profileImage={item.userdata.profilePicturePath}
            date={item.lastEdited}
            postText={item.content}
            imageURL={item.imagePath}
            reactions={item.reactions}
            comments={item.comments}
            navigation={navigation}
            postImages={item.media}
            insideGroup={true}
          />
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  menuContainer: {},
  menu: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  menuText: {
    fontWeight: '600',
    fontSize: 20,
    color: '#585858',
  },
  icon: {
    marginRight: 15,
  },
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
