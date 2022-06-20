import React, {useContext} from 'react';
import {View, StyleSheet, Text,TouchableOpacity} from 'react-native';

import colors from '../../config/colors';
import UserProfilePicture from '../UserProfilePicture';
import Tab from '../buttons/Tab';
import IconBar from '../tab-bar/IconBar';
import routes from '../../navigation/routes';
import Posts from './Posts';
import AuthContext from '../../Contexts/authContext';
import FriendService from '../../services/friends.service';
import {Texts, Title, Header} from '../../Materials/Text';

const profilePictureSize = 70;

export default function ProfileTop({
  navigation,
  currentTab,
  onIconBarTab,
  tabs,
  user,
  numberOfPosts,
  userStatus,
  setUserStatus,
}) {
  console.log(user);

  const tabes = [
    { name: 'Friends' },
    { name: 'Followers' },
    { name: "Following" },
    // {name: FAVORITES},
];
  const {
    userState: {userData},
  } = useContext(AuthContext);

  const sendFriendRequest = () => {
    FriendService.sendRequest(userData.id, user.id)
      .then(
        ({status}) =>
          status === 200 &&
          setUserStatus(prev => ({...prev, state: 'FriendRequested'})),
      )
      .catch(e => console.error(e.message));
  };
  const acceptRequest = () => {
    FriendService.acceptRequest(userData.id, user.id)
      .then(
        ({status}) =>
          status === 200 && setUserStatus(prev => ({...prev, state: 'Friend'})),
      )
      .catch(e => console.error(e.message));
  };
  const declineRequest = () => {
    FriendService.declineRequest(userData.id, user.id)
      .then(
        ({status}) =>
          status === 200 &&
          setUserStatus(prev => ({...prev, state: 'Unfriend'})),
      )
      .catch(e => console.error(e.message));
  };
  const Unfriend = () => {
    FriendService.removeFriends(userData.id, user.id)
      .then(
        ({status}) =>
          status === 200 &&
          setUserStatus(prev => ({...prev, state: 'Unfriend'})),
      )
      .catch(e => console.error(e.message));
  };

  const ActionButton = () => {
    switch (userStatus.state) {
      case 'Unfriend':
        return (
          <Tab
            title="Send Request"
            color={colors.LightGray}
            style={styles.editProfileButton}
            titleStyle={styles.editProfileButtonTitle}
            onPress={sendFriendRequest}
          />
        );

      case 'FriendRequested':
        return (
          <Tab
            title="Cancel Request"
            color={colors.iondigoDye}
            style={styles.editProfileButton}
            titleStyle={[styles.editProfileButtonTitle, {color: '#fff'}]}
            onPress={declineRequest}
          />
        );
      case 'Friend':
        return (
          <Tab
            title="Unfriend"
            color={colors.LightGray}
            style={styles.editProfileButton}
            titleStyle={styles.editProfileButtonTitle}
            onPress={Unfriend}
          />
        );
      case 'FriendResponse':
        return (
          <View style={{flexDirection: 'row'}}>
            <Tab
              title="Accept"
              color={colors.iondigoDye}
              style={styles.editProfileButton}
              titleStyle={[styles.editProfileButtonTitle, {color: '#fff'}]}
              onPress={Unfriend}
            />
            <Tab
              title="Reject"
              color={colors.LightGray}
              style={styles.editProfileButton}
              titleStyle={styles.editProfileButtonTitle}
            />
          </View>
        );

      default:
        return (
          <Tab
            title={null}
            disabled={true}
            color={colors.LightGray}
            fontColor={colors.LightGray}
            style={styles.editProfileButton}
            titleStyle={styles.editProfileButtonTitle}
          />
        );
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.padding}>
        <View style={styles.row1}>
          <View style={styles.profilePicture}>
            <UserProfilePicture
              profilePicture={user.profilePicturePath}
              size={profilePictureSize}
            />
            {/* <Icon
              name="pluscircle"
              type="AntDesign"
              color={colors.iondigoDye}
              style={styles.addProfilePictureIcon}
              backgroundSizeRatio={1}
              size={25}
            /> */}
          </View>
          <View style={styles.counterWrapper}>
            <Texts size={14} color={colors.dark} style={styles.bold}>
              {user.numberOfPosts ? user.numberOfPosts : numberOfPosts}
            </Texts>
            <Texts size={14} color={colors.dark} style={styles.bold}>
              Posts
            </Texts>
          </View>

          <TouchableOpacity style={styles.counterWrapper} onPress={()=>{navigation.navigate(routes.LIST_FRIENDS_FOLLOWERS,{SelectedTab:"Friends",user:user,tabes:tabes,showHeader:true})}}>
            <Texts size={14} color={colors.dark} style={styles.bold}>
              {user.numberOfFriends}
            </Texts>
            <Texts size={14} color={colors.dark} style={styles.bold}>
              Friends{' '}
            </Texts>
          </TouchableOpacity>


          <TouchableOpacity style={styles.counterWrapper} onPress={()=>{navigation.navigate(routes.LIST_FRIENDS_FOLLOWERS,{SelectedTab:"Followers",user:user,tabes:tabes,showHeader:true})}}>
            <Texts size={14} color={colors.dark} style={styles.bold}>
              {user.numberOfFollowers}
            </Texts>
            <Texts size={14} color={colors.dark} style={styles.bold}>
              Followers{' '}
            </Texts>
          </TouchableOpacity>

          <TouchableOpacity style={styles.counterWrapper} onPress={()=>{navigation.navigate(routes.LIST_FRIENDS_FOLLOWERS,{SelectedTab:"Following",user:user,tabes:tabes,showHeader:true})}}>
            <Texts size={14} color={colors.dark} style={styles.bold}>
              {user.numberOfFollowing}
            </Texts>
            <Texts size={14} color={colors.dark} style={styles.bold}>
              Following
            </Texts>
          </TouchableOpacity>

          {/* <View style={styles.counterWrapper}>
            <Texts size={20} color={colors.dark} style={{fontWeight:"600"}}>{user.numberOfFollowing}</Texts>
            <Texts size={15} color={colors.dark} style={{fontWeight:"400",marginTop:5}}>Following</Texts>
          </View> */}
        </View>

        {/** Row 2 */}
        <View style={styles.row2}>
          <Header
            style={styles.bold}
            color={colors.dark}>{`${user.firstName} ${user.lastName}`}</Header>
          {/* <Texts size={20} color={colors.dark} style={styles.username}></Texts> */}

          <Texts size={13} color={colors.dimGray} style={{marginTop:5}}>
            {user.aboutme}
          </Texts>

          {user.id === userData.id ? (
            <Tab
              title="Edit Profile"
              color={colors.LightGray}
              style={styles.editProfileButton}
              titleStyle={styles.editProfileButtonTitle}
              onPress={() => navigation.navigate(routes.EDIT_PROFILE)}
            />
          ) : (
            <ActionButton />
          )}
        </View>
      </View>
      {/* {user.id === userData.id && (
        <StoriesList navigation={navigation} style={styles.storiesList} />
      )} */}

      <IconBar tabs={tabs} currentTab={currentTab} onTab={onIconBarTab} />

      {user.id === userData.id && currentTab === 'posts' && (
        <Posts navigation={navigation} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
    marginTop:5,
  },
  container: {
    marginBottom: 10,
  },
  padding: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  row1: {
    justifyContent:'space-between',
    flexDirection: 'row',
    
  },
  profilePicture: {
    width: profilePictureSize,
    height: profilePictureSize,
    marginRight: 10,
  },
  addProfilePictureIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  counterWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: 5,
  },
  row2: {
    marginTop: 20,
  },
  username: {
    fontWeight: '600',
    marginBottom: 5,
  },
  editProfileButton: {
    marginTop: 20,
    marginBottom: 10,
    flex: 1,
    borderRadius: 10,
  },
  editProfileButtonTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  storyCard: {
    marginVertical: 10,
    marginRight: 10,
  },
  storiesContainer: {
    marginBottom: 10,
  },
  createStoryCard: {
    marginVertical: 10,
    marginRight: 5,
  },
  storiesList: {
    marginTop: 10,
  },
});
